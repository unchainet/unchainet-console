import React from 'react';
import {Button} from 'material-ui';
import './workloads.scss';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import { connect } from 'react-redux';
import {withRouter} from 'react-router';
import {withStyles} from 'material-ui/styles/index';

import {
  REMOVE_WORKLOAD
} from '../../../../../constants/ActionTypes';

const TblCell = withStyles(theme => ({
  typeBody: {
    padding: '5px'
  }
}))(TableCell);

class WorkloadsTable extends React.Component {

  constructor() {
    super();
    this.state = {

    }
  }

  //todo review/change/remove after model(region prop) clarification
  getRegionName(region){
    const id = region.hasOwnProperty('_id') ? region._id : region;
    const regions = this.props.region;
    const selectedRegion = regions.allRegions.find(el => el._id === id);
    return selectedRegion.name;
  }

  render() {
    const items = this.props.items || [];
    let data = items.slice().reverse();
    return (
      <div className="table-responsive-material table-workloads">
        <Table>
          <TableHead>
            <TableRow>
              <TblCell>Name</TblCell>
              <TblCell>Region</TblCell>
              <TblCell>CPU/GPU/MEM (GB)/ Storage(GB)</TblCell>
              <TblCell>Status</TblCell>
              <TblCell>Public IP</TblCell>
              <TblCell>Public hostname</TblCell>
              <TblCell width="180px">Actions</TblCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((n, i) => {
              return (
                <TableRow key={n._id}>
                  <TblCell>{n.name}</TblCell>
                  <TblCell>{this.getRegionName(n.region)}</TblCell>
                  <TblCell>{`${n.numCPU || 0}/${n.numGPU || 0}/${n.memoryGB || 0}/${n.ssdGB || 0}`}</TblCell>
                  <TblCell>
                    {n.status === 'requested' && (
                      <i className="zmdi zmdi-settings zmdi-hc-spin" style={{marginRight: '3px'}}/>
                    )}
                    {n.status}
                  </TblCell>
                  <TblCell>{n.publicIP}</TblCell>
                  <TblCell>
                    <a href={n.publicHostname} target='_blank'>{n.publicHostname}</a>
                    </TblCell>
                  <TblCell>
                    <Button className="jr-btn jr-btn-lg" onClick={()=>{this.props.history.push(`/app/workloads/wizard?id=${n._id}`)}} color="primary">
                      <i className="zmdi zmdi-edit"/>
                    </Button>
                    <Button className="jr-btn jr-btn-lg" onClick={()=>{this.props.removeItem(n._id)}} color="primary">
                      <i className="zmdi zmdi-delete"/>
                    </Button>
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
const mapStateToProps = ({region}) => {//todo review/change/remove after model(region prop) clarification
  return {
    region
  }
};
const mapDispatchToProps = {
  removeItem: (id) => ({type: REMOVE_WORKLOAD, id: id})
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkloadsTable));