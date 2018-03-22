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
import {connect} from 'react-redux';
import {
  ADD_WORKLOAD,
  EDIT_WORKLOAD,
  REMOVE_WORKLOAD,
} from '../../../../../constants/ActionTypes';
import {withStyles} from 'material-ui/styles/index';
import {compose} from 'redux';
import {fetchAllRegion} from 'actions/Region';
import {fetchAllDatacenter} from 'actions/Datacenter';
import CardLayout from 'components/CardLayout';


const styles = theme => ({
  root: {
    width: '100%',
    margin: '1em',
  },
  formControl: {
    marginBottom: theme.spacing.unit * 3
  },
  form: {
    padding: '1.5em'
  }
});

class ConfigWizard extends React.Component {

  componentDidMount() {
    this.props.fetchAllDatacenter();
    console.log(this.props.fetchAllRegion());
  }

  state = {
    qualityScore: 50,
    activeStep: 0,
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

  handleDataChange = (name, value, type = 'text') => event => {
    let newState = null;
    let value = type === 'int' ? parseInt(event.target.value) : event.target.value;

    newState = update(this.state, {
      data: {
        [name]: {$set: value},
      }
    });
    this.setState(newState);
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
    const {classes} = this.props;
    const {datacenter, region} = this.props;
    const {data} = this.state;
    const state = this.state;

    return (
      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="row justify-content-around">
            <div className="col-lg-6 col-md-6">
              <CardLayout>
                <div className={classes.form}>
                  <FormControl className={classes.formControl} fullWidth>
                    <TextField label='Workload Name' required onChange={this.handleDataChange('name')}
                               value={data.name}
                               fullWidth={true}/>
                  </FormControl>

                  <FormControl fullWidth className={classes.formControl}>
                    <InputLabel htmlFor="region">Region</InputLabel>
                    <Select
                      value={data.region}
                      onChange={(e) => {
                        this.handleDataChange('region')(e);
                        this.changeMapRegion(e.target.value);
                      }}
                      inputProps={{
                        id: 'region'
                      }}
                      required
                    >
                      {region.allRegions.map(i => (
                        <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth className={classes.formControl}>
                    <InputLabel htmlFor="datacenter">Datacenter</InputLabel>
                    <Select
                      value={data.datacenter}
                      onChange={this.handleDataChange('datacenter')}
                      required
                      fullWidth
                      inputProps={{
                        id: 'datacenter'
                      }}
                    >
                      {datacenter.allDatacenters.filter(i => (i.region === data.region) || !data.region).map(i => (
                        <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl className={classes.formControl} fullWidth>
                    <h2>Select Quality Score: {state.qualityScore}</h2>
                    <Slider min={0} value={state.qualityScore} onChange={(v)=>this.setState({qualityScore:v})} max={100}/>
                    <div>
                      <h3>Avalilable resources:</h3>
                      <div>vCPU: {Math.round((100-state.qualityScore)/100 * 5453)}</div>
                      <div>RAM (GB): { Math.round((100-state.qualityScore)/100 * 34204)}</div>
                      <div>Storage (GB): { Math.round((100-state.qualityScore)/100 * 943221)}</div>
                      <div>Storage - SSD (GB): { Math.round((100-state.qualityScore)/100 * 432748)}</div>
                    </div>
                  </FormControl>

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


const Actions = ({classes, onPrevious, onNext, onCancel, currentStep, isLast}) => {
  return (
    <div className={classes.actionsBox}>
      <Button raised="true" color='primary' onClick={() => onPrevious()} className={classes.actionBtn}
              disabled={currentStep === 0}>Previous</Button>
      {isLast ?
        <Button raised="true" color='primary' onClick={() => onNext(isLast)}
                className={classes.actionBtn}>Finish</Button>
        :
        <Button raised="true" color='primary' onClick={() => onNext(isLast)}
                className={classes.actionBtn}>Next</Button>}
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