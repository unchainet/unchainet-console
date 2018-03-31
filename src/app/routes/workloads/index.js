import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import List from './routes/list';
import Wizard from './routes/wizard';

const Components = ({match}) => {
  return(
    <div>
      <Route exact path={`${match.url}`} component={List}/>
      <Route path={`${match.url}/wizard/:id?`} component={Wizard}/>
    </div>
  )
}

export default Components;