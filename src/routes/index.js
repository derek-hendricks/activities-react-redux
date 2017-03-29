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
    <Match exactly pattern='/activity/:id' render={(props) => (
      <ActivityRoute id={props.params.id}/>
    )}/>
    <Match pattern='/' render={() => (
      <Redirect to='/activities'/>
    )}/>
    <Match pattern='/activities' render={ActivitiesRoute}/>
    <Match exactly pattern='/about' render={AboutRoute}/>
    <Miss component={NotFound}/>
  </CoreLayout>
);

export default createMatches
