import React from 'react';
import update from 'immutability-helper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {FormControl, FormControlLabel, FormLabel} from 'material-ui/Form';
import Select from 'material-ui/Select';
import MenuItem from 'material-ui/Menu/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import {InputLabel} from 'material-ui/Input';
import Radio, {RadioGroup} from 'material-ui/Radio';
import CheckIcon from 'material-ui-icons/Check';
import Map from 'components/map';
import {connect} from 'react-redux';
import {
  ADD_WORKLOAD,
  EDIT_WORKLOAD,
  REMOVE_WORKLOAD,
} from 'constants/ActionTypes';
import {withStyles} from 'material-ui/styles/index';
import {compose} from 'redux';
import {fetchAllRegion} from 'actions/Region';
import {fetchAllDatacenter} from 'actions/Datacenter';
import CardLayout from 'components/CardLayout';
import {Marker, InfoWindow} from 'react-google-maps';
import ContainerHeader from 'components/ContainerHeader';


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
    padding: '1.6em 2.5em 1em',
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
        width: 120
      },
      '& span': {
        width: 60,
        float: 'right',
        textAlign: 'right',
        display: 'inline-block',
        paddingRight: 5
      }
    }
  },
  buttonBox: {
    marginBottom: 10,
    textAlign: 'right',
    '& button': {
      marginLeft: 10
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
  }
});

class ConfigWizard extends React.Component {

  componentDidMount() {
    //this.props.fetchAllDatacenter();
    this.props.fetchAllRegion();
  }

  state = {
    qualityScore: 50,
    activeStep: 0,
    mapLocation: {lat: -33.8527273, lng: 151.2345705},
    mapZoom: 11,
    mapActiveDatacenterId: null,
    isNew: true,
    data: {
      name: '',
      numCPU: 1,
      gpu: 0,
      storageHdd: 1,
      storageGB: 10,
      containerType: 'Docker',
      datacenter: '',
      region: '',
      dockerConfig: {
        repositoryUrl: '',
        imageName: ''
      },
      kubernetesConfig: {
        script: ''
      },
      priceType: '',
      price: 0,
      status: 'running',
      sameNetwork: false,
      pricePerHourForCpu: 4,
      computeProfile:''
    }
  };

  handleDataChange = (name, type = 'text') => event => {
    let ctrlValue = null;
    if (type === 'bool') {
      ctrlValue = event.target.checked;
    } else if (event === null || typeof(event) === 'number' || typeof(event) === 'string') {
      ctrlValue = event;
    } else {
      ctrlValue = event.target.value;
    }
    let value = type === 'int' ? parseInt(ctrlValue) : ctrlValue;

    let newState = update(this.state, {
      data: {
        [name]: {$set: value},
      }
    });
    let promise = new Promise((resolve, reject) => {
      this.setState(newState, () => resolve());
    });
    return promise;
  };


  changeMapRegion = (regionId) => {
    const {region} = this.props;
    let selectedRegion = region.allRegions.find(i => i._id === regionId);
    let newState = update(this.state,
      {
        mapLocation: {$set: {lng: selectedRegion.location.geo[0], lat: selectedRegion.location.geo[1]}},
        //mapZoom: {$set: selectedRegion.zoom},
      });

    this.setState(newState);
  };

  getNumOfResources = (resNum) => {
    return Math.round((100 - this.state.qualityScore * 0.9) / 100 * (this.state.data.sameNetwork ? 0.5 : 1) * resNum);
  }

  getMemGb = () => {
    const {computeProfile, numCPU} = this.state.data;
    let coe = null;
    if(computeProfile === 'balanced') {
      coe = 1;
    } else if (computeProfile === 'cpuIntensive') {
      coe = 0.5;
    } else {
      coe = 2;
    }

    return (numCPU * coe).toLocaleString();

  }

  render() {
    const {classes} = this.props;
    const {datacenter, region} = this.props;
    const {data, mapActiveDatacenterId, activeStep} = this.state;
    const state = this.state;
    const selectedRegion = region.allRegions.find(el => el._id === data.region);
    const stepsTotal = 6;

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
                        onChange={this.handleDataChange('name')}
                        value={data.name}
                        className={classes.formInputText}
                        helperText='Enter unique workload identifier'
                      />
                    </FormControl>
                    <div className={classes.buttonBox}>
                      <Button>Cancel</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setState({activeStep: 1})}>Next</Button>
                    </div>
                  </section>}

                  {activeStep === 1 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Location</h2>
                      <h3>Step {activeStep + 1} of {stepsTotal}</h3>
                    </div>

                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="region">Region</InputLabel>
                      <Select
                        value={data.region}
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
                        {region.allRegions.map(i => (
                          <MenuItem key={i._id} value={i._id}>{i.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/*<FormControl className={classes.formControl}>*/}
                    {/*<InputLabel htmlFor="datacenter">Datacenter</InputLabel>*/}
                    {/*<Select*/}
                    {/*value={data.datacenter}*/}
                    {/*onChange={e => {*/}
                    {/*this.handleDataChange('datacenter')(e)*/}
                    {/*.then(() => {*/}
                    {/*this.setState({mapActiveDatacenterId: e.target.value});*/}
                    {/*});*/}
                    {/*}}*/}
                    {/*required*/}
                    {/*inputProps={{*/}
                    {/*id: 'datacenter'*/}
                    {/*}}*/}
                    {/*className={classes.formInput}*/}
                    {/*>*/}
                    {/*{datacenter.allDatacenters.filter(i => (i.region === data.region) || !data.region).map(i => (*/}
                    {/*<MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>*/}
                    {/*))}*/}
                    {/*</Select>*/}
                    {/*</FormControl>*/}
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
                      <Button>Cancel</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setState({activeStep: 0})}>Previous</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setState({activeStep: 2})}>Next</Button>
                    </div>
                  </section>}

                  {activeStep === 2 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Quality</h2>
                      <h3>Step {activeStep + 1} of {stepsTotal}</h3>
                    </div>

                    <div className={`${classes.formControl} mb-0`}>
                      <h4>Set minimal Quality Score: <span className='text-blue'>{state.qualityScore}</span></h4>
                      <div className='px-5 pb-4 pt-3'>
                        <Slider min={0} value={state.qualityScore} onChange={(v) => this.setState({qualityScore: v})}
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
                            checked={data.sameNetwork}
                            onChange={this.handleDataChange('sameNetwork', 'bool')}
                          />
                        }
                        label="Deploy to the same datacenter (fast network)"
                      />
                    </div>
                    <div className={classes.buttonBox}>
                      <Button>Cancel</Button>
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
                    <FormControl className={classes.formControl}>
                      <h4>Compute Profile</h4>
                      <RadioGroup
                        value={data.computeProfile}
                        onChange={this.handleDataChange('computeProfile')}
                      >
                        <FormControlLabel value="balanced" control={<Radio/>}
                                          classes={{root: classes.radioWithDesc}}
                                          label={<RadioLabel classes={classes} label="Balanced"
                                                             description={
                                                               <div>
                                                                 Description
                                                               </div>}/>}/>
                        <FormControlLabel value="cpuIntensive" control={<Radio/>}
                                          classes={{root: classes.radioWithDesc}}
                                          label={<RadioLabel classes={classes} label="CPU intensive"
                                                             description={
                                                               <div>
                                                                 Description
                                                               </div>}/>}/>
                        <FormControlLabel value="memoryIntensive" control={<Radio/>}
                                          classes={{root: classes.radioWithDesc}}
                                          label={<RadioLabel classes={classes} label="Memory intensive"
                                                             description={<div>
                                                               Description
                                                             </div>}/>}/>
                      </RadioGroup>
                    </FormControl>
                    <div className={classes.formControl}>

                      <h4 className='pt-3'>Number of vCPU cores: <span className='text-red'>{data.numCPU.toLocaleString()}</span></h4>
                      <div className='px-5 pt-3'>
                        <Slider
                          min={1}
                          max={this.getNumOfResources(selectedRegion.numCPU)}
                          value={data.numCPU}
                          onChange={this.handleDataChange('numCPU')}
                        />
                      </div>
                    </div>
                    <div className={classes.formControl}>
                      <h4 className='pt-3'>Number of RAM (GB): <span className='text-amber'>{this.getMemGb()}</span></h4>
                    </div>

                    {/*<div className={classes.formControl}>*/}
                      {/*<h4 className='pt-3'>Number of RAM (GB): <span className='text-amber'>{data.ram.toLocaleString()}</span></h4>*/}
                      {/*<div className='px-5 pb-4 pt-3'>*/}
                        {/*<Slider*/}
                          {/*min={1}*/}
                          {/*max={50}*/}
                          {/*value={data.ram}*/}
                          {/*onChange={this.handleDataChange('ram')}*/}
                        {/*/>*/}
                      {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className={classes.formControl}>*/}
                      {/*<h4 className='pt-3'>Number of GPU cores: <span className='text-blue'>{data.gpu.toLocaleString()}</span></h4>*/}
                      {/*<div className='px-5 pb-4 pt-3'>*/}
                        {/*<Slider*/}
                          {/*min={0}*/}
                          {/*max={Math.round((100 - state.qualityScore * 0.9) / 100 * gpu * coe)}*/}
                          {/*value={data.gpu}*/}
                          {/*onChange={this.handleDataChange('gpu')}*/}
                        {/*/>*/}
                      {/*</div>*/}
                    {/*</div>*/}
                    <div className={classes.formControl}>
                      <h4 className='pt-3'>Temporary Storage - SSD (GB): <span className='text-purple'>{data.storageGB.toLocaleString()}</span></h4>
                      <div className='px-5 pb-4 pt-3'>
                        <Slider
                          min={1}
                          max={this.getNumOfResources(selectedRegion.storageGB)}
                          value={data.storageGB}
                          onChange={this.handleDataChange('storageGB')}
                        />
                      </div>
                    </div>


                    <div className={classes.buttonBox}>
                      <Button>Cancel</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setState({activeStep: 2})}>Previous</Button>
                      <Button color="secondary" variant='raised' onClick={() => this.setState({activeStep: 4})}>Next</Button>
                    </div>
                  </section>}

                  {activeStep === 4 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Pricing</h2>
                      <h3>Step {activeStep + 1} of {stepsTotal}</h3>
                    </div>
                    <FormControl className={classes.formControl}>
                      <h4 className='pt-3'>Set max price for vCPU per hour: {data.pricePerHourForCpu} CRC</h4>
                      <div className='px-5 pb-4 pt-3'>
                        <Slider
                          min={1}
                          max={100}
                          value={data.pricePerHourForCpu}
                          onChange={this.handleDataChange('pricePerHourForCpu')}
                        />
                      </div>
                      <p className='py-3'>Current price for vCPU per hour: <span className='text-green'>3.85 CRC</span></p>
                      <p>Estimated price....</p>
                    </FormControl>

                    <div className={classes.buttonBox}>
                      <Button color="primary" variant='raised' onClick={() => this.setState({activeStep: 5})}>Next</Button>
                      <Button color="primary" variant='raised' onClick={() => this.setState({activeStep: 3})}>Previous</Button>
                      <Button variant='raised'>Cancel</Button>
                    </div>
                  </section>}

                  {activeStep === 5 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Container Configuration</h2>
                      <h3>Step {activeStep + 1} of {stepsTotal}</h3>
                    </div>

                    <div className={classes.buttonBox}>
                      <Button color="primary" variant='raised' onClick={() => this.setState({activeStep: 6})}>Next</Button>
                      <Button color="primary" variant='raised' onClick={() => this.setState({activeStep: 4})}>Previous</Button>
                      <Button variant='raised'>Cancel</Button>
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
  addItem: (item) => ({type: ADD_WORKLOAD, item: item}),
  fetchAllRegion,
  fetchAllDatacenter
};

const mapStateToProps = ({datacenter, region}) => {
  return {
    datacenter,
    region,
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