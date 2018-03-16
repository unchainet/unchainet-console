import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import update from 'immutability-helper';
import {
  FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, Paper, RadioGroup, Select, Step,
  StepContent, StepLabel,
  Stepper,
  TextField,
  Typography,
  Grid, Button, Radio
} from 'material-ui';
import queryString from 'query-string';
import { connect } from 'react-redux';
import {
  ADD_WORKLOAD,
  EDIT_WORKLOAD,
  REMOVE_WORKLOAD
} from '../../../../../constants/ActionTypes';


class ConfigWizard extends React.Component {

  componentDidMount() {
    let params = queryString.parse(this.props.location.search);
    if (params.id) {
      let item = this.props.workloads.list.filter(row => row.id == params.id)[0];
      if (item) {
        this.setState(update(this.state, {data: {$set: item}}));
      }
    }
    this.setState({isNew: !params.id});
  }

  state = {
    activeStep: 0,
    region: '',
    mapLocation: {lat: -33.8527273, lng: 151.2345705},
    mapZoom: 11,
    infoBoxSelectedProviderId: null,
    isNew: true,
    data: {
      name: '',
      cpuCores: 1,
      ram: 4,
      gpuCores: 0,
      storage: 10,
      containerType: 'Docker',
      provider: '',
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
      status: 'running'
    }
  };

  toggleInfoBox = (id = null) => {
    this.setState({infoBoxSelectedProviderId: id});
  };

  onPrevious = () => {
    this.setState({activeStep: --this.state.activeStep});
  };

  onNext = (isLast) => {
    if (isLast) {
      this.props.addItem(this.state.data);
      this.props.history.push('/app/workloads/list');
    } else {
      this.setState({activeStep: ++this.state.activeStep});
    }
  };

  onCancel = () => {
    this.props.history.push('/app/workloads/list');
  };

  handleChange = (name, formData = true, type = 'text') => event => {
    let newState = null;
    let value = type === 'int' ? parseInt(event.target.value) : event.target.value;

    if (formData === true) {
      newState = update(this.state, {
        data: {
          [name]: {$set: value},
        }
      });
    } else {
      newState = update(this.state, {
        [name]: {$set: value},
      });
    }
    if (name === 'provider') {
      newState.infoBoxSelectedProviderId = event.target.value;
    }
    this.setState(newState);
  };

  changeMapRegion = (regionId) => {
    // const {regions} = this.state;
    // let region = regions.find(i => i.id == regionId);
    // this.setState({mapLocation: region.location, mapZoom: region.zoom});
  };

  selectProvider = (id) => {
    this.setState(update(this.state, {
      data: {
        provider: {$set: id}
      }
    }));
  };

  render() {
    const {activeStep, data} = this.state;
    const {providers, regions} = this.props.workloads;
    let classes = {};

    return (
      <div className="app-wrapper workloads">
        <div className="animated slideInUpTiny animation-duration-3">
        <Grid container>
          <Grid item xs={12} md={8}>
            <Paper elevation={4} className={classes.paper}>
              <Typography type="headline">Configuration</Typography>
              <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepper}>
                <Step>
                  <StepLabel>Name</StepLabel>
                  <StepContent>
                    <div className={classes.contentWrapper}>
                      <TextField label='Configuration Name' fullWidth required value={data.name}
                                 onChange={this.handleChange('name')}/>
                      <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                               onCancel={this.onCancel}
                               currentStep={activeStep}
                      />
                    </div>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Provider</StepLabel>
                  <StepContent>
                    <div className={classes.contentWrapper}>
                      <FormControl fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="location">Region</InputLabel>
                        <Select
                          value={data.region}
                          onChange={(e) => {
                            this.handleChange('region')(e);
                            this.changeMapRegion(e.target.value);
                          }}
                          required
                        >
                          {regions.map(i => (
                            <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="location">Provider</InputLabel>
                        <Select
                          value={data.provider}
                          onChange={this.handleChange('provider')}
                          required
                          fullWidth
                        >
                          {providers.map(i => (
                            <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/*<Map
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA0wwNWl1SoRNcHLmE94ST06IOSAn4WLho&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div/>}
                        containerElement={<div style={{height: `400px`}}/>}
                        mapElement={<div style={{height: `100%`}}/>}
                        center={this.state.mapLocation}
                        zoom={this.state.mapZoom}
                      >
                        {providers.map(i => (
                          <Marker
                            key={i.id}
                            position={i.location}
                            onClick={() => this.toggleInfoBox(i.id)}

                          >
                            {this.state.infoBoxSelectedProviderId === i.id &&
                            <InfoWindow
                              onCloseClick={() => this.toggleInfoBox(null)}

                            >
                              <div className={classes.infoBox}>
                                <div>{i.name}</div>
                                <div><Button onClick={() => this.selectProvider(i.id)}>Select</Button></div>
                              </div>
                            </InfoWindow>}
                          </Marker>
                        ))}
                      </Map>*/}
                      <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                               onCancel={this.onCancel}/>
                    </div>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Hardware Configuration</StepLabel>
                  <StepContent>
                    <div className={classes.contentWrapper}>
                      <FormControl className={classes.formControlBlock}>
                        <TextField
                          label="CPU Cores"
                          value={data.cpuCores}
                          onChange={this.handleChange('cpuCores', true, 'int')}
                          type="number"
                        />
                      </FormControl>
                      <FormControl className={classes.formControlBlock}>
                        <TextField
                          label="RAM (GB)"
                          value={data.ram}
                          onChange={this.handleChange('ram', true, 'int')}
                          type="number"
                        />
                      </FormControl>
                      <FormControl className={classes.formControlBlock}>
                        <TextField
                          label="Storage (GB)"
                          value={data.storage}
                          onChange={this.handleChange('storage', true, 'int')}
                          type="number"
                        />
                      </FormControl>
                      <FormControl className={classes.formControlBlock}>
                        <TextField
                          label="GPU Cores"
                          value={data.gpuCores}
                          onChange={this.handleChange('gpuCores', true, 'int')}
                          type="number"
                        />
                      </FormControl>
                      <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                               onCancel={this.onCancel}/>
                    </div>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Price</StepLabel>
                  <StepContent>
                    <div className={classes.contentWrapper}>
                      <FormControl>
                        <FormLabel style={{marginBottom: '20px'}}>Pricing</FormLabel>
                        <RadioGroup
                          value={data.priceType}
                          onChange={this.handleChange('priceType')}
                        >
                          <FormControlLabel value="eventualAvailability" control={<Radio/>}
                                            classes={{root: classes.radioWithDesc}}
                                            label={<RadioLabel classes={classes} label="Eventual availability"
                                                               description={<div>
                                                                 Set the maximum price you are willing to pay for your
                                                                 instance, then pay the price of second
                                                                 highest bidder - great for workloads where occasional
                                                                 dropouts are not important like research,
                                                                 AI
                                                                 training etc.
                                                               </div>}/>}/>
                          <FormControlLabel value="guaranteedAvailability" control={<Radio/>}
                                            classes={{root: classes.radioWithDesc}}
                                            label={<RadioLabel classes={classes} label="Guaranteed Availability"
                                                               description={<div>
                                                                 Pay fixed price per minute, your instance is
                                                                 available
                                                                 until you stop it.
                                                               </div>}/>}/>
                          <FormControlLabel value="longTermBooking" control={<Radio/>}
                                            classes={{root: classes.radioWithDesc}}
                                            label={<RadioLabel classes={classes} label="Long-term Booking"
                                                               description={<div>
                                                                 Great for hosting websites "and always" on services -
                                                                 pay smaller price than on Guaranteed
                                                                 availability
                                                               </div>}/>}/>
                        </RadioGroup>
                      </FormControl>
                      <FormControl className={classes.formControl} style={{marginTop: '10px'}}>
                        <TextField
                          label="Price"
                          value={data.price}
                          onChange={this.handleChange('price', true, 'int')}
                          type="number"
                        />
                      </FormControl>
                      <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                               onCancel={this.onCancel}/>
                    </div>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Installation Script</StepLabel>
                  <StepContent>
                    <div className={classes.contentWrapper}>
                      <FormControl fullWidth className={classes.formControl}>
                        <RadioGroup
                          value={data.containerType}
                          onChange={this.handleChange('containerType')}
                        >
                          <FormControlLabel value="Docker" control={<Radio/>} label="Docker"/>
                          <FormControlLabel value="Kubernetes" control={<Radio/>} label="Kubernetes"/>
                        </RadioGroup>
                      </FormControl>
                      {data.containerType === 'Docker' ?
                        <div>
                          <FormControl fullWidth className={classes.formControl}>
                            <TextField
                              label="Repository URL"
                              value={data.dockerConfig.repositoryUrl}
                              onChange={(e) => this.setState(update(this.state, {data: {dockerConfig: {repositoryUrl: {$set: e.target.value}}}}))}
                              fullWidth
                              required
                            />
                          </FormControl>
                          <FormControl fullWidth className={classes.formControl}>
                            <TextField
                              label="Image Name"
                              value={data.dockerConfig.imageName}
                              onChange={(e) => this.setState(update(this.state, {data: {dockerConfig: {imageName: {$set: e.target.value}}}}))}
                              fullWidth
                              required
                            />
                          </FormControl>
                        </div>
                        :
                        <FormControl fullWidth className={classes.formControl}>
                          <TextField
                            label="Script"
                            value={data.kubernetesConfig.script}
                            onChange={(e) => this.setState(update(this.state, {data: {kubernetesConfig: {script: {$set: e.target.value}}}}))}
                            fullWidth
                            required
                          />
                        </FormControl>}
                      <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                               onCancel={this.onCancel}/>
                    </div>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>All set! Let's launch.</StepLabel>
                  <StepContent>
                    <div className={classes.contentWrapper}>
                      <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                               onCancel={this.onCancel} isLast={true}/>
                    </div>
                  </StepContent>
                </Step>
              </Stepper>
            </Paper>
          </Grid>
        </Grid>
        </div>
      </div>
    );
  }
}

function stateToProps(state) {
  const {workloads} = state;
  return {workloads};
}

const mapDispatchToProps = {
  addItem: (item) => ({type: ADD_WORKLOAD, item: item})
};

export default connect(stateToProps, mapDispatchToProps)(ConfigWizard);

const Actions = ({classes, onPrevious, onNext, onCancel, currentStep, isLast}) => {
  return (
    <div className={classes.actionsBox}>
      <Button raised="true" color='primary' onClick={() => onPrevious()} className={classes.actionBtn}
              disabled={currentStep === 0}>Previous</Button>
      {isLast ?
        <Button raised="true" color='primary' onClick={() => onNext(isLast)} className={classes.actionBtn}>Finish</Button>
        :
        <Button raised="true" color='primary' onClick={() => onNext(isLast)} className={classes.actionBtn}>Next</Button>}
      <Button raised="true" onClick={() => onCancel()} className={classes.actionBtn}>Cancel</Button>
    </div>
  );
};

Actions.defaultProps = {
  isLast: false
};

const RadioLabel = ({classes, label, description}) => (
  <div className={classes.radioLabel}>
    <div>{label}</div>
    <div className={classes.radioDescription}>{description}</div>
  </div>
);