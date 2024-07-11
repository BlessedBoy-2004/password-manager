import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ViewPassword from './components/ViewPassword';
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/view-password/:id" component={ViewPassword} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
