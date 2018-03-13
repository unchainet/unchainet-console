import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../util/AsyncFunc';


const Icons = ({match}) => (
    <div className="app-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/material`}/>
            <Route path={`${match.url}/material`} component={asyncComponent(() => import('./routes/Material'))}/>
        </Switch>
    </div>
);

export default Icons;
