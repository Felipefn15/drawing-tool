import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Principal from '../pages/main'

export default (
  <Router>
    <Route exact path="/" component={Principal} />
  </Router>
)