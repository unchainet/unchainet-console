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

class Dashboard extends React.Component {

  constructor() {
    super();
    this.state = {
    }
  }

  componentDidMount() {
    if (!this.props.datacenter.allDatacenters.length) {
      this.props.fetchAllDatacenter();
    }
    if (!this.props.region.allRegions.length) {
      this.props.fetchAllRegion();
    }
  }

  render() {
    let {list} = this.props.workloads;
    list = list || [];
    let provObj = {};
    list.forEach(function (item) {
      provObj[item.provider] = true;
    });
    let markers = this.props.datacenter.allDatacenters.filter(row => provObj[row.id]);
    return (
      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="row">
            <CardBox styleName="col-lg-12" cardStyle="jr-card-unet" heading>
              <div className="head-unet">
                <div className="name">running instances</div>
                <div className="middle">12:20</div>
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
                <div className="name">map - running instances</div>
              </div>
              <div className="body-unet">
                <Map items={markers}/>
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