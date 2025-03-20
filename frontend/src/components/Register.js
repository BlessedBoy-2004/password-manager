import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Container, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (/[^a-zA-Z0-9]/.test(username)) {
      setError('The username cannot contain special characters.');
      return;
    }
    const userData = { username, password };
    console.log("Sending user data for registration:", userData); // Debugging line
    axios.post('http://localhost:5000/register', userData)
      .then(response => {
        if (response.data.message === 'User registered successfully') {
          history.push('/login');
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400 && error.response.data.message === 'Username already exists. Please choose a different username.') {
          setError('This username already exists. Please try with a new username.');
        } else {
          setError('An error occurred. Please try again.');
        }
        console.error('There was an error registering!', error);
      });
  };

  return (
    <Container>
      <h1>Register</h1>
      {error && <Alert color="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <Label for="confirmPassword">Confirm Password</Label>
          <Input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </FormGroup>
        <Button type="submit" color="primary">Register</Button>
      </Form>
    </Container>
  );
}

export default Register;
