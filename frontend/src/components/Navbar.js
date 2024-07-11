import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const history = useHistory();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    axios.post('http://localhost:5000/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      history.push('/login');
    })
    .catch(error => {
      console.error('There was an error logging out!', error);
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Password Manager</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            {token ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Welcome, {username}</span>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
