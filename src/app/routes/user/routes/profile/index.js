import React from 'react';
import CardLayout from '../../../../../components/CardLayout';
import {Button} from 'material-ui';
import { connect } from 'react-redux';
import {userFetch} from '../../../../../actions/User';

class Profile extends React.Component {

  constructor() {
    super();
    this.state = {
    }
  }

  componentDidMount() {
    this.props.userFetch();
  }

  render() {
    return (
      <div className="app-wrapper user-profile">
        <div className="animated slideInUpTiny animation-duration-3">
          <CardLayout styleName="col-lg-12">
            <div className="jr-card-header mb-3 d-flex align-items-center">
              <div className="mr-auto">
                <h3 className="card-heading mb-0">
                  PROFILE
                </h3>
              </div>
            </div>
          </CardLayout>
        </div>
      </div>

    );
  }
}

function stateToProps({user}) {
  return {user};
}

export default connect(stateToProps, {userFetch})(Profile);