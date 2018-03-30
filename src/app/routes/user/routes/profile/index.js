import React from 'react';
import {Button} from 'material-ui';
import { connect } from 'react-redux';
import {userFetch, userUpdate, userUpdateErrorHide} from '../../../../../actions/User'
import TextField from 'material-ui/TextField';
import {CircularProgress} from 'material-ui/Progress';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CardBox from '../../../../../components/CardBox/index';

class Profile extends React.Component {

  getFieldInfo(required, location) {
    return {
      required: required,
      dirty: false,
      error: false,
      isLocation: location
    }
  }

  constructor() {
    super();
    this.state = {
      formSubmitted: false
    };
    this.fields = {
      name: this.getFieldInfo(true, false),
      street1: this.getFieldInfo(true, true),
      street2: this.getFieldInfo(false, true),
      suburb: this.getFieldInfo(true, true),
      state: this.getFieldInfo(true, true),
      postcode: this.getFieldInfo(true, true),
      country: this.getFieldInfo(true, true),
      phone: this.getFieldInfo(true, false),
      companyName: this.getFieldInfo(false, false),
      website: this.getFieldInfo(false, false)
    };
  }

  componentDidMount() {
    this.props.userFetch();
  }

  componentDidUpdate() {
    if (this.props.user.error) {
      setTimeout(() => {
        this.props.userUpdateErrorHide();
      }, 100);
    }
  }

  componentWillReceiveProps(props) {
    if (props.user && props.user.data) {
      this.setState({
        user: props.user.data
      })
    }
  }

  hasError(name, isLocation) {
    const field = this.fields[name];
    const {user, formSubmitted} = this.state;
    if (!user || !field.required) {
      return false;
    }
    const value = isLocation ? user.location[name] : user[name];
    return (field.dirty || formSubmitted) && !value;
  }

  handleInputChange(e, isLocation) {
    let {user} = this.state;
    const {name, value} = e.target;
    this.fields[name].dirty = true;
    if (!isLocation) {
      user[name] = value;
    } else {
      user.location[name] = value;
    }
    this.setState({
      user: user
    });
  }

  handleSubmit() {
    this.setState({formSubmitted: true});
    const {user} = this.state;
    let isValid = true;
    for (let key in this.fields) {
      if (this.fields[key].required) {
        const value = this.fields[key].isLocation ? user.location[key] : user[key];
        if (!value) {
          isValid = false;
        }
      }
    }
    if (!isValid) {
      return false;
    }
    this.props.userUpdate(user);
  }

  render() {
    let {user} = this.state;
    const {loader, error} = this.props.user;
    let requiredErrorText = 'Required field';
    return (
      <div className="app-wrapper user-profile">
        <div className="animated slideInUpTiny animation-duration-3">
          <CardBox styleName="col-lg-12" heading>
            <h3 className="mb-0">
              PROFILE
            </h3>
            <form className="mb-0" noValidate autoComplete="off">
              <div className="row">
                <div className="col-md-6 col-xs-12">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Full Name:*</label>
                    <div className="col-sm-9">
                      <TextField
                          required={this.fields.name.required}
                          value={user && user.name || ''}
                          fullWidth
                          inputProps={{
                            name: 'name'
                          }}
                          onChange={(e) => this.handleInputChange(e)}
                          error={this.hasError('name', false)}
                          helperText={this.hasError('name', false) ? requiredErrorText : ''}
                        />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Address:*</label>
                    <div className="col-sm-9">
                      <TextField
                        required={this.fields.street1.required}
                        value={user && user.location.street1 || ''}
                        fullWidth
                        inputProps={{
                          name: 'street1'
                        }}
                        onChange={(e) => this.handleInputChange(e, true)}
                        error={this.hasError('street1', true)}
                        helperText={this.hasError('street1', true) ? requiredErrorText : ''}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label" />
                    <div className="col-sm-9">
                      <TextField
                        required={this.fields.street2.required}
                        value={user && user.location.street2 || ''}
                        fullWidth
                        inputProps={{
                          name: 'street2'
                        }}
                        onChange={(e) => this.handleInputChange(e, true)}
                        error={this.hasError('street2', true)}
                        helperText={this.hasError('street2', true) ? requiredErrorText : ''}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">City:*</label>
                    <div className="col-sm-9">
                      <TextField
                        required={this.fields.suburb.required}
                        value={user && user.location.suburb || ''}
                        fullWidth
                        inputProps={{
                          name: 'suburb'
                        }}
                        onChange={(e) => this.handleInputChange(e, true)}
                        error={this.hasError('suburb', true)}
                        helperText={this.hasError('suburb', true) ? requiredErrorText : ''}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">State:*</label>
                    <div className="col-sm-9">
                      <TextField
                        required={this.fields.state.required}
                        value={user && user.location.state || ''}
                        fullWidth
                        inputProps={{
                          name: 'state'
                        }}
                        onChange={(e) => this.handleInputChange(e, true)}
                        error={this.hasError('state', true)}
                        helperText={this.hasError('state', true) ? requiredErrorText : ''}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Postal Code:*</label>
                    <div className="col-sm-9">
                      <TextField
                        required={this.fields.postcode.required}
                        value={user && user.location.postcode || ''}
                        fullWidth
                        inputProps={{
                          name: 'postcode'
                        }}
                        onChange={(e) => this.handleInputChange(e, true)}
                        error={this.hasError('postcode', true)}
                        helperText={this.hasError('postcode', true) ? requiredErrorText : ''}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Country:*</label>
                    <div className="col-sm-9">
                      <TextField
                        required={this.fields.country.required}
                        value={user && user.location.country || ''}
                        fullWidth
                        inputProps={{
                          name: 'country'
                        }}
                        onChange={(e) => this.handleInputChange(e, true)}
                        error={this.hasError('country', true)}
                        helperText={this.hasError('country', true) ? requiredErrorText : ''}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Phone Number:*</label>
                    <div className="col-sm-9">
                      <TextField
                        required={this.fields.phone.required}
                        value={user && user.phone || ''}
                        fullWidth
                        inputProps={{
                          name: 'phone'
                        }}
                        onChange={(e) => this.handleInputChange(e)}
                        error={this.hasError('phone', false)}
                        helperText={this.hasError('phone', false) ? requiredErrorText : ''}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Company Name:</label>
                    <div className="col-sm-9">
                      <TextField
                        required={this.fields.companyName.required}
                        value={user && user.companyName || ''}
                        fullWidth
                        inputProps={{
                          name: 'companyName'
                        }}
                        onChange={(e) => this.handleInputChange(e)}
                        error={this.hasError('companyName', false)}
                        helperText={this.hasError('companyName', false) ? requiredErrorText : ''}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Website URL:</label>
                    <div className="col-sm-9">
                      <TextField
                        required={this.fields.website.required}
                        value={user && user.website || ''}
                        fullWidth
                        inputProps={{
                          name: 'website'
                        }}
                        onChange={(e) => this.handleInputChange(e)}
                        error={this.hasError('website', false)}
                        helperText={this.hasError('website', false) ? requiredErrorText : ''}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label" />
                    <div className="col-sm-9">
                      <Button disabled={!user || !user._id} color="secondary" variant='raised' onClick={() => this.handleSubmit()}>Update</Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </CardBox>
        </div>
        {error && NotificationManager.error(error)}
        <NotificationContainer/>
      </div>

    );
  }
}

function stateToProps({user}) {
  return {user};
}

export default connect(stateToProps, {userFetch, userUpdate, userUpdateErrorHide})(Profile);