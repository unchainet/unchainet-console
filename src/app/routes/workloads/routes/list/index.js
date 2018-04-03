import React from "react";
import CardLayout from "../../../../../components/CardLayout";
import { Button } from "material-ui";
import "./workloads.scss";
import { connect } from "react-redux";
import { REMOVE_WORKLOAD } from "../../../../../constants/ActionTypes";
import WorkloadsTable from "./table";
import { fetchAllRegion } from "actions/Region";
import { fetchAllDatacenter } from "actions/Datacenter";
import { fetchAllWorkloads } from "../../../../../actions/Workload";
import Tooltip from "material-ui/Tooltip";

class Workloads extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (!this.props.region.allRegions.length) {
      this.props.fetchAllRegion();
    }
    if (this.props.workloads.state === "init") {
      this.props.fetchAllWorkloads();
    }
  }

  render() {
    let { list } = this.props.workloads;
    return (
      <div className="app-wrapper workloads">
        <div className="animated slideInUpTiny animation-duration-3">
          <CardLayout styleName="col-lg-12 jr-card--page">
            <div className="jr-card-header d-flex align-items-center">
              <h3>
                <i className="zmdi zmdi-play" />
                Running Workloads
              </h3>
              <Tooltip title="Add new Workload">
                <Button
                  variant="fab"
                  classes={{root:"btn-new"}}
                  onClick={() => {
                    this.props.history.push("/app/workloads/wizard");
                  }}
                  className="jr-fab-btn text-white bg-secondary"
                  aria-label="edit"
                >
                  <i className="zmdi zmdi-plus zmdi-hc-fw zmdi-hc-lg" />
                </Button>
              </Tooltip>
            </div>
            <WorkloadsTable items={list} />
          </CardLayout>
        </div>
      </div>
    );
  }
}

function stateToProps({ workloads, region, datacenter }) {
  return { workloads, region, datacenter };
}

const mapDispatchToProps = {
  removeItem: id => ({ type: REMOVE_WORKLOAD, id: id }),
  fetchAllRegion,
  fetchAllDatacenter,
  fetchAllWorkloads
};

export default connect(stateToProps, mapDispatchToProps)(Workloads);
