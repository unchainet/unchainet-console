import React from 'react';
import Avatar from 'material-ui/Avatar'
import Icon from 'material-ui/Icon';
import {connect} from 'react-redux'
import Menu, {MenuItem} from 'material-ui/Menu';
import {userSignOut} from 'actions/Auth';
import IntlMessages from 'util/IntlMessages';
import {withRouter} from 'react-router';

class UserInfo extends React.Component {

    state = {
        anchorEl: null,
        open: false,
    };

    handleClick = event => {
        this.setState({open: true, anchorEl: event.currentTarget});
    };

    handleRequestClose = () => {
        this.setState({open: false});
    };

    getUserName () {
      let {data} = this.props.user;
      if (!data) {
        return '';
      }
      if (!data.name.first && !data.name.last) {
        return `Account ${data._id.substr(0, 10)}...`;
      }
      return data.name.first || data.name.last;
    };

    render() {
        return (
            <div className="user-profile d-flex flex-row align-items-center">
                <i className="zmdi zmdi-account zmdi-hc-fw zmdi-hc-3x"/>
                <div className="user-detail">
                    <h4 className="user-name" onClick={this.handleClick}>{this.getUserName()}  <i
                        className="zmdi zmdi-caret-down zmdi-hc-fw align-middle"/>
                    </h4>
                </div>
                <Menu className="user-info"
                      id="simple-menu"
                      anchorEl={this.state.anchorEl}
                      open={this.state.open}
                      onClose={this.handleRequestClose}
                      PaperProps={{
                          style: {
                              width: 120,
                              paddingTop: 0,
                              paddingBottom: 0
                          }
                      }}
                >
                    <MenuItem onClick={() => {
                      this.handleRequestClose();
                      this.props.history.push('/app/user/profile');
                    }}>
                        <i className="zmdi zmdi-account zmdi-hc-fw mr-2"/>
                        <IntlMessages id="popup.profile"/>
                    </MenuItem>
                    <MenuItem onClick={this.handleRequestClose}>
                        <i className="zmdi zmdi-settings zmdi-hc-fw mr-2"/>
                        <IntlMessages id="popup.setting"/>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        this.handleRequestClose();
                        this.props.userSignOut()
                    }}>
                        <i className="zmdi zmdi-sign-in zmdi-hc-fw mr-2"/>

                        <IntlMessages id="popup.logout"/>
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}


const mapStateToProps = ({settings, user}) => {
    const {locale} = settings;
    return {locale, user}
};
export default connect(mapStateToProps, {userSignOut})(withRouter(UserInfo));

