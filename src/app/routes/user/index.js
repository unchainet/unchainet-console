import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import Profile from './routes/profile';

const Components = ({match}) => (
      <div>
        <Route path={`${match.url}/profile`} component={Profile}/>
      </div>
)

export default Components;