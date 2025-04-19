import React from 'react';
import { Route } from 'react-router-dom';

export default (
  <Route>
    <Route path="/" />
    <Route exact path="/quotes/:id" />
    <Route exact path="/quotes/tag/:tagIdParam" />
    <Route exact path="/quotes/author/:authorIdParam" />
    <Route path="/blog" />
    <Route exact path="/blog/:slugParam" />
    <Route exact path="/faq" />
    <Route exact path="/login" />
    <Route exact path="/signup" />
  </Route>
);
