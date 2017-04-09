import React from 'react'
import CoreLayout from '../layouts/CoreLayout'
import ActivitiesRoute from './Activities'
import AboutRoute from './Home'
import ActivityRoute from'./Activity'
import NotFound from '../components/NotFound'
import Match from 'react-router/Match';
import Redirect from 'react-router/Redirect';
import Miss from 'react-router/Miss';

export const createMatches = (store) => (
  <CoreLayout>
    <Match exactly pattern='/activities' render={ActivitiesRoute}/>
    <Match pattern='/about' render={AboutRoute}/>
    <Match pattern='/activity/:id' render={(props) => {
      return (
        <ActivityRoute id={props.params.id} store={store} props={props}/>
      );
    }}/>
    <Match exactly pattern='/' render={() => (
    <Redirect to='/activities'/>
    )}/>
    <Miss component={NotFound}/>
  </CoreLayout>
);

export default createMatches
