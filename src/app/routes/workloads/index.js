import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

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
    }
  }

  render() {
    const {anchorEl, menuState} = this.state;
    return (
      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-3">
          workloads

        </div>
      </div>

    );
  }
}

export default Workloads;