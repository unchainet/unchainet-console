import React from "react";
import IconButton from "material-ui/IconButton";
import EditIcon from "material-ui-icons/ModeEdit";
import DeleteIcon from "material-ui-icons/Delete";
import "./workloads.scss";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { withStyles } from "material-ui/styles/index";
import Tooltip from "material-ui/Tooltip";

import { REMOVE_WORKLOAD } from "../../../../../constants/ActionTypes";
import cx from "classnames";
import { compose } from "redux";

const TblCell = withStyles(theme => ({
  typeBody: {
    padding: "0 8px"
  },
  typeHead: {
    backgroundColor: "#eee",
    color: "#000",
    padding: "5px 8px",
    whiteSpace: "nowrap"
  }
}))(TableCell);

const styles = theme => ({
  cellCentered: {
    textAlign: "center"
  }
});

class WorkloadsTable extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  //todo review/change/remove after model(region prop) clarification
  getRegionName(region) {
    const id = region.hasOwnProperty("_id") ? region._id : region;
    const regions = this.props.region;
    const selectedRegion = regions.allRegions.find(el => el._id === id);
    return selectedRegion.name;
  }

  render() {
    const items = this.props.items || [];
    let data = items.slice().reverse();
    const { classes } = this.props;
    const centered = {
      typeHead: classes.cellCentered,
      typeBody: classes.cellCentered
    };
    return (
      <div className="table-responsive-material table-workloads">
        <Table>
          <TableHead>
            <TableRow>
              <TblCell>Name</TblCell>
              <TblCell>Region</TblCell>
              <TblCell classes={centered}>
                CPU/GPU/MEM (GB)/ Storage(GB)
              </TblCell>
              <TblCell classes={centered}>Status</TblCell>
              <TblCell>Public IP</TblCell>
              <TblCell>Public hostname</TblCell>
              <TblCell width="180px" classes={centered}>
                Actions
              </TblCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((n, i) => {
              return (
                <TableRow key={n._id}>
                  <TblCell className="font-weight-bold">{n.name}</TblCell>
                  <TblCell>{this.getRegionName(n.region)}</TblCell>
                  <TblCell classes={centered}>{`${n.numCPU || 0}/${n.numGPU ||
                    0}/${n.memoryGB || 0}/${n.ssdGB || 0}`}</TblCell>
                  <TblCell classes={centered}>
                    {n.status === "requested" && (
                      <i
                        className="zmdi zmdi-settings zmdi-hc-spin"
                        style={{ marginRight: "3px" }}
                      />
                    )}
                    <span
                      className={cx({ "text-green": n.status === "running" })}
                    >
                      {n.status}
                    </span>
                  </TblCell>
                  <TblCell>{n.publicIP}</TblCell>
                  <TblCell
                    className={cx({
                      "tour-public-hostname": n.status === "requested"
                    })}
                  >
                    <a
                      href="http://workload1.aiml.syd.unchai.net/"
                      target="_blank"
                    >
                      {n.publicHostname}
                    </a>
                  </TblCell>
                  <TblCell classes={centered}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => {
                          this.props.history.push(
                            `/app/workloads/wizard/${n._id}`
                          );
                        }}
                        color="primary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => {
                          this.props.removeItem(n._id);
                        }}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TblCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = ({ region }) => {
  //todo review/change/remove after model(region prop) clarification
  return {
    region
  };
};
const mapDispatchToProps = {
  removeItem: id => ({ type: REMOVE_WORKLOAD, id: id })
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(WorkloadsTable);
