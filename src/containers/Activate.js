import React from 'react';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {CircularProgress} from 'material-ui/Progress';
import {Link} from 'react-router-dom';
import IntlMessages from 'util/IntlMessages';
import qs from 'query-string';
import {
    hideMessage,
    showAuthLoader,
    userFacebookSignIn,
    userGithubSignIn,
    userGoogleSignIn,
    userSignUp,
    userActivate,
    userTwitterSignIn
} from 'actions/Auth';

class Activate extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
      this.props.showAuthLoader();
      const params = qs.parse(this.props.location.search);
      if (!params.id || !params.code) {
        return this.props.history.push('/signin');
      }
      this.props.userActivate({_id: params.id, code: params.code});
    }

    componentDidUpdate() {
      if (this.props.alertMessage) {
        return this.props.history.push('/signin');
      } else if (this.props.authUser !== null) {
        this.props.history.push('/');
      }
    }

    render() {
        const {showMessage, loader, alertMessage, signupUser} = this.props;
        return (
            <div
                className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
                <div className="app-login-main-content" style={{minWidth: '300px', minHeight: '150px'}}>
                    <div className="app-logo-content d-flex align-items-center justify-content-center">
                        <Link className="logo-lg" to="/" title="Jambo">
                            <img src="assets/images/logo.png" alt="jambo" title="jambo" width="150"/>
                        </Link>
                    </div>

                    <div className="app-login-content">
                        <div className="app-login-header">
                            <h1>Activation...</h1>
                        </div>
                    </div>

                </div>

                {
                    loader &&
                    <div className="loader-view">
                        <CircularProgress/>
                    </div>
                }
                {showMessage && NotificationManager.error(alertMessage)}
                <NotificationContainer/>
            </div>
        )
    }
}

const mapStateToProps = ({auth}) => {
    const {loader, alertMessage, showMessage, authUser, signupUser} = auth;
    return {loader, alertMessage, showMessage, authUser, signupUser}
};

export default connect(mapStateToProps, {
    userSignUp,
    hideMessage,
    showAuthLoader,
    userActivate
})(Activate);
