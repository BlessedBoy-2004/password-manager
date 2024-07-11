import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ViewPassword() {
  const { id } = useParams();
  const [passwordEntry, setPasswordEntry] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:5000/passwords/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setPasswordEntry(response.data);
      })
      .catch(error => {
        console.error('There was an error retrieving the password!', error);
      });
  }, [id]);

  return (
    <div className="container">
      <h1>View Password</h1>
      <p>Site: {passwordEntry.site}</p>
      <p>Email: {passwordEntry.email}</p>
      <p>Password: {passwordEntry.password}</p>
    </div>
  );
}

export default ViewPassword;
