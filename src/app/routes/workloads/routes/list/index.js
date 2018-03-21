import React from 'react';
import CardLayout from '../../../../../components/CardLayout';
import {Button} from 'material-ui';
import './workloads.scss';
import { connect } from 'react-redux';
import {
  REMOVE_WORKLOAD
} from '../../../../../constants/ActionTypes';
import WorkloadsTable from './table';

class Workloads extends React.Component {

  constructor() {
    super();
    this.state = {
    }
  }

  render() {
    let {list, providers, regions} = this.props.workloads;
    return (
      <div className="app-wrapper workloads">
        <div className="animated slideInUpTiny animation-duration-3">
          <CardLayout styleName="col-lg-12">
            <div className="jr-card-header mb-3 d-flex align-items-center">
              <div className="mr-auto">
                <h3 className="card-heading mb-0">
                  <i className="zmdi zmdi-eye mr-2"/>
                  Running instances
                </h3>
              </div>
              <Button variant="fab" onClick={()=>{this.props.history.push('/app/workloads/wizard')}} className="jr-fab-btn text-white bg-secondary" aria-label="edit">
                <i className="zmdi zmdi-plus zmdi-hc-fw zmdi-hc-lg"/>
              </Button>
              {/*<IconButton className="size-30" onClick={()=>{}}>
                <i className="zmdi zmdi-more-vert"/>
              </IconButton>*/}
            </div>
            <WorkloadsTable items={list} providers={providers} regions={regions}/>
          </CardLayout>
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

export default connect(stateToProps, mapDispatchToProps)(Workloads);