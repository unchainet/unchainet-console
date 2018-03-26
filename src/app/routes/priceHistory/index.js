import React from 'react';
import CardLayout from '../../../components/CardLayout/index';
import PriceHistoryGraph from '../../../components/PriceHistoryGraph/index';
import {fetchPriceHistory} from '../../../actions/PriceHistory';
import {connect} from 'react-redux'
import {IconButton} from 'material-ui';
import TextField from 'material-ui/TextField';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';


const regions = [
  {
    value: 'China',
    label: 'China',
  },
  {
    value: 'Australia',
    label: 'Australia',
  },
];

class PriceHistory extends React.Component {

  constructor() {
    super();
    this.state = {
      vCPU: '1',
      GPU: '0',
      RAM: '4',
      region: 'Australia',
      dataStub: this.getRandomData(3500), //todo remove when ready
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      dataStub:this.getRandomData(3500),//todo remove when ready
    });
  };

  //todo remove when ready
  getRandomData = (max) => {
    const dataStub = [{name: 'Apr 17'}, {name: 'May 17'}, {name: 'Jun 17'}, {name: 'July 17'}, {name: 'Aug 17'}, {name: 'Sept 17'}, {name: 'Oct 17'}, {name: 'Nov 17'}, {name: 'Dec 17'}, {name: 'Jan 18'}, {name: 'Feb 18'}, {name: 'Mar 18'}];
    dataStub.forEach((element) => {
      element.USD = Math.floor(Math.random() * Math.floor(max));
      element.CRC = element.USD * 3;
      element.UNET = element.USD * 1.6;
    });
    return dataStub;
  };

  //todo uncomment when ready
  // componentDidMount() {
  //   this.props.fetchPriceHistory();
  // }

  render() {

    // const {priceHistoryList} = this.props;//todo uncomment when ready
    const priceHistoryList = this.state.dataStub;//todo remove when ready

    const {vCPU, GPU, RAM, region} = this.state;
    return (
      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-3">

          <CardLayout styleName="col-lg-12">

            <div className="jr-card-header mb-3 d-flex align-items-center">
              <div className="mr-auto">
                <h3 className="card-heading mb-0">
                  <i className="zmdi zmdi-trending-up mr-2"/>
                  Spot Computing Price History
                </h3>
              </div>
              <IconButton className="size-30" onClick={()=>{}}>
                <i className="zmdi zmdi-more-vert"/>
              </IconButton>
            </div>

            <form className="row" noValidate autoComplete="off">

                  <div className="col-md-3 col-12">
                    <TextField
                      id="vCPU"
                      label="vCPU"
                      value={vCPU}
                      onChange={this.handleChange('vCPU')}
                      margin="normal"
                      fullWidth
                      type="number"
                    />
                  </div>
                  <div className="col-md-3 col-12">
                    <TextField
                      id="GPU"
                      label="GPU cores"
                      value={GPU}
                      onChange={this.handleChange('GPU')}
                      margin="normal"
                      fullWidth
                      type="number"
                    />
                  </div>
                  <div className="col-md-3 col-12">
                    <TextField
                      id="RAM"
                      label="RAM (GB)"
                      value={RAM}
                      onChange={this.handleChange('RAM')}
                      margin="normal"
                      fullWidth
                      type="number"
                    />
                  </div>
                  <div className="col-md-3 col-12">
                    <TextField
                      id="region"
                      select
                      label="Region"
                      value={region}
                      onChange={this.handleChange('region')}
                      SelectProps={{
                        native: true,
                      }}
                      margin="normal"
                      fullWidth
                      helperText="Please select region"
                    >
                      {regions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </div>

                </form>
            
            <PriceHistoryGraph priceHistoryList={priceHistoryList} />

          </CardLayout>
        </div>
      </div>
    )}

}

const mapStateToProps = ({priceHistory, settings}) => {
  const {width} = settings;
  const {
    loader,
    alertMessage,
    showMessage,
    noContentFoundMessage,
    priceHistoryList,
  } = priceHistory;

  return {
    width,
    loader,
    alertMessage,
    showMessage,
    noContentFoundMessage,
    priceHistoryList,
  }
};


export default connect(mapStateToProps, {fetchPriceHistory})(PriceHistory);