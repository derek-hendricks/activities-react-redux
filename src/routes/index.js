import React from "react"
import Match from "react-router/Match";
import Redirect from "react-router/Redirect";
import Miss from "react-router/Miss";

import CoreLayout from "../layouts/CoreLayout"
import CategoriesRoute from "./Categories"
import AboutRoute from "./Home"
import ActivityRoute from "./Activity"
import NotFound from "../components/NotFound"

export const CreateMatches = (store) => (
  <CoreLayout>
    <Match exactly pattern='/activities' render={CategoriesRoute}/>
    <Match pattern='/about' render={AboutRoute}/>
    <Match pattern='/activity/:id' render={(props) => {
      return <ActivityRoute id={props.params.id} store={store} props={props}/>;
    }}/>
    <Match exactly pattern='/' render={() => (
      <Redirect to='/activities'/>
    )}/>
    <Miss component={NotFound}/>
  </CoreLayout>
);

export default CreateMatches
