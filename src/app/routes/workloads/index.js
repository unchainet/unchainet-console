import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import CardLayout from "../../../components/CardLayout/index";
import {IconButton} from "material-ui";
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';

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
      menuState: false,
      data: [
        {
          id: 1,
          name: 'LA 23',
          provider: 'Draco X',
          region: 'Australia',
          cpuCores: 20,
          storage: 120,
          gpuCores: 10,
          price: 50
        },
        {
          id: 2,
          name: 'LA 23',
          provider: 'Draco X',
          region: 'Australia',
          cpuCores: 20,
          storage: 120,
          gpuCores: 10,
          price: 50
        }
      ]
    }
  }

  render() {
    let data = this.state.data;
    return (
      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-3">
          <CardLayout styleName="col-lg-12">
            <div className="jr-card-header mb-3 d-flex align-items-center">
              <div className="mr-auto">
                <h3 className="card-heading mb-0">
                  <i className="zmdi zmdi-eye mr-2"/>
                  Running instances
                </h3>
              </div>
              <IconButton className="size-30" onClick={()=>{}}>
                <i className="zmdi zmdi-more-vert"/>
              </IconButton>
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
                        <TableCell>{n.provider}</TableCell>
                        <TableCell>{n.region}</TableCell>
                        <TableCell numeric>{n.cpuCores}</TableCell>
                        <TableCell numeric>{n.storage}</TableCell>
                        <TableCell numeric>{n.gpuCores}</TableCell>
                        <TableCell numeric>{n.price}</TableCell>
                        <TableCell>
                          <i className="zmdi zmdi-delete" onClick={()=>{data.splice(i, 1);this.setState({data: data})}}/>
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

export default Workloads;