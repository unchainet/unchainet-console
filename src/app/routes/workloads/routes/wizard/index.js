import React from "react";
import update from "immutability-helper";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  FormControl,
  FormControlLabel,
  FormHelperText
} from "material-ui/Form";
import Select from "material-ui/Select";
import MenuItem from "material-ui/Menu/MenuItem";
import Checkbox from "material-ui/Checkbox";
import { InputLabel } from "material-ui/Input";
import Radio, { RadioGroup } from "material-ui/Radio";
import Map from "components/map";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles/index";
import { compose } from "redux";
import { fetchAllRegion } from "actions/Region";
import { fetchAllDatacenter } from "actions/Datacenter";
import { processWorkload } from "actions/Workload";
import CardLayout from "components/CardLayout";
import DkCodeMirror from "components/DkCodeMirror";
import "codemirror/mode/yaml/yaml";
import { round } from "util/Format";
import { genWorkloadName } from "util/Generator";
import { goToTourStep } from "actions/Tour";
import PropTypes from "prop-types";
import _ from "lodash";
import styles from "./styles";

class ConfigWizard extends React.Component {
  constructor(props) {
    super(props);
    this.setActiveStep = this.setActiveStep.bind(this);
    this.saveWorkload = this.saveWorkload.bind(this);
    this.fields = {
      name: this.getFieldInfo(true, 0),
      region: this.getFieldInfo(true, 1),
      sameNetwork: this.getFieldInfo(false, 2),
      computeProfile: this.getFieldInfo(false, 3),
      numCPU: this.getFieldInfo(false, 3),
      ssdGB: this.getFieldInfo(false, 3),
      maxBidCRC: this.getFieldInfo(false, 4),
      containerType: this.getFieldInfo(false, 5),
      containerImageUrl: this.getFieldInfo(true, 5, {
        name: "containerType",
        value: "Docker"
      }),
      containerImageName: this.getFieldInfo(true, 5, {
        name: "containerType",
        value: "Docker"
      }),
      kubernetesConfig: this.getFieldInfo(true, 5, {
        name: "containerType",
        value: "Kubernetes"
      })
    };
    this.state = {
      activeStep: 0,
      isNew: true,
      activeStepError: null,
      mapLocation: { lat: -33.8527273, lng: 151.2345705 },
      mapZoom: 11,
      minQualityScore: 50,
      name: genWorkloadName(this.props.user),
      numCPU: 1,
      numGPU: 0,
      ssdGB: 10,
      containerType: "Kubernetes",
      datacenter: "",
      region: "",
      containerImageUrl: "",
      containerImageName: "",
      kubernetesConfig: require("./kubernetesConfig.yaml"),
      status: "requested",
      sameNetwork: false,
      maxBidCRC: 4,
      computeProfile: "balanced",
      publicIP: "52.65.63.123",
      publicHostname: "http://workload1.aiml.syd.unchai.net/"
    };
  }

  saveWorkload() {
    this.props.processWorkload(
      _.omit(this.state, ["activeStep", "activeStepError", "mapLocation"])
    );
    this.props.history.push("/app/workloads");
    this.props.goToTourStep(9);
  }

  componentDidMount() {
    this.props.fetchAllRegion();

    let paramId = this.props.match.params.id;

    let isNew = !paramId;

    debugger;

    if (paramId) {
      const { list } = this.props.workloads;
      let found = list && _.find(list, { _id: paramId });
      if (found) {
        this.setState({
          ...this.state,
          ...found,
          region: found.region.hasOwnProperty("_id")
            ? found.region._id
            : found.region, //todo change after model clarification
          isNew
        });
      }
    }
  }

  profileMultipliers = {
    memory: {
      balanced: 1,
      cpuIntensive: 0.5,
      memoryIntensive: 2
    },
    cpuCosts: {
      balanced: 1,
      cpuIntensive: 0.7,
      memoryIntensive: 1.3
    }
  };

  crcPerGbTransferred = 0.001;

  hasError(name) {
    const field = this.fields[name];
    const { activeStep, activeStepError } = this.state;
    const value = this.getFieldStateValue(name);

    return (
      (field.dirty ||
        (activeStep === activeStepError && activeStep === field.step)) &&
      !value
    );
  }

  getFieldInfo(required, step, depend = {}) {
    return {
      required: required,
      depend: depend,
      dirty: false,
      error: false,
      step: step
    };
  }

  getFieldStateValue(name) {
    let val = this.state[name];
    val = typeof val === "string" ? val.trim() : val;
    return val;
  }

  setActiveStep(from, to) {
    if (from < to) {
      const requiredEmptyFields = _.pickBy(this.fields, (field, fieldName) => {
        let isRequiredEmptyField =
          field.step === from &&
          field.required === true &&
          !this.getFieldStateValue(fieldName);
        isRequiredEmptyField = field.depend.name
          ? isRequiredEmptyField &&
            this.getFieldStateValue(field.depend.name) === field.depend.value
          : isRequiredEmptyField;
        return isRequiredEmptyField;
      });

      if (_.size(requiredEmptyFields) === 0) {
        this.setState({
          activeStep: to,
          activeStepError: null
        });
      } else {
        this.setState({
          activeStepError: from
        });
      }
    } else {
      this.setState({
        activeStep: to,
        activeStepError: null
      });
    }
  }

  handleDataChange = (name, type = "text") => event => {
    let ctrlValue = null;
    if (type === "bool") {
      ctrlValue = event.target.checked;
    } else if (
      event === null ||
      typeof event === "number" ||
      typeof event === "string"
    ) {
      ctrlValue = event;
    } else {
      ctrlValue = event.target.value;
    }
    let value = type === "int" ? parseInt(ctrlValue) : ctrlValue;
    this.fields[name].dirty = true;
    let newState = update(this.state, { [name]: { $set: value } });
    let promise = new Promise((resolve, reject) => {
      this.setState(newState, () => resolve());
    });
    return promise;
  };

  changeMapRegion = region => {
    const { regions } = this.props;
    let selectedRegion = regions.allRegions.find(i => i._id === region);
    let newState = update(this.state, {
      mapLocation: {
        $set: {
          lng: selectedRegion.location.geo[0],
          lat: selectedRegion.location.geo[1]
        }
      }
      //mapZoom: {$set: selectedRegion.zoom},
    });
    this.setState(newState);
    this.props.goToTourStep(3);
  };

  getNumOfResources = resNum => {
    return round(
      (100 - this.state.minQualityScore * 0.9) /
        100 *
        (this.state.sameNetwork ? 0.5 : 1) *
        resNum
    );
  };

  getMemGb = () => {
    const { computeProfile, numCPU } = this.state;
    const {
      balanced,
      cpuIntensive,
      memoryIntensive
    } = this.profileMultipliers.memory;
    let coe = null;
    if (computeProfile === "balanced") {
      coe = balanced;
    } else if (computeProfile === "cpuIntensive") {
      coe = cpuIntensive;
    } else {
      coe = memoryIntensive;
    }

    return (numCPU * coe).toLocaleString();
  };

  getEstimatedCpuRamCosts = () => {
    const { computeProfile, numCPU } = this.state;
    const {
      balanced,
      cpuIntensive,
      memoryIntensive
    } = this.profileMultipliers.cpuCosts;
    let cpuCoe = null;

    if (computeProfile === "balanced") {
      cpuCoe = balanced;
    } else if (computeProfile === "cpuIntensive") {
      cpuCoe = cpuIntensive;
    } else {
      cpuCoe = memoryIntensive;
    }
    return numCPU * cpuCoe;
  };

  getEstimatedStorageCosts = () => {
    return this.state.ssdGB * 0.01;
  };

  getTotalCosts = () => {
    return this.getEstimatedStorageCosts() + this.getEstimatedCpuRamCosts();
  };

  render() {
    const { classes, regions } = this.props;
    const {
      region,
      name,
      sameNetwork,
      activeStep,
      computeProfile,
      numCPU,
      ssdGB,
      maxBidCRC,
      containerType,
      containerImageUrl,
      containerImageName,
      kubernetesConfig,
      minQualityScore,
      isNew
    } = this.state;
    const state = this.state;
    const selectedRegion = regions.allRegions.find(el => el._id === region);

    const codeMirrorOptions = {
      lineNumbers: true,
      mode: "text/x-yaml",
      lineWrapping: true
    };

    return (
      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="row justify-content-around">
            <div className="col-lg-8 col-md-10">
              <CardLayout>
                <div className={classes.form}>
                  {activeStep === 0 && (
                    <section>
                      <SectionHeader
                        activeStep={activeStep}
                        label="Name"
                        isNew={isNew}
                      />
                      <FormControl className={classes.formControl}>
                        <TextField
                          label="Workload Name"
                          required
                          inputProps={{
                            name: "name"
                          }}
                          onChange={this.handleDataChange("name")}
                          value={name}
                          className="tour-workload-name formInputText"
                          style={{ minWidth: "230px" }}
                          error={this.hasError("name")}
                          helperText={"Enter unique workload identifier"}
                        />
                      </FormControl>
                      <FormButtons
                        activeStep={activeStep}
                        onCancel={() =>
                          this.props.history.push("/app/workloads")
                        }
                        onNext={() => {
                          this.setActiveStep(0, 1);
                          this.props.goToTourStep(2);
                        }}
                      />
                    </section>
                  )}

                  {activeStep === 1 && (
                    <section>
                      <SectionHeader
                        activeStep={activeStep}
                        label="Location"
                        isNew={isNew}
                      />

                      <FormControl
                        className={classes.formControl}
                        error={this.hasError("region")}
                      >
                        <InputLabel htmlFor="region">Region</InputLabel>
                        <Select
                          value={region}
                          onChange={e => {
                            this.handleDataChange("region")(e).then(() => {
                              this.changeMapRegion(e.target.value);
                            });
                          }}
                          inputProps={{
                            id: "region"
                          }}
                          required
                          className={
                            classes.formInput + " tour-workload-region"
                          }
                        >
                          {regions.allRegions.map(i => (
                            <MenuItem key={i._id} value={i._id}>
                              {i.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{"Enter region"}</FormHelperText>
                      </FormControl>
                      {selectedRegion && (
                        <div className="row justify-content-around">
                          <div className="col-lg-6 col-md-6">
                            <div className="jr-card tour-available-resources">
                              <div className="jr-card-header-color bg-primary d-flex">
                                Available resources
                              </div>
                              <div className="jr-card-body">
                                <div className={classes.resources}>
                                  <div>
                                    <h6>vCPU (cores)</h6>{" "}
                                    <span className="text-red">
                                      {selectedRegion.numCPU.toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <h6>RAM (GB)</h6>{" "}
                                    <span className="text-amber">
                                      {selectedRegion.memGB.toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <h6>GPU (cores)</h6>{" "}
                                    <span className="text-blue">
                                      {selectedRegion.numGPU.toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <h6>Storage - SSD (GB)</h6>{" "}
                                    <span className="text-green">
                                      {selectedRegion.storageGB.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 pb-3">
                            <Map
                              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA0wwNWl1SoRNcHLmE94ST06IOSAn4WLho&v=3.exp&libraries=geometry,drawing,places"
                              loadingElement={<div />}
                              containerElement={
                                <div style={{ height: `300px` }} />
                              }
                              mapElement={<div style={{ height: `100%` }} />}
                              center={state.mapLocation}
                              zoom={state.mapZoom}
                            />
                          </div>
                        </div>
                      )}

                      <FormButtons
                        activeStep={activeStep}
                        onCancel={() =>
                          this.props.history.push("/app/workloads")
                        }
                        onNext={() => {
                          this.setActiveStep(1, 2);
                          this.props.goToTourStep(4);
                        }}
                        onPrevious={() => this.setActiveStep(1, 0)}
                      />
                    </section>
                  )}

                  {activeStep === 2 && (
                    <section>
                      <SectionHeader
                        activeStep={activeStep}
                        label="Quality"
                        isNew={isNew}
                      />

                      <div className="row pb-4">
                        <div className="col-lg-6 col-md-6 tour-quality-score">
                          <SliderField
                            label={
                              <span>
                                Set minimal Quality Score:{" "}
                                <span className="text-blue">
                                  {state.minQualityScore}
                                </span>
                              </span>
                            }
                            min={0}
                            max={100}
                            value={minQualityScore}
                            onChange={v =>
                              this.setState({ minQualityScore: v })
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="jr-card">
                            <div className="jr-card-header-color bg-primary d-flex">
                              Available resources
                            </div>
                            <div className="jr-card-body">
                              <div className={classes.resources}>
                                <div>
                                  <h6>vCPU (cores)</h6>{" "}
                                  <span className="text-red">
                                    {this.getNumOfResources(
                                      selectedRegion.numCPU
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <h6>RAM (GB)</h6>{" "}
                                  <span className="text-amber">
                                    {this.getNumOfResources(
                                      selectedRegion.memGB
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <h6>GPU (cores)</h6>{" "}
                                  <span className="text-blue">
                                    {this.getNumOfResources(
                                      selectedRegion.numGPU
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <h6>Storage - SSD (GB)</h6>{" "}
                                  <span className="text-green">
                                    {this.getNumOfResources(
                                      selectedRegion.storageGB
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={classes.formControl}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              className={"tour-same-network"}
                              checked={sameNetwork}
                              onChange={this.handleDataChange(
                                "sameNetwork",
                                "bool"
                              )}
                            />
                          }
                          label="Deploy to the same datacenter (fast network)"
                        />
                      </div>
                      <FormButtons
                        activeStep={activeStep}
                        onCancel={() =>
                          this.props.history.push("/app/workloads")
                        }
                        onNext={() => {
                          this.setState({ activeStep: 3 });
                          this.props.goToTourStep(5);
                        }}
                        onPrevious={() => this.setState({ activeStep: 1 })}
                      />
                    </section>
                  )}

                  {activeStep === 3 && (
                    <section>
                      <SectionHeader
                        activeStep={activeStep}
                        label="Resources configuration"
                        isNew={isNew}
                      />

                      <div className="row justify-content-start">
                        <div className="col-lg-6 col-md-6 tour-profile-resources">
                          <FormControl className={classes.formControl}>
                            <h4>Compute Profile</h4>
                            <RadioGroup
                              value={computeProfile}
                              onChange={this.handleDataChange("computeProfile")}
                            >
                              <FormControlLabel
                                value="balanced"
                                control={<Radio />}
                                classes={{ root: classes.radioWithDesc }}
                                label={
                                  <RadioLabel
                                    classes={classes}
                                    label="Balanced"
                                    description={
                                      <div>
                                        Optimized for the most common workloads.
                                        The ratio of vCPU and RAM is 1:1.
                                      </div>
                                    }
                                  />
                                }
                              />
                              <FormControlLabel
                                value="cpuIntensive"
                                control={<Radio />}
                                classes={{ root: classes.radioWithDesc }}
                                label={
                                  <RadioLabel
                                    classes={classes}
                                    label="CPU intensive"
                                    description={
                                      <div>
                                        Optimized for CPU intensive workloads.
                                        The ratio of vCPU and RAM is 1:{
                                          this.profileMultipliers.memory
                                            .cpuIntensive
                                        }.
                                      </div>
                                    }
                                  />
                                }
                              />
                              <FormControlLabel
                                value="memoryIntensive"
                                control={<Radio />}
                                classes={{ root: classes.radioWithDesc }}
                                label={
                                  <RadioLabel
                                    classes={classes}
                                    label="Memory intensive"
                                    description={
                                      <div>
                                        Optimized for memory intensive
                                        workloads. The ratio of vCPU and RAM is
                                        1:{
                                          this.profileMultipliers.memory
                                            .memoryIntensive
                                        }.
                                      </div>
                                    }
                                  />
                                }
                              />
                            </RadioGroup>
                          </FormControl>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <SliderField
                            label={
                              <span>
                                Number of vCPU cores:{" "}
                                <span className="text-red">
                                  {numCPU.toLocaleString()}
                                </span>
                              </span>
                            }
                            min={1}
                            max={this.getNumOfResources(selectedRegion.numCPU)}
                            value={numCPU}
                            onChange={this.handleDataChange("numCPU")}
                          />
                          <div className={classes.formControl}>
                            <h4 className="pt-3">
                              Number of RAM (GB):{" "}
                              <span className="text-amber">
                                {this.getMemGb()}
                              </span>
                            </h4>
                          </div>
                          <SliderField
                            label={
                              <span>
                                Temporary Storage - SSD (GB):{" "}
                                <span className="text-purple">
                                  {ssdGB.toLocaleString()}
                                </span>
                              </span>
                            }
                            min={1}
                            max={this.getNumOfResources(
                              selectedRegion.storageGB
                            )}
                            value={ssdGB}
                            onChange={this.handleDataChange("ssdGB")}
                          />
                        </div>
                      </div>

                      <div className="row justify-content-around">
                        <div className="col-lg-6 col-md-6">
                          <div className="jr-card tour-price-estimate">
                            <div className="jr-card-header-color bg-primary">
                              Estimated costs per hour (CRC)
                            </div>
                            <div className="jr-card-body">
                              <div className={classes.resources}>
                                <div>
                                  <h6>vCPU + RAM</h6>{" "}
                                  <span className="text-red">
                                    {this.getEstimatedCpuRamCosts().toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <h6>Storage (0.01 CRC per GB)</h6>{" "}
                                  <span className="text-amber">
                                    {this.getEstimatedStorageCosts().toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <h6>
                                    <strong>Total</strong>
                                  </h6>{" "}
                                  <span className="text-blue">
                                    {this.getTotalCosts().toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className={classes.resourcesNote}>
                                <i>
                                  <u>Note:</u> The costs don't include data
                                  transfer {this.crcPerGbTransferred} CRC per 1
                                  GB.
                                </i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <FormButtons
                        activeStep={activeStep}
                        onCancel={() =>
                          this.props.history.push("/app/workloads")
                        }
                        onNext={() => {
                          const newState = { activeStep: 4 };
                          if (!this.state.id && !this.state._id) {
                            newState.maxBidCRC = 1.3 * this.getTotalCosts();
                          }
                          this.setState(newState);
                          this.props.goToTourStep(6);
                        }}
                        onPrevious={() => this.setState({ activeStep: 2 })}
                      />
                    </section>
                  )}

                  {activeStep === 4 && (
                    <section>
                      <SectionHeader
                        activeStep={activeStep}
                        label="Pricing"
                        isNew={isNew}
                      />

                      <div className="row">
                        <div className="col-lg-6 col-md-6 tour-max-bid-price">
                          <SliderField
                            label={
                              <span>
                                Set max bid price for per hour:{" "}
                                <span className="text-blue">
                                  {round(maxBidCRC)} CRC
                                </span>
                              </span>
                            }
                            min={1}
                            max={1000}
                            value={maxBidCRC}
                            onChange={this.handleDataChange("maxBidCRC")}
                          />

                          <p className="py-3">
                            <i>
                              <u>Note:</u> The current price for vCPU per hour:{" "}
                              <span className="text-green">
                                {round(this.getTotalCosts()).toLocaleString()}{" "}
                                CRC
                              </span>
                            </i>
                          </p>
                        </div>
                      </div>

                      <FormButtons
                        activeStep={activeStep}
                        onCancel={() =>
                          this.props.history.push("/app/workloads")
                        }
                        onNext={() => {
                          this.setState({ activeStep: 5 });
                          this.props.goToTourStep(7);
                        }}
                        onPrevious={() => this.setState({ activeStep: 3 })}
                      />
                    </section>
                  )}

                  {activeStep === 5 && (
                    <section>
                      <SectionHeader
                        activeStep={activeStep}
                        label="Installation Script"
                        isNew={isNew}
                      />

                      <FormControl className={classes.formControl}>
                        <h4>Container Type</h4>
                        <RadioGroup
                          value={containerType}
                          className={"tour-installation-script"}
                          onChange={this.handleDataChange("containerType")}
                        >
                          <FormControlLabel
                            value="Docker"
                            control={<Radio />}
                            classes={{ root: classes.radioWithDesc }}
                            label={
                              <RadioLabel
                                classes={classes}
                                label="Docker"
                                description={<div>Docker</div>}
                              />
                            }
                          />
                          <FormControlLabel
                            value="Kubernetes"
                            control={<Radio />}
                            classes={{ root: classes.radioWithDesc }}
                            label={
                              <RadioLabel
                                classes={classes}
                                label="Kubernetes"
                                description={<div>Kubernetes</div>}
                              />
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                      {containerType === "Docker" ? (
                        <div>
                          <FormControl
                            fullWidth
                            className={classes.formControl}
                          >
                            <TextField
                              label="Repository URL"
                              value={containerImageUrl}
                              onChange={this.handleDataChange(
                                "containerImageUrl"
                              )}
                              fullWidth
                              required
                              error={this.hasError("containerImageUrl")}
                            />
                          </FormControl>
                          <FormControl
                            fullWidth
                            className={classes.formControl}
                          >
                            <TextField
                              label="Image Name"
                              value={containerImageName}
                              onChange={this.handleDataChange(
                                "containerImageName"
                              )}
                              fullWidth
                              required
                              error={this.hasError("containerImageName")}
                            />
                          </FormControl>
                        </div>
                      ) : (
                        <FormControl
                          fullWidth
                          className={classes.formControl}
                          error={this.hasError("kubernetesConfig")}
                        >
                          <h4>Configuration Script</h4>
                          <DkCodeMirror
                            options={codeMirrorOptions}
                            onChange={this.handleDataChange("kubernetesConfig")}
                            value={kubernetesConfig}
                          />
                          <FormHelperText>
                            {"Enter kubernetes config."}
                          </FormHelperText>
                        </FormControl>
                      )}

                      <FormButtons
                        activeStep={activeStep}
                        onCancel={() =>
                          this.props.history.push("/app/workloads")
                        }
                        onNext={() => {
                          this.setActiveStep(5, 6);
                          this.props.goToTourStep(8);
                        }}
                        onPrevious={() => this.setActiveStep(5, 4)}
                      />
                    </section>
                  )}

                  {activeStep === 6 && (
                    <section>
                      <SectionHeader
                        activeStep={activeStep}
                        label="Configuration Review"
                        isNew={isNew}
                      />
                      <FormControl className={classes.formControl}>
                        <div className="row justify-content-around">
                          <div className="col-lg-6 col-md-6">
                            <div className="jr-card">
                              <div className="jr-card-header-color bg-primary d-flex">
                                Resources
                              </div>
                              <div className="jr-card-body">
                                <div className={classes.resources}>
                                  <div>
                                    <h6>vCPU (cores)</h6>{" "}
                                    <span className="text-red">
                                      {numCPU.toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <h6>RAM (GB)</h6>{" "}
                                    <span className="text-amber">
                                      {this.getMemGb().toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <h6>Storage - SSD (GB)</h6>{" "}
                                    <span className="text-green">
                                      {ssdGB.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="jr-card">
                              <div className="jr-card-header-color bg-primary">
                                Estimated costs per hour (CRC)
                              </div>
                              <div className="jr-card-body">
                                <div className={classes.resources}>
                                  <div>
                                    <h6>vCPU + RAM</h6>{" "}
                                    <span className="text-red">
                                      {this.getEstimatedCpuRamCosts().toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <h6>Storage (0.01 CRC per GB)</h6>{" "}
                                    <span className="text-amber">
                                      {this.getEstimatedStorageCosts().toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <h6>
                                      <strong>Total</strong>
                                    </h6>{" "}
                                    <span className="text-blue">
                                      {this.getTotalCosts().toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                <div className={classes.resourcesNote}>
                                  <i>
                                    <u>Note:</u> The costs don't include data
                                    transfer {this.crcPerGbTransferred} CRC per
                                    1 GB.
                                  </i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <FormControl className={classes.formControl}>
                          <h4 className="pt-3">
                            Max bid price for per hour:{" "}
                            <span className="text-blue">
                              {round(maxBidCRC)} CRC
                            </span>
                          </h4>
                        </FormControl>
                        <div className="p-5 text-center">
                          <Button
                            color="secondary"
                            variant="raised"
                            className="jr-btn tour-workload-launch"
                            onClick={this.saveWorkload}
                          >
                            <i className="zmdi zmdi-play animated infinite fadeInLeft zmdi-hc-fw" />
                            <span>{!this.state._id ? "Launch" : "Save"}</span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormButtons
                        activeStep={activeStep}
                        onCancel={() =>
                          this.props.history.push("/app/workloads")
                        }
                        onPrevious={() => this.setActiveStep(6, 5)}
                      />
                    </section>
                  )}
                </div>
              </CardLayout>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  processWorkload,
  fetchAllRegion,
  fetchAllDatacenter,
  goToTourStep
};

const mapStateToProps = ({ datacenter, region, user, workloads }) => {
  return {
    datacenters: datacenter,
    regions: region,
    user,
    workloads
  };
};

export default compose(
  withStyles(styles, {
    name: "ConfigWizard"
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(ConfigWizard);

const RadioLabel = ({ classes, label, description }) => (
  <div className={classes.radioLabel}>
    <div>{label}</div>
    <div className={classes.radioDescription}>{description}</div>
  </div>
);

const SectionHeader = withStyles(styles)(
  ({ classes, activeStep, label, isNew }) => (
    <div className={classes.section}>
      <h3>
        <span>{isNew ? "New Workload" : "Edit Workload"} </span>
      </h3>
      <h2>{label}</h2>
      <h4>Step {activeStep + 1} of 7</h4>
    </div>
  )
);
SectionHeader.propTypes = {
  activeStep: PropTypes.number,
  label: PropTypes.string
};

const FormButtons = withStyles(styles)(
  ({ classes, activeStep, onCancel, onPrevious, onNext }) => (
    <div className={classes.btnBox}>
      <Button className={classes.btnBack} onClick={onCancel}>
        Cancel
      </Button>
      {activeStep !== 0 && (
        <Button color="default" variant="raised" onClick={onPrevious}>
          Previous
        </Button>
      )}
      {activeStep !== 6 && (
        <Button color="secondary" variant="raised" onClick={onNext}>
          Next
        </Button>
      )}
    </div>
  )
);
FormButtons.propTypes = {
  activeStep: PropTypes.number,
  onPrevious: PropTypes.func,
  onCancel: PropTypes.func,
  onNext: PropTypes.func
};

const SliderField = withStyles(styles)(
  ({ classes, label, min, max, value, onChange }) => {
    return (
      <div className={`${classes.formControl} mb-0`}>
        <h4 className="pb-0">{label}</h4>
        <div className="px-3">
          <Slider min={min} value={value} onChange={onChange} max={max} />
        </div>
      </div>
    );
  }
);
SliderField.propTypes = {
  label: PropTypes.node,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func
};
