import React from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, FormGroup, FormLabel, Row } from "react-bootstrap";

const Register = () => {
    const registerAPI = 'http://localhost:5000/api/register';
    const navigate = useNavigate();
    
    const handleSubmit = (event) => {
    event.preventDefault();
    const formElement = document.querySelector('#registerForm');
    const formData = new FormData(formElement);
    const formDataJSON = Object.fromEntries(formData);
    const btnPointer = document.querySelector('#register-btn');
    btnPointer.innerHTML = 'Please wait..';
    btnPointer.setAttribute('disabled', true);
    axios.post(registerAPI, formDataJSON).then((response) => {
        btnPointer.innerHTML = 'Register';
        btnPointer.removeAttribute('disabled');
        const data = response.data;
        const token = data.token;
        if (!token) {
            alert('Unable to register. Please try after some time.');
            return;
        }
        localStorage.clear();
        localStorage.setItem('user-token', token);
        setTimeout(() => {
            navigate('/auth/login');
        }, 500);
    }).catch((error) => {
        btnPointer.innerHTML = 'Register';
        btnPointer.removeAttribute('disabled');
        alert("Oops! Some error occured.");
    });
}

  return (
      <React.Fragment>
      <Container className="my-5">
          <h2 className="fw-normal mb-5">Register To React Auth Demo</h2>
          <Row>
              <Col md={{span: 6}}>
                  <Form id="registerForm" onSubmit={handleSubmit}>
                      <FormGroup className="mb-3">
                          <FormLabel htmlFor={'login-username'}>Username</FormLabel>
                          <input type={'text'} className="form-control" id={'login-username'} name="username" required />
                      </FormGroup>
                      <FormGroup className="mb-3">
                          <FormLabel htmlFor={'login-email'}>Email</FormLabel>
                          <input type={'text'} className="form-control" id={'login-email'} name="email" required />
                      </FormGroup>
                      <FormGroup className="mb-3">
                          <FormLabel htmlFor={'login-password'}>Password</FormLabel>
                          <input type={'password'} className="form-control" id={'login-password'} name="password" required />
                      </FormGroup>
                      <Button type="submit" className="btn-success mt-2" id="register-btn">Register</Button>
                  </Form>
              </Col>
          </Row>
      </Container>
  </React.Fragment>
  );
};

export default Register;
