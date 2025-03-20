import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSync, faEye, faEyeSlash, faKey } from '@fortawesome/free-solid-svg-icons';
import { Button, Form, FormGroup, Label, Input, Container, InputGroup, InputGroupText, InputGroupAddon } from 'reactstrap';

function AddPassword() {
  const [site, setSite] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    const token = localStorage.getItem('token');
    axios.post('http://localhost:5000/passwords', { site, email, password }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.message === 'Password added successfully') {
          setMessage('Password added successfully.');
          setSite('');
          setEmail('');
          setPassword('');
        }
      })
      .catch(error => {
        console.error('There was an error adding the password!', error);
      });
  };

  const generatePassword = () => {
    axios.get('http://localhost:5000/generate-password')
      .then(response => {
        setPassword(response.data.password);
      })
      .catch(error => {
        console.error('There was an error generating the password!', error);
      });
  };

  return (
    <Container>
      <h1>Add Password</h1>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="site">Site</Label>
          <Input type="text" id="site" value={site} onChange={(e) => setSite(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <InputGroupAddon addonType="append">
              <Button color="secondary" onClick={() => setShowPassword(!showPassword)}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </Button>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
              <Button type="button" color="success" onClick={generatePassword}>
                <FontAwesomeIcon icon={faKey} /> Generate Password
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <Button type="submit" color="primary">
          <FontAwesomeIcon icon={faPlus} /> Add Password
        </Button>
      </Form>
      {message && <div className="alert alert-success mt-3">{message}</div>}
    </Container>
  );
}

export default AddPassword;
