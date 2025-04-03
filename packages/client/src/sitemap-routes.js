import React from 'react';
import { Route } from 'react-router-dom';

export default (
  <Route>
    <Route path="/" />
    <Route path="/quotes" />
    <Route exact path="/quotes/:id" />
    <Route exact path="/quotes/tag/:tagIdParam" />
    <Route exact path="/faq" />
    <Route exact path="/login" />
    <Route exact path="/signup" />
    <Route exact path="/dashboard" />
  </Route>
);
