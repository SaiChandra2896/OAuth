import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Register from './components/auth/Register';
import Login from './components/auth/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path='/' component={Register} />
        <Route exact path='/login' component={Login} />
      </div>
    </Router>
  );
}

export default App;
