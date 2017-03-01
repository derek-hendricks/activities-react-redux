import React from 'react'
import CoreLayout from '../layouts/CoreLayout'
import ActivitiesRoute from './Activities'
import HomeRoute from './Home'
import NotFound from '../components/NotFound'

import Match from 'react-router/Match';
import Redirect from 'react-router/Redirect';
import Miss from 'react-router/Miss';

export const createMatches = (store) => (
  <CoreLayout>
    <Match pattern='/home' component={HomeRoute}/>
    <Match pattern='/activities' component={ActivitiesRoute}/>
    <Match exactly pattern='/' render={() => (
      <Redirect
        to='/activities'
      />
    )}/>
    <Miss component={NotFound}/>
  </CoreLayout>
);

export default createMatches
