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
  },
  typeHead: {
    backgroundColor: '#444',
    color: '#fff'
  }
}))(TableCell);

class WorkloadsTable extends React.Component {

  constructor() {
    super();
    this.state = {

    }
  }

  render() {
    let data = this.props.items || [];
    return (
      <div className="table-responsive-material table-workloads">
        <Table>
          <TableHead>
            <TableRow>
              <TblCell>Name</TblCell>
              <TblCell>Region</TblCell>
              <TblCell>CPU/GPU/MEM (GB)/ Storage(GB)</TblCell>
              <TblCell numeric>Price (CRC)</TblCell>
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
                  <TblCell>{n.region ? n.region.name : ''}</TblCell>
                  <TblCell>{`${n.numCPU || 0}/${n.numGPU || 0}/${n.memoryGB || 0}/${n.ssdGB || 0}`}</TblCell>
                  <TblCell numeric>{n.price}</TblCell>
                  <TblCell>{n.publicIP}</TblCell>
                  <TblCell>{n.publicHostname}</TblCell>
                  <TblCell>
                    <Button className="jr-btn jr-btn-lg" onClick={()=>{this.props.history.push(`/app/workloads/wizard?id=${n.id}`)}} color="primary">
                      <i className="zmdi zmdi-edit"/>
                    </Button>
                    <Button className="jr-btn jr-btn-lg" onClick={()=>{this.props.removeItem(n.id)}} color="primary">
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

const mapDispatchToProps = {
  removeItem: (id) => ({type: REMOVE_WORKLOAD, id: id})
};

export default connect(null, mapDispatchToProps)(withRouter(WorkloadsTable));