import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import List from './routes/list';
import Wizard from './routes/wizard';

const Components = ({match}) => (
      <div>
        <Route path={`${match.url}/list`} component={List}/>
        <Route path={`${match.url}/wizard`} component={Wizard}/>
      </div>
)

export default Components;