import React from 'react';
import {Button} from 'material-ui';
import './workloads.scss';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import { connect } from 'react-redux';
import {withRouter} from 'react-router'
import {
  REMOVE_WORKLOAD
} from '../../../../../constants/ActionTypes';

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
              <TableCell>Name</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>CPU/GPU/MEM (GB)/ Storage(GB)</TableCell>
              <TableCell numeric>Price (CRC)</TableCell>
              <TableCell>Public IP</TableCell>
              <TableCell>Public hostname</TableCell>
              <TableCell width="180px">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((n, i) => {
              return (
                <TableRow key={n._id}>
                  <TableCell>{n.name}</TableCell>
                  <TableCell>{n.region ? n.region.name : ''}</TableCell>
                  <TableCell>{`${n.numCPU || 0}/${n.numGPU || 0}/${n.memoryGB || 0}/${n.ssdGB || 0}`}</TableCell>
                  <TableCell numeric>{n.price}</TableCell>
                  <TableCell>{n.publicIP}</TableCell>
                  <TableCell>{n.publicHostname}</TableCell>
                  <TableCell>
                    <Button className="jr-btn jr-btn-lg" onClick={()=>{this.props.history.push(`/app/workloads/wizard?id=${n.id}`)}} color="primary">
                      <i className="zmdi zmdi-edit"/>
                    </Button>
                    <Button className="jr-btn jr-btn-lg" onClick={()=>{this.props.removeItem(n.id)}} color="primary">
                      <i className="zmdi zmdi-delete"/>
                    </Button>
                  </TableCell>
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