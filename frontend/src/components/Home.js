import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { Container, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSync, faKey, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const [site, setSite] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [message, setMessage] = useState('');
  const history = useHistory();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/passwords', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setPasswords(response.data);
      })
      .catch(error => {
        console.error('There was an error retrieving the passwords!', error);
      });
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token) {
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
          // Refresh password list
          axios.get('http://localhost:5000/passwords', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            setPasswords(response.data);
          });
        }
      })
      .catch(error => {
        console.error('There was an error adding the password!', error);
      });
    } else {
      setMessage('Please log in to add a password.');
    }
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

  const handleDelete = (id) => {
    if (token) {
      axios.delete(`http://localhost:5000/passwords/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.data.message === 'Password deleted successfully') {
          setMessage('Password deleted successfully.');
          // Refresh password list after deletion
          setPasswords(passwords.filter(password => password.id !== id));
        }
      })
      .catch(error => {
        console.error('There was an error deleting the password!', error);
      });
    }
  };

  const handleLogout = () => {
    axios.post('http://localhost:5000/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setMessage('Please log in to add passwords.');
      history.push('/login');
    })
    .catch(error => {
      console.error('There was an error logging out!', error);
    });
  };

  return (
    <Container>
      {username && (
        <>
          <h1>Welcome, {username}</h1>
          <Button color="danger" onClick={handleLogout}>Logout</Button>
        </>
      )}
      <h2 className="mt-5">Add Password</h2>
      {message && <Alert color="success" className="mt-3">{message}</Alert>}
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
          <div className="input-group">
            <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div className="input-group-append">
              <Button type="button" color="success" onClick={generatePassword}>
                <FontAwesomeIcon icon={faKey} /> Generate Password
              </Button>
            </div>
          </div>
        </FormGroup>
        <Button type="submit" color="primary">
          <FontAwesomeIcon icon={faPlus} /> Add Password
        </Button>
      </Form>
      <h2 className="mt-5">Passwords</h2>
      <ul className="list-group">
        {passwords.map(password => (
          <li key={password.id} className="list-group-item d-flex justify-content-between align-items-center">
            {password.site}
            <div>
              <Link to={`/view-password/${password.id}`} className="btn btn-secondary btn-sm">
                <FontAwesomeIcon icon={faEye} /> View Password
              </Link>
              <Button 
                color="danger" 
                size="sm" 
                className="ml-2" 
                onClick={() => handleDelete(password.id)}
              >
                <FontAwesomeIcon icon={faTrash} /> Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}

export default Home;
