import React from 'react';
import CardBox from '../../../components/CardBox/index';
import {Button} from 'material-ui';
import { connect } from 'react-redux';
import WorkloadsTable from '../workloads/routes/list/table';
import Map from './map';


class Dashboard extends React.Component {

  constructor() {
    super();
    this.state = {
    }
  }

  render() {
    let {list, providers, regions} = this.props.workloads;
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
                <WorkloadsTable items={list} providers={providers} regions={regions}/>
              </div>
            </CardBox>
          </div>
          <div className="row">
            <CardBox styleName="col-lg-8" cardStyle="jr-card-unet" heading>
              <div className="head-unet">
                <div className="name">map - running instances</div>
              </div>
              <div className="body-unet">
                <Map />
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

function stateToProps(state) {
  const {workloads} = state;
  return {workloads};
}

const mapDispatchToProps = {
  removeItem: (id) => ({type: REMOVE_WORKLOAD, id: id})
};

export default connect(stateToProps, mapDispatchToProps)(Dashboard);