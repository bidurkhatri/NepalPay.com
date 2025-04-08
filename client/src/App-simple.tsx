import React from 'react';
import { Route, Switch } from 'wouter';
import TestPage from './pages/test-page';

function App() {
  return (
    <Switch>
      <Route path="/" component={TestPage} />
      <Route>
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl">Page not found</h1>
        </div>
      </Route>
    </Switch>
  );
}

export default App;