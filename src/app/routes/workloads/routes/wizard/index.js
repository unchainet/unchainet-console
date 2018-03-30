import React from 'react';
import update from 'immutability-helper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {FormControl, FormControlLabel, FormLabel, FormHelperText} from 'material-ui/Form';
import Select from 'material-ui/Select';
import MenuItem from 'material-ui/Menu/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import {InputLabel} from 'material-ui/Input';
import Radio, {RadioGroup} from 'material-ui/Radio';
import Map from 'components/map';
import {connect} from 'react-redux';
import {
  EDIT_WORKLOAD,
  REMOVE_WORKLOAD,
} from 'constants/ActionTypes';
import {withStyles} from 'material-ui/styles/index';
import {compose} from 'redux';
import {fetchAllRegion} from 'actions/Region';
import {fetchAllDatacenter} from 'actions/Datacenter';
import {processWorkload} from 'actions/Workload';
import CardLayout from 'components/CardLayout';
import ContainerHeader from 'components/ContainerHeader';
import DkCodeMirror from 'components/DkCodeMirror';
import 'codemirror/mode/yaml/yaml';
import {round} from 'util/Format';
import {genWorkloadName, randomIp} from 'util/Generator'
import _ from 'lodash';
import qs from 'query-string';

const styles = theme => ({
  root: {
    width: '100%',
    margin: '1em',
  },
  formControl: {
    margin: {
      bottom: theme.spacing.unit * 2.5,
      top: theme.spacing.unit * 2
    },
    display: 'block'
  },
  formInput: {
    minWidth: '230px'
  },
  formInputText: {
    minWidth: '230px'
  },
  form: {
    padding: '20px 20px 10px 20px'
  },
  infoBox: {
    backgroundColor: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '2px',
    width: 'auto',
    minWidth: '150px',
    padding: '25px 0 0 15px'
  },
  section: {
    marginLeft: '-44px',
    marginRight: '-44px',
    padding: '1.6em 2.5em .7em',
    marginBottom: '27px',
    backgroundColor: '#555',
    color: '#fff',
    marginTop: -38,
    '& h2': {
      fontSize: '1.5em'
    },
    '& h3': {
      fontSize: '0.8em',
      fontWeight: '200'
    }
  },
  resources: {
    '& div': {
      lineHeight: '3.5em',
      borderTop: '1px solid #ccc',
      '&:first-child': {
        borderTop: 'none'
      },
      '& h6': {
        display: 'inline-block',
      },
      '& span': {
        float: 'right',
        textAlign: 'right',
        display: 'inline-block',
        paddingRight: 5
      }
    }
  },
  buttonBox: {
    textAlign: 'right',
    '& button': {
      marginLeft: 10,
      marginBottom: 10
    }
  },
  radioDescription: {
    fontSize: '12px',
    fontStyle: 'Italic'
  },
  radioLabel: {
    paddingLeft: '10px'
  },
  radioWithDesc: {
    padding: '0 0 10px 0'
  },
  resourcesNote: {
    fontSize: '12px',
    paddingTop: '5px'
  }
});

class ConfigWizard extends React.Component {

  constructor(props){
    super(props);
    console.log('this.props', this.props)
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
      containerImageUrl: this.getFieldInfo(true, 5, {name: 'containerType', value: 'Docker'}),
      containerImageName: this.getFieldInfo(true, 5, {name: 'containerType', value: 'Docker'}),
      kubernetesConfig: this.getFieldInfo(true, 5, {name: 'containerType', value: 'Kubernetes'}),
    };
    this.state = {
      activeStep: 0,
      activeStepError: null,
      mapLocation: {lat: -33.8527273, lng: 151.2345705},
      mapZoom: 11,
      minQualityScore: 50,
      name: genWorkloadName(this.props.user),
      numCPU: 1,
      numGPU: 0,
      ssdGB: 10,
      containerType: 'Docker',
      datacenter: '',
      region: '',
      containerImageUrl:'',
      containerImageName: '',
      kubernetesConfig: '',
      status: 'requested',
      sameNetwork: false,
      maxBidCRC: 4,
      computeProfile: 'balanced',
      publicIP: randomIp(),
    };
  }

  saveWorkload() {
    this.props.processWorkload(_.omit(this.state, ['activeStep', 'activeStepError', 'mapLocation']));
    this.props.history.push('/app/workloads/list');
  }

  componentDidMount() {
    this.props.fetchAllRegion();

    const params = qs.parse(this.props.location.search);
    const paramId = params.id;
    if (paramId) {
      const {list} = this.props.workloads;
      let found = list &&  _.find(list, {_id: paramId});
      if(found){
        this.setState({
          ...this.state,
          ...found,
          region: found.region.hasOwnProperty('_id') ? found.region._id : found.region,//todo change after model clarification
        });
      };
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

  crcPerTbTransferred = 0.001;

  hasError(name){
    const field = this.fields[name];
    const {activeStep, activeStepError} = this.state;
    const value = this.getFieldStateValue(name);

    return (field.dirty || (activeStep === activeStepError && activeStep === field.step)) && !value;
  }

  getFieldInfo(required, step, depend = {}) {
    return {
      required: required,
      depend: depend,
      dirty: false,
      error: false,
      step: step,
    }
  }

  getFieldStateValue(name) {
    let val = this.state[name];
    val = typeof(val) === 'string' ? val.trim() : val;
    return val;
  }

  setActiveStep(from, to) {

    if(from < to){
      const requiredEmptyFields = _.pickBy(this.fields,
        (field, fieldName) => {
            let isRequiredEmptyField = field.step === from && field.required === true && !this.getFieldStateValue(fieldName);
            isRequiredEmptyField = field.depend.name ? isRequiredEmptyField && this.getFieldStateValue(field.depend.name) === field.depend.value : isRequiredEmptyField;
            return isRequiredEmptyField;
        });

      if (_.size(requiredEmptyFields) === 0) {
        this.setState({
          activeStep: to,
          activeStepError: null
        });
      }
      else{
        this.setState({
          activeStepError: from
        })
      }
    }else{
      this.setState({
        activeStep: to,
        activeStepError: null
      });
    }
    setTimeout(() => console.log(this.state), 300);
  };

  handleDataChange = (name, type = 'text') => event => {
    if(name=='region') debugger;
    let ctrlValue = null;
    if (type === 'bool') {
      ctrlValue = event.target.checked;
    } else if (event === null || typeof(event) === 'number' || typeof(event) === 'string') {
      ctrlValue = event;
    } else {
      ctrlValue = event.target.value;
    }
    let value = type === 'int' ? parseInt(ctrlValue) : ctrlValue;
    this.fields[name].dirty = true;
    let newState = update(this.state, {[name]: {$set: value}});
    let promise = new Promise((resolve, reject) => {
      this.setState(newState, () => resolve());
    });
    return promise;
  };



  changeMapRegion = (region) => {

    const {regions} = this.props;
    let selectedRegion = regions.allRegions.find(i => i._id === region);
    let newState = update(this.state,
      {
        mapLocation: {$set: {lng: selectedRegion.location.geo[0], lat: selectedRegion.location.geo[1]}},
        //mapZoom: {$set: selectedRegion.zoom},
      });
    this.setState(newState);
  };

  getNumOfResources = (resNum) => {
    return round((100 - this.state.minQualityScore * 0.9) / 100 * (this.state.sameNetwork ? 0.5 : 1) * resNum);
  }

  getMemGb = () => {
    const {computeProfile, numCPU} = this.state;
    const {balanced,cpuIntensive,memoryIntensive} = this.profileMultipliers.memory;
    let coe = null;
    if (computeProfile === 'balanced') {
      coe = balanced;
    } else if (computeProfile === 'cpuIntensive') {
      coe = cpuIntensive;
    } else {
      coe = memoryIntensive;
    }

    return (numCPU * coe).toLocaleString();
  };

  getEstimatedCpuRamCosts = () => {
    const {computeProfile, numCPU} = this.state;
    const {balanced,cpuIntensive,memoryIntensive} = this.profileMultipliers.cpuCosts;
    let cpuCoe = null;

    if (computeProfile === 'balanced') {
      cpuCoe = balanced;
    } else if (computeProfile === 'cpuIntensive') {
      cpuCoe = cpuIntensive;
    } else {
      cpuCoe = memoryIntensive;
    }
    return (numCPU * cpuCoe);
  };

  getEstimatedStorageCosts = () => {
    return (this.state.ssdGB * 0.01);
  };

  getTotalCosts = () => {
    return this.getEstimatedStorageCosts() + this.getEstimatedCpuRamCosts();
  };

  render() {
    const {classes} = this.props;
    const { regions} = this.props;
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
    } = this.state;
    const state = this.state;
    const selectedRegion = regions.allRegions.find(el => el._id === region);
    const stepsTotal = 7;

    const codeMirrorOptions = {
      lineNumbers: true,
      mode: 'text/x-yaml',
      lineWrapping: true
    };


    return (
      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-3">
          <ContainerHeader match={this.props.match} title='New Workload Configuration'/>

          <div className="row justify-content-around">
            <div className="col-lg-8 col-md-10">
              <CardLayout>
                <div className={classes.form}>
                  {activeStep === 0 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Workload</h2>
                      <h3>Step {activeStep + 1} of {stepsTotal}</h3>
                    </div>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label='Workload Name'
                        required
                        inputProps={{
                          name: 'name'
                        }}
                        onChange={this.handleDataChange('name')}
                        value={name}
                        className={classes.formInputText}
                        error={this.hasError('name')}
                        helperText={'Enter unique workload identifier'}
                      />
                    </FormControl>
                    <div className={classes.buttonBox}>
                      <Button onClick={()=>{this.props.history.push('/app/workloads/list')}}>Cancel</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setActiveStep(0,1)}>Next</Button>
                    </div>
                  </section>}

                  {activeStep === 1 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Location</h2>
                      <h3>Step {activeStep + 1} of {stepsTotal}</h3>
                    </div>

                    <FormControl className={classes.formControl} error={this.hasError('region')}>
                      <InputLabel htmlFor="region">Region</InputLabel>
                      <Select
                        value={region}
                        onChange={(e) => {
                          this.handleDataChange('region')(e)
                            .then(() => {
                              this.changeMapRegion(e.target.value);
                            });
                        }}
                        inputProps={{
                          id: 'region'
                        }}
                        required
                        className={classes.formInput}
                      >
                        {regions.allRegions.map(i => (
                          <MenuItem key={i._id} value={i._id}>{i.name}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {'Enter region'}</FormHelperText>
                    </FormControl>
                    {selectedRegion &&
                    <div className='row justify-content-around'>
                      <div className='col-lg-6 col-md-6'>
                        <div className='jr-card'>
                          <div className='jr-card-header-color bg-primary d-flex'>
                            Available resources
                          </div>
                          <div className='jr-card-body'>
                            <div className={classes.resources}>
                              <div><h6>vCPU (cores)</h6> <span className='text-red'>{selectedRegion.numCPU.toLocaleString()}</span></div>
                              <div><h6>RAM (GB)</h6> <span className='text-amber'>{selectedRegion.memGB.toLocaleString()}</span></div>
                              <div><h6>GPU (cores)</h6> <span className='text-blue'>{selectedRegion.numGPU.toLocaleString()}</span></div>
                              <div><h6>Storage - SSD (GB)</h6> <span className='text-green'>{selectedRegion.storageGB.toLocaleString()}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-lg-6 col-md-6 pb-3'>
                        <Map
                          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA0wwNWl1SoRNcHLmE94ST06IOSAn4WLho&v=3.exp&libraries=geometry,drawing,places"
                          loadingElement={<div/>}
                          containerElement={<div style={{height: `300px`}}/>}
                          mapElement={<div style={{height: `100%`}}/>}
                          center={state.mapLocation}
                          zoom={state.mapZoom}
                        >
                        </Map>
                      </div>
                    </div>}

                    <div className={classes.buttonBox}>
                      <Button onClick={()=>{this.props.history.push('/app/workloads/list')}}>Cancel</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setActiveStep(1,0)}>Previous</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setActiveStep(1,2)}>Next</Button>
                    </div>
                  </section>}

                  {activeStep === 2 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Quality</h2>
                      <h3>Step {activeStep + 1} of {stepsTotal}</h3>
                    </div>

                    <div className={`${classes.formControl} mb-0`}>
                      <h4>Set minimal Quality Score: <span className='text-blue'>{state.minQualityScore}</span></h4>
                      <div className='px-5 pb-4 pt-3'>
                        <Slider min={0} value={state.minQualityScore} onChange={(v) => this.setState({minQualityScore: v})}
                                max={100}/>
                      </div>
                      <div className='row justify-content-around'>
                        <div className='col-lg-8 col-md-7 col-sm-6'>
                          <div className='jr-card'>
                            <div className='jr-card-header-color bg-primary d-flex'>
                              Available resources
                            </div>
                            <div className='jr-card-body'>
                              <div className={classes.resources}>
                                <div><h6>vCPU (cores)</h6> <span className='text-red'>{this.getNumOfResources(selectedRegion.numCPU).toLocaleString()}</span></div>
                                <div><h6>RAM (GB)</h6> <span className='text-amber'>{this.getNumOfResources(selectedRegion.memGB).toLocaleString()}</span></div>
                                <div><h6>GPU (cores)</h6> <span className='text-blue'>{this.getNumOfResources(selectedRegion.numGPU).toLocaleString()}</span></div>
                                <div><h6>Storage - SSD (GB)</h6> <span className='text-green'>{this.getNumOfResources(selectedRegion.storageGB).toLocaleString()}</span></div>
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
                            checked={sameNetwork}
                            onChange={this.handleDataChange('sameNetwork', 'bool')}
                          />
                        }
                        label="Deploy to the same datacenter (fast network)"
                      />
                    </div>
                    <div className={classes.buttonBox}>
                      <Button onClick={()=>{this.props.history.push('/app/workloads/list')}}>Cancel</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setState({activeStep: 1})}>Previous</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setState({activeStep: 3})}>Next</Button>
                    </div>
                  </section>}

                  {activeStep === 3 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Resources configuration</h2>
                      <h3>Step {activeStep + 1} of {stepsTotal}</h3>
                    </div>
                    <div className='row justify-content-start'>
                      <div className='col-lg-6 col-md-6'>
                        <FormControl className={classes.formControl}>
                          <h4>Compute Profile</h4>
                          <RadioGroup
                            value={computeProfile}
                            onChange={this.handleDataChange('computeProfile')}
                          >
                            <FormControlLabel value="balanced" control={<Radio/>}
                                              classes={{root: classes.radioWithDesc}}
                                              label={<RadioLabel classes={classes} label="Balanced"
                                                                 description={
                                                                   <div>
                                                                     Optimized for the most common workloads.
                                                                     The ratio of vCPU and RAM is 1:1.
                                                                   </div>}/>}/>
                            <FormControlLabel value="cpuIntensive" control={<Radio/>}
                                              classes={{root: classes.radioWithDesc}}
                                              label={<RadioLabel classes={classes} label="CPU intensive"
                                                                 description={
                                                                   <div>
                                                                     Optimized for CPU intensive workloads.
                                                                     The ratio of vCPU and RAM is 1:{this.profileMultipliers.memory.cpuIntensive}.
                                                                   </div>}/>}/>
                            <FormControlLabel value="memoryIntensive" control={<Radio/>}
                                              classes={{root: classes.radioWithDesc}}
                                              label={<RadioLabel classes={classes} label="Memory intensive"
                                                                 description={<div>
                                                                   Optimized for memory intensive workloads.
                                                                   The ratio of vCPU and RAM is 1:{this.profileMultipliers.memory.memoryIntensive}.
                                                                 </div>}/>}/>
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <div className='col-lg-6 col-md-6'>
                        <div className='jr-card'>
                          <div className='jr-card-header-color bg-primary'>
                            Estimated costs per hour (CRC)
                          </div>
                          <div className='jr-card-body'>
                            <div className={classes.resources}>
                              <div><h6>vCPU + RAM</h6> <span className='text-red'>{this.getEstimatedCpuRamCosts().toLocaleString()}</span></div>
                              <div><h6>Storage (0.01 CRC per GB)</h6> <span className='text-amber'>{this.getEstimatedStorageCosts().toLocaleString()}</span></div>
                              <div><h6><strong>Total</strong></h6> <span className='text-blue'>{this.getTotalCosts().toLocaleString()}</span></div>
                            </div>
                            <div className={classes.resourcesNote}>
                              <i><u>Note:</u> The costs don't include data transfer {this.crcPerTbTransferred} CRC per 1 TB.</i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={classes.formControl}>
                      <h4 className='pt-3'>Number of vCPU cores: <span className='text-red'>{numCPU.toLocaleString()}</span></h4>
                      <div className='px-5 pt-3'>
                        <Slider
                          min={1}
                          max={this.getNumOfResources(selectedRegion.numCPU)}
                          value={numCPU}
                          onChange={this.handleDataChange('numCPU')}
                        />
                      </div>
                    </div>
                    <div className={classes.formControl}>
                      <h4 className='pt-3'>Number of RAM (GB): <span className='text-amber'>{this.getMemGb()}</span></h4>
                    </div>
                    <div className={classes.formControl}>
                      <h4 className='pt-3'>Temporary Storage - SSD (GB): <span className='text-purple'>{ssdGB.toLocaleString()}</span></h4>
                      <div className='px-5 pb-4 pt-3'>
                        <Slider
                          min={1}
                          max={this.getNumOfResources(selectedRegion.storageGB)}
                          value={ssdGB}
                          onChange={this.handleDataChange('ssdGB')}
                        />
                      </div>
                    </div>


                    <div className={classes.buttonBox}>
                      <Button>Cancel</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setState({activeStep: 2})}>Previous</Button>
                      <Button color="secondary" variant='raised' onClick={() => {
                        const object = {activeStep:4}
                        if(!this.state.id && !this.state._id){
                          object.maxBidCRC = 1.3 * this.getTotalCosts();
                        }
                        this.setState(object);
                      }}>Next</Button>
                    </div>
                  </section>}

                  {activeStep === 4 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Pricing</h2>
                      <h3>Step {activeStep + 1} of {stepsTotal}</h3>
                    </div>
                    <FormControl className={classes.formControl}>
                      <h4 className='pt-3'>Set max bid price for per hour: <span className='text-blue'>{round(maxBidCRC)} CRC</span></h4>
                      <div className='px-5 pb-4 pt-3'>
                        <Slider
                          min={1}
                          max={1000}
                          value={maxBidCRC}
                          onChange={this.handleDataChange('maxBidCRC')}
                        />
                      </div>
                      <p className='py-3'><i><u>Note:</u> The current price for vCPU per hour: <span className='text-green'>{round(this.getTotalCosts()).toLocaleString()} CRC</span></i></p>
                    </FormControl>

                    <div className={classes.buttonBox}>
                      <Button>Cancel</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setState({activeStep: 3})}>Previous</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setState({activeStep: 5})}>Next</Button>
                    </div>
                  </section>}

                  {activeStep === 5 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Installation Script</h2>
                      <h3>Step {activeStep + 1} of {stepsTotal}</h3>
                    </div>
                    <FormControl className={classes.formControl}>
                      <h4>Container Type</h4>
                      <RadioGroup
                        value={containerType}
                        onChange={this.handleDataChange('containerType')}
                      >
                        <FormControlLabel value="Docker" control={<Radio/>}
                                          classes={{root: classes.radioWithDesc}}
                                          label={<RadioLabel classes={classes} label="Docker"
                                                             description={
                                                               <div>
                                                                 Docker
                                                               </div>}/>}/>
                        <FormControlLabel value="Kubernetes" control={<Radio/>}
                                          classes={{root: classes.radioWithDesc}}
                                          label={<RadioLabel classes={classes} label="Kubernetes"
                                                             description={
                                                               <div>
                                                                 Kubernetes
                                                               </div>}/>}/>
                      </RadioGroup>
                    </FormControl>
                    {containerType === 'Docker' ?
                      <div>
                        <FormControl fullWidth className={classes.formControl}>
                          <TextField
                            label="Repository URL"
                            value={containerImageUrl}
                            onChange={this.handleDataChange('containerImageUrl')}
                            fullWidth
                            required
                            error={this.hasError('containerImageUrl')}
                          />
                        </FormControl>
                        <FormControl fullWidth className={classes.formControl}>
                          <TextField
                            label="Image Name"
                            value={containerImageName}
                            onChange={this.handleDataChange('containerImageName')}
                            fullWidth
                            required
                            error={this.hasError('containerImageName')}
                          />
                        </FormControl>
                      </div>
                      :
                      <FormControl fullWidth className={classes.formControl} error={this.hasError('kubernetesConfig')}>
                        <h4>Configuration Script</h4>
                        <DkCodeMirror options={codeMirrorOptions} onChange={this.handleDataChange('kubernetesConfig')} value={kubernetesConfig}/>
                        <FormHelperText>
                          {'Enter kubernetes config.'}</FormHelperText>
                      </FormControl>}

                    <div className={classes.buttonBox}>
                      <Button onClick={()=>{this.props.history.push('/app/workloads/list')}}>Cancel</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setActiveStep(5,4)}>Previous</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setActiveStep(5,6)}>Next</Button>
                    </div>
                  </section>}

                  {activeStep === 6 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Configuration Review</h2>
                      <h3>Step {activeStep + 1} of {stepsTotal}</h3>
                    </div>
                    <FormControl className={classes.formControl}>
                      <div className='row justify-content-around'>
                        <div className='col-lg-6 col-md-6'>
                          <div className='jr-card'>
                            <div className='jr-card-header-color bg-primary d-flex'>
                              Resources
                            </div>
                            <div className='jr-card-body'>
                              <div className={classes.resources}>
                                <div><h6>vCPU (cores)</h6> <span className='text-red'>{numCPU.toLocaleString()}</span></div>
                                <div><h6>RAM (GB)</h6> <span className='text-amber'>{this.getMemGb().toLocaleString()}</span></div>
                                <div><h6>Storage - SSD (GB)</h6> <span className='text-green'>{ssdGB.toLocaleString()}</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-lg-6 col-md-6'>
                          <div className='jr-card'>
                            <div className='jr-card-header-color bg-primary'>
                              Estimated costs per hour (CRC)
                            </div>
                            <div className='jr-card-body'>
                              <div className={classes.resources}>
                                <div><h6>vCPU + RAM</h6> <span className='text-red'>{this.getEstimatedCpuRamCosts().toLocaleString()}</span></div>
                                <div><h6>Storage (0.01 CRC per GB)</h6> <span className='text-amber'>{this.getEstimatedStorageCosts().toLocaleString()}</span></div>
                                <div><h6><strong>Total</strong></h6> <span className='text-blue'>{this.getTotalCosts().toLocaleString()}</span></div>
                              </div>
                              <div className={classes.resourcesNote}>
                                <i><u>Note:</u> The costs don't include data transfer {this.crcPerTbTransferred} CRC per 1 TB.</i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <FormControl className={classes.formControl}>
                        <h4 className='pt-3'>Max bid price for per hour: <span className='text-blue'>{round(maxBidCRC)} CRC</span></h4>
                      </FormControl>
                      <div className='p-5 text-center'>
                          <Button color="secondary" variant="raised" className="jr-btn" onClick={this.saveWorkload}>
                            <i className="zmdi zmdi-play animated infinite fadeInLeft zmdi-hc-fw"/>
                            <span>{!this.state._id ? 'Launch' : 'Save'}</span>
                          </Button>
                      </div>

                    </FormControl>
                    <div className={classes.buttonBox}>
                      <Button variant='raised' onClick={()=>{this.props.history.push('/app/workloads/list')}}>Cancel</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setActiveStep(6,5)}>Previous</Button>
                    </div>
                  </section>}
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
  fetchAllDatacenter
};

const mapStateToProps = ({datacenter, region, user, workloads}) => {
  return {
    datacenters: datacenter,
    regions: region,
    user,
    workloads,
  }
};


export default compose(
  withStyles(styles, {
    name: 'ConfigWizard',
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(ConfigWizard);


const RadioLabel = ({classes, label, description}) => (
  <div className={classes.radioLabel}>
    <div>{label}</div>
    <div className={classes.radioDescription}>{description}</div>
  </div>
);