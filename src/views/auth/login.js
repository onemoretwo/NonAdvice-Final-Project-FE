import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';

import { Form, Card, Button, Container } from 'react-bootstrap'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function LoginForm() {

    const hostname = "http://192.168.0.227:9000";

    const initialLoginForm = {
        email: "",
        password: "",
        remember: false,
    }

    const [loginFormData, updateLoginFormData] = useState(initialLoginForm);

    function handleOnChange(e){
        updateLoginFormData({
            ...loginFormData,
            [e.target.name]: e.target.value.trim()
        })
    }

    function handleLoginBtn(e){
        e.preventDefault();
        axios.post(`${hostname}/api/auth/login`, loginFormData).then((res) => {
            if(res.data.auth){
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userData", JSON.stringify(res.data.userData));
                //JSON.parse(localStorage.getItem("userData"));

                var timerInterval;
                Swal.fire({
                    title: 'Now loading',
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: () => {
                      Swal.showLoading()
                    },
                    willClose: () => {
                      clearInterval(timerInterval)
                    }
                  }).then(() => {
                    window.location.href = "/";
                    // if(role == "regular"){
                    //     window.location.href = "/user";
                    // }
                  })

            }else{
                toast.configure();
                if(res.data.message === "No user exists"){
                    toast.error('Invalid Email address!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                    return;
                }else if(res.data.message === "Wrong username/password combination"){
                    toast.error('Email and password doesn\'t match!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                    return;
                }else if(res.data.message === "You have been banned"){
                    Swal.fire({
                        icon: 'error',
                        title: 'Your account has been suspended',
                        text: 'Please contact our staff for more detail',
                        footer: '<a href="">need to contact?</a>'
                      })
                }
            }
        })
    }

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center">
            
            <Card className="p-4" style={{ backgroundColor: "rgb(226, 232, 240)", width: "50%" }}>
                <Card.Header className="text-center"><b>Sign In</b></Card.Header>
                <Card.Body>
                    <form onSubmit={handleLoginBtn}>
                        <Form.Group className="mb-3" controlId="Email" >
                            <Form.Label>Email address</Form.Label>
                            <Form.Control required value={loginFormData.email} onChange={handleOnChange} name="email" type="email" placeholder="" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="Password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control required value={loginFormData.password} onChange={handleOnChange} name="password" type="password" placeholder="" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="Checkbox">
                            <Form.Check defaultChecked={loginFormData.remember} onChange={handleOnChange} name="remember" type="checkbox" label="Remember Me" />
                        </Form.Group>
                        <Container>
                            <div className="d-flex justify-content-center">
                                <Button variant="dark" type="submit">
                                    Login
                                </Button>
                            </div>
                        </Container>
                    </form>
                    <hr style={{ margin: "2rem" }}></hr>
                    <div className="text-center">
                        <p className="d-inline" style={{ marginRight: "0.7em" }}>Not yet a user?</p>       <Link className="text-decoration-none" to="/auth/register">Sign up here</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="pt-3 d-flex justify-content-between" style={{ width: "50%" }}>
                <Link to="/auth/storeregister" className="text-light text-decoration-none">Register store</Link>
            </div>
        </div>
    );
}

export default LoginForm;