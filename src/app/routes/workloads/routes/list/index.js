import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import CardLayout from '../../../../../components/CardLayout';
import {IconButton, Button} from 'material-ui';
import './workloads.scss';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import { connect } from 'react-redux';
import {
  ADD_WORKLOAD,
  EDIT_WORKLOAD,
  REMOVE_WORKLOAD
} from '../../../../../constants/ActionTypes';

class Workloads extends React.Component {
  onOptionMenuSelect = event => {
    this.setState({menuState: true, anchorEl: event.currentTarget});
  };
  handleRequestClose = () => {
    this.setState({menuState: false});
  };

  constructor() {
    super();
    this.state = {
      anchorEl: undefined,
      menuState: false
    }
  }

  getProvider (item) {
    const {providers} = this.props.workloads;
    return providers.filter(row => row.id == item.provider)[0] || {};
  }

  getRegion (item) {
    const {regions} = this.props.workloads;
    return regions.filter(row => row.id == item.region)[0] || {};
  }

  render() {
    let data = this.props.workloads.list;
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