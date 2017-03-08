import React from 'react'
import CoreLayout from '../layouts/CoreLayout'
import ActivitiesRoute from './Activities'
import HomeRoute from './Home'
import ActivityRoute from'./Activity'
import NotFound from '../components/NotFound'
import Match from 'react-router/Match';
import Redirect from 'react-router/Redirect';
import Miss from 'react-router/Miss';

export const createMatches = (store) => (
  <CoreLayout>
    <Match exactly pattern='/activities' component={ActivitiesRoute}/>
    <Match pattern='/home' component={HomeRoute}/>
    <Match exactly pattern='/' render={() => (
      <Redirect
        to='/activities'
      />
    )}/>
    <Match exactly pattern='/activity/:id' render={(props) => {
      return (
        <ActivityRoute id={props.params.id}/>
      )
    }}/>
    <Miss component={NotFound}/>
  </CoreLayout>
);

export default createMatches
