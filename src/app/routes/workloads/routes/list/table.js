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

  getProvider (item) {
    let providers = this.props.providers || [];
    return providers.filter(row => row.id == item.provider)[0] || {};
  }

  getRegion (item) {
    let regions = this.props.regions || [];
    return regions.filter(row => row.id == item.region)[0] || {};
  }

  render() {
    let data = this.props.items || [];
    return (
      <div className="table-responsive-material">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Region</TableCell>
              <TableCell numeric>CPU cores</TableCell>
              <TableCell numeric>Storage (Gb)</TableCell>
              <TableCell numeric>GPU cores</TableCell>
              <TableCell numeric>Price (CRC)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((n, i) => {
              return (
                <TableRow key={n.id}>
                  <TableCell>{n.name}</TableCell>
                  <TableCell>{this.getProvider(n).name}</TableCell>
                  <TableCell>{this.getRegion(n).name}</TableCell>
                  <TableCell numeric>{n.cpuCores}</TableCell>
                  <TableCell numeric>{n.storage}</TableCell>
                  <TableCell numeric>{n.gpu}</TableCell>
                  <TableCell numeric>{n.price}</TableCell>
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