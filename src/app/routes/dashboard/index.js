import React from 'react';
import CardBox from '../../../components/CardBox/index';
import {Button} from 'material-ui';
import { connect } from 'react-redux';
import WorkloadsTable from '../workloads/routes/list/table';
import Map from './map';
import {
  REMOVE_WORKLOAD
} from '../../../constants/ActionTypes';
import {fetchAllRegion} from 'actions/Region';
import {fetchAllDatacenter} from 'actions/Datacenter';
import moment from 'moment'

class Dashboard extends React.Component {

  constructor() {
    super();
    this.state = {
      map: false
    }
  }

  componentDidMount() {
    if (!this.props.datacenter.allDatacenters.length) {
      this.props.fetchAllDatacenter();
    }
    if (!this.props.region.allRegions.length) {
      this.props.fetchAllRegion();
    }
    setTimeout(() => this.setState({map: true}), 200);
  }

  render() {
    let {list} = this.props.workloads;
    let {map} = this.state;
    list = list || [];
    let provObj = {};
    list.forEach(function (item) {
      provObj[item.region] = true;
    });
    console.log(this.props.region);
    this.props.region.allRegions.forEach(row => {
      row.hasInstance = provObj[row._id];
    });
    let time = moment().format('HH:mm');
    return (
      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="row">
            <CardBox styleName="col-lg-12" cardStyle="jr-card-unet" heading>
              <div className="head-unet">
                <div className="name">RUNNING WORKLOADS</div>
                <div className="middle">{time}</div>
                <div className="controls">
                  <Button className="jr-btn jr-btn-sm text-white" onClick={()=>{}} color="primary">
                    <i className="zmdi zmdi-refresh"/>
                  </Button>
                  <Button className="jr-btn jr-btn-sm text-white" onClick={()=>{}} color="primary">
                    <i className="zmdi zmdi-close"/>
                  </Button>
                </div>
              </div>
              <div className="body-unet">
                <WorkloadsTable items={list} providers={this.props.datacenter.allDatacenters} regions={this.props.region.allRegions}/>
              </div>
            </CardBox>
          </div>
          <div className="row">
            <CardBox styleName="col-lg-8" cardStyle="jr-card-unet" heading>
              <div className="head-unet">
                <div className="name">map - RUNNING WORKLOADS</div>
              </div>
              <div className="body-unet">
                {map ? <Map items={this.props.region.allRegions}/> : null}
              </div>
            </CardBox>
            <CardBox styleName="col-lg-4" cardStyle="jr-card-unet" heading>
              <div className="head-unet">
                <div className="name">price history - crc tokens</div>
              </div>
              <div className="body-unet">
                sad
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
  fetchAllDatacenter
};

export default connect(stateToProps, mapDispatchToProps)(Dashboard);