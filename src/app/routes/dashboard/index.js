import React from 'react';
import CardBox from '../../../components/CardBox/index';
import PriceHistoryGraph from '../../../components/PriceHistoryGraph/index';
import priceHistoryData from '../../../stubData/priceHistoryDashboard'
import priceHistoryData2 from '../../../stubData/priceHistoryDashboard2'
import {Button} from 'material-ui';
import { connect } from 'react-redux';
import WorkloadsTable from '../workloads/routes/list/table';
import Map from './map';
import {
  REMOVE_WORKLOAD
} from '../../../constants/ActionTypes';
import {fetchAllRegion} from 'actions/Region';
import {fetchAllDatacenter} from 'actions/Datacenter';
import {fetchAllWorkloads} from 'actions/Workload';
import {goToTourStep} from 'actions/Tour';
import moment from 'moment'

class Dashboard extends React.Component {

  constructor() {
    super();
    this.state = {
      map: false
    }
  }

  componentDidMount() {
    if (!this.props.region.allRegions.length) {
      this.props.fetchAllRegion();
    }
    if (this.props.workloads.state === 'init') {
      this.props.fetchAllWorkloads();
    }
    setTimeout(() => this.setState({map: true}), 200);
  }

  newWorkload = () => {
    this.props.history.push('/app/workloads/wizard');
    this.props.goToTourStep(1);
  }

  render() {
    let {list} = this.props.workloads;
    let {map} = this.state;
    list = list || [];
    let provObj = {};
    list.forEach(function (item) {
      if (item.region) {
        provObj[item.region._id] = true;
      }
    });
    this.props.region.allRegions.forEach(row => {
      row.hasInstance = provObj[row._id];
    });
    let time = moment().format('HH:mm');
    return (
      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="row tour-workloads">
            <CardBox styleName="col-lg-12" cardStyle="jr-card-unet" heading>
              <div className="head-unet">
                <div className="name">RUNNING WORKLOADS</div>
                <div className="middle">{time}</div>
                <div className="controls tour-new-workload">
                  <Button variant="fab" onClick={this.newWorkload}
                          className="jr-fab-btn text-white bg-secondary tour-trigger-new-workload"
                          aria-label="edit">
                    <i className="zmdi zmdi-plus zmdi-hc-fw zmdi-hc-lg"/>
                  </Button>
                </div>
              </div>
              <div className="body-unet">
                <WorkloadsTable items={list}/>
              </div>
            </CardBox>
          </div>
          <div className="row">
            <CardBox styleName="col-lg-7" cardStyle="jr-card-unet" heading>
              <div className="head-unet">
                <div className="name">map - RUNNING WORKLOADS</div>
              </div>
              <div className="body-unet">
                {map ? <Map items={this.props.region.allRegions}/> : null}
              </div>
            </CardBox>
            <CardBox styleName="col-lg-5" cardStyle="jr-card-unet" childrenStyle="jr-card-min-height" heading>
              <div className="head-unet">
                <div className="name">price history</div>
              </div>
              <div className="body-unet">
                <PriceHistoryGraph priceHistoryList={priceHistoryData} height={230}/>
                <div style={{marginBottom: '30px'}} />
                <PriceHistoryGraph priceHistoryList={priceHistoryData2} height={230}/>
              </div>
            </CardBox>
          </div>
        </div>
      </div>

    );
  }
}

function stateToProps({workloads, region, datacenter}) {
  return {workloads, region, datacenter};
}

const mapDispatchToProps = {
  removeItem: (id) => ({type: REMOVE_WORKLOAD, id: id}),
  fetchAllRegion,
  fetchAllDatacenter,
  fetchAllWorkloads,
  goToTourStep
};

export default connect(stateToProps, mapDispatchToProps)(Dashboard);