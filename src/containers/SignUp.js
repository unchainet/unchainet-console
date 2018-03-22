import React from 'react';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {CircularProgress} from 'material-ui/Progress';
import {Link} from 'react-router-dom';
import IntlMessages from 'util/IntlMessages';
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

class SignUp extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: ''
        }
    }

    componentDidUpdate() {
        if (this.props.showMessage) {
            setTimeout(() => {
                this.props.hideMessage();
            }, 3000);
        }
        if (this.props.authUser !== null) {
            this.props.history.push('/');
        }
    }

    signupHandler() {
      const {
        email,
        password,
        password2
      } = this.state;
      if (!password) {
        NotificationManager.error('Password is required');
        return false;
      }
      if (password !== password2) {
        NotificationManager.error('Passwords do not match');
        return false;
      }
      this.props.showAuthLoader();
      this.props.userSignUp({email, password});
    }

    render() {
        const {
            email,
            password,
            password2,
            code
        } = this.state;
        const {showMessage, loader, alertMessage, signupUser} = this.props;
        return (
            <div
                className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
                <div className="app-login-main-content">
                    <div className="app-logo-content d-flex align-items-center justify-content-center">
                        <Link className="logo-lg" to="/" title="Jambo">
                            <img src="assets/images/logo.png" alt="jambo" title="jambo" width="200"/>
                        </Link>
                    </div>

                    <div className="app-login-content">
                        <div className="app-login-header">
                            <h1>Sign Up</h1>
                        </div>

                        <div className="mb-4">
                            <h2><IntlMessages id="appModule.createAccount"/></h2>
                        </div>

                        <div className="app-login-form">
                            {!signupUser ?
                            <form method="post" action="/">

                                <TextField
                                    type="email"
                                    onChange={(event) => this.setState({email: event.target.value})}
                                    id="required"
                                    label={<IntlMessages id="appModule.email"/>}
                                    fullWidth
                                    defaultValue={email}
                                    margin="normal"
                                    className="mt-0 mb-2"
                                />

                                <TextField
                                    type="password"
                                    onChange={(event) => this.setState({password: event.target.value})}
                                    id="required"
                                    label={<IntlMessages id="appModule.password"/>}
                                    fullWidth
                                    defaultValue={password}
                                    margin="normal"
                                    className="mt-0 mb-2"
                                />

                                <TextField
                                  type="password"
                                  onChange={(event) => this.setState({password2: event.target.value})}
                                  id="required"
                                  label={<IntlMessages id="appModule.password2"/>}
                                  fullWidth
                                  defaultValue={password2}
                                  margin="normal"
                                  className="mt-0 mb-4"
                                />

                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                    <Button variant="raised" onClick={() => {this.signupHandler()}} color="primary">
                                        <IntlMessages
                                            id="appModule.register"/>
                                    </Button>
                                    <Link to="/signin">
                                        <IntlMessages id="signUp.alreadyMember"/>
                                    </Link>
                                </div>

                            </form> : null}
                          {signupUser ?
                            <form method="post" action="/">

                                <TextField
                                  type="text"
                                  onChange={(event) => this.setState({code: event.target.value})}
                                  id="required"
                                  label={<IntlMessages id="appModule.activationCode"/>}
                                  fullWidth
                                  defaultValue={code}
                                  margin="normal"
                                  className="mt-0 mb-2"
                                />

                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                    <Button variant="raised" onClick={() => {
                                      this.props.showAuthLoader();
                                      this.props.userActivate({_id: signupUser._id, code});
                                    }} color="primary">
                                        <IntlMessages
                                          id="appModule.activate"/>
                                    </Button>
                                    <Link to="/signin">
                                        <IntlMessages id="signUp.alreadyMember"/>
                                    </Link>
                                </div>

                            </form> : null}
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
    userFacebookSignIn,
    userGoogleSignIn,
    userGithubSignIn,
    userTwitterSignIn,
    userActivate
})(SignUp);
