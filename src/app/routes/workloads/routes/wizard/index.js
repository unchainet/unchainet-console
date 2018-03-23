import React from 'react';
import update from 'immutability-helper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {FormControl, FormControlLabel, FormLabel} from 'material-ui/Form';
import Select from 'material-ui/Select';
import MenuItem from 'material-ui/Menu/MenuItem';
import {InputLabel} from 'material-ui/Input';
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
    padding: '1.8em 2.5em 1.2em',
    backgroundColor: '#555',
    color: '#fff',
    marginTop: -38,
    '& h2': {
      fontSize: '1.4em'
    },
    '& h3': {
      fontSize: '.7em',
      fontWeight: '200'
    }
  },
  iwResources: {
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
  }
});

class ConfigWizard extends React.Component {

  componentDidMount() {
    this.props.fetchAllDatacenter();
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
      cpuCores: 1,
      ram: 4,
      gpuCores: 0,
      storage: 10,
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
      status: 'running'
    },
    availableResources: {
      cpu: 5302,
      ram: 23084,
      storageHdd: 296403,
      storageSsd: 843049
    }
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

  handleDataChange = (name, type = 'text') => event => {
    let value = type === 'int' ? parseInt(event.target.value) : event.target.value;

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
    const {region} = this.props;
    let selectedRegion = region.allRegions.find(i => i.id === regionId);
    let newState = update(this.state,
      {
        mapLocation: {$set: selectedRegion.location},
        mapZoom: {$set: selectedRegion.zoom},
        data: {
          datacenter: {$set: ''}
        }
      });

    this.setState(newState);
  };

  selectProvider = (id) => {
    this.setState(update(this.state, {
      data: {
        provider: {$set: id}
      }
    }));
  };

  render() {
    const {classes} = this.props;
    const {datacenter, region} = this.props;
    const {data, mapActiveDatacenterId, availableResources, activeStep} = this.state;
    const state = this.state;
    const {cpu, ram, storageHdd, storageSsd} = state.availableResources;

    const selectedDatacenter = datacenter.allDatacenters.find(i => {
      return i.id === data.datacenter
    });
    const coe = selectedDatacenter ? selectedDatacenter.coe : 1;
    const stepsTotal = 6;

    return (
      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="row justify-content-around">
            <div className="col-lg-8 col-md-10">
              <CardLayout>
                <div className={classes.form}>
                  {activeStep === 0 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Workload</h2>
                      <h3>Step {activeStep+1} of {stepsTotal}</h3>
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
                      <Button color="primary" variant='raised' onClick={() => this.setState({activeStep: 1})}>Next</Button><Button variant='raised'>Cancel</Button>
                    </div>
                  </section>}

                  {activeStep === 1 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Location</h2>
                      <h3>Step {activeStep+1} of {stepsTotal}</h3>
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
                          <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="datacenter">Datacenter</InputLabel>
                      <Select
                        value={data.datacenter}
                        onChange={e => {
                          this.handleDataChange('datacenter')(e)
                            .then(() => {
                              this.setState({mapActiveDatacenterId: e.target.value});
                            });
                        }}
                        required
                        inputProps={{
                          id: 'datacenter'
                        }}
                        className={classes.formInput}
                      >
                        {datacenter.allDatacenters.filter(i => (i.region === data.region) || !data.region).map(i => (
                          <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formControl} fullWidth>
                      <Map
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA0wwNWl1SoRNcHLmE94ST06IOSAn4WLho&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div/>}
                        containerElement={<div style={{height: `500px`}}/>}
                        mapElement={<div style={{height: `100%`}}/>}
                        center={state.mapLocation}
                        zoom={state.mapZoom}
                      >
                        {datacenter.allDatacenters.map(i => (
                          <Marker
                            key={i.id}
                            position={i.location}
                            onClick={() => this.setState({mapActiveDatacenterId: i.id})}
                          >
                            {mapActiveDatacenterId === i.id &&
                            <InfoWindow
                              onCloseClick={() => this.setState({mapActiveDatacenterId: null})}

                            >
                              <div className={classes.infoBox}>
                                <h2>{i.name}</h2>
                                <h5>Available resources</h5>
                                <div className={classes.iwResources}>
                                  <div><h6>CPUs</h6> <span className='text-red'>{(Math.round(i.coe * cpu)).toLocaleString()}</span></div>
                                  <div><h6>RAM (GB)</h6> <span className='text-amber'>{(Math.round(i.coe * ram)).toLocaleString()}</span></div>
                                  <div><h6>Storage - HDD (GB)</h6> <span className='text-purple'>{(Math.round(i.coe * storageHdd)).toLocaleString()}</span></div>
                                  <div><h6>Storage - SSD (GB)</h6> <span className='text-green'>{(Math.round(i.coe * storageSsd)).toLocaleString()}</span></div>
                                </div>
                                <div className='text-right pr-2 pt-4 pb-2'>
                                  <Button variant='fab' mini color='primary'
                                          onClick={() =>
                                            this.setState(
                                              update(
                                                this.state, {
                                                  data: {
                                                    datacenter: {$set: i.id}
                                                  }
                                                }))}>
                                    <CheckIcon/>
                                  </Button>
                                </div>
                              </div>
                            </InfoWindow>}
                          </Marker>
                        ))}
                      </Map>
                    </FormControl>

                    <div className={classes.buttonBox}>
                      <Button color="primary" variant='raised' onClick={() => this.setState({activeStep: 2})}>Next</Button>
                      <Button color="primary" variant='raised' onClick={() => this.setState({activeStep: 1})}>Previous</Button>
                      <Button variant='raised'>Cancel</Button>
                    </div>
                  </section>}

                  {activeStep === 2 &&
                  <section>
                    <div className={classes.section}>
                      <h2>Quality</h2>
                      <h3>Step {activeStep+1} of {stepsTotal}</h3>
                    </div>

                    <div className={classes.formControl}>
                      <h4 className='pt-3'>Set minimal Quality Score: <span className='text-blue'>{state.qualityScore}</span></h4>
                      <div className='px-5 pb-4 pt-3'>
                        <Slider min={0} value={state.qualityScore} onChange={(v) => this.setState({qualityScore: v})}
                                max={100}/>
                      </div>
                      <div>
                        <h3 className='text-center'>Available resources:</h3>
                        <div className='jr-card'>
                          <div>vCPU: {Math.round((100 - state.qualityScore * 0.9) / 100 * cpu * coe)}</div>
                          <div>RAM (GB): {Math.round((100 - state.qualityScore * 0.9) / 100 * ram * coe)}</div>
                          <div>Storage (GB): {Math.round((100 - state.qualityScore * 0.9) / 100 * storageHdd * coe)}</div>
                          <div>Storage - SSD (GB): {Math.round((100 - state.qualityScore * 0.9) / 100 * storageSsd * coe)}</div>
                        </div>
                      </div>
                    </div>
                    <div className={classes.buttonBox}>
                      <Button color="primary" variant='raised' onClick={() => this.setState({activeStep: 3})}>Next</Button>
                      <Button color="primary" variant='raised' onClick={() => this.setState({activeStep: 2})}>Previous</Button>
                      <Button variant='raised'>Cancel</Button>
                    </div>
                  </section>}
                  {/*{datacenter.allDatacenters.map((el, i) =>*/}
                  {/*<div>{el.name}</div>)}*/}

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
