import React, { useState } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { Form, Card, Button, Container } from 'react-bootstrap'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

import { AiFillCheckCircle } from 'react-icons/ai';

import TermAndCondition from '../../components/TermAndCondition';

function RegisterForm() {

    const initialRegisterForm = {
        email: "",
        password: "",
        confirmPassword: "",
        tel: "",
    };

    const [RegisterFormData, updateRegisterFormData] = useState(initialRegisterForm);

    function handleSubmitBtn(e){
        e.preventDefault();
        const passwd = RegisterFormData.password;
        const confirm = RegisterFormData.confirmPassword;
        if(passwd !== confirm){
            toast.configure();
            toast.warn('Password doesn\'t match!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            return;
        }
        axios.post("http://localhost:9000/api/auth/register", RegisterFormData).then(res => {
            console.log(res.status);
            if(res.data.isUniq){
                Swal.fire(
                    'Register Success !',
                    '',
                    'success'
                ).then(() => {
                    window.location.href = '/auth/login';
                })
            }else if(!res.data.isUnique){
                toast.configure();
                toast.warn('This email already registered.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            }
        });
    }

    function handleOnChange(e){
        updateRegisterFormData({
            ...RegisterFormData,
            [e.target.name]: e.target.value.trim()
        })
    }

    return (
        <div className="container d-flex justify-content-center">
            <Card className="p-4" style={{ backgroundColor: "rgb(226, 232, 240)", width: "50%" }}>
                <Card.Header className="text-center"><b>Registeration</b></Card.Header>
                <Card.Body>
                    <form onSubmit={handleSubmitBtn}>
                        <Form.Group className="mb-3" controlId="Email" >
                            <Form.Label>Email</Form.Label>
                            <Form.Control required onChange={handleOnChange} name="email" type="email" value={RegisterFormData.email}/>
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="Password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control required onChange={handleOnChange} name="password" type="password" placeholder="" value={RegisterFormData.password}/>
                            <Form.Text className="text-muted" >
                                Password must be at least 7 characters
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control required onChange={handleOnChange} name="confirmPassword" type="password" placeholder="" value={RegisterFormData.confirmPassword}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="Tel" >
                            <Form.Label>Telephone Number</Form.Label>
                            <Form.Control required onChange={handleOnChange} name="tel" type="telephoneNumber" placeholder="" value={RegisterFormData.tel}/>
                        </Form.Group>
                        <Form.Group className="mb-3 d-flex">
                            <Form.Check
                            required
                            label="I agree to your "
                            feedback="You must agree before submitting."
                            ></Form.Check>
                            <TermAndCondition className="d-inline" />
                        </Form.Group>
                        <Container>
                            <div className="d-flex justify-content-center">
                                <Button variant="dark" type="submit">
                                    <AiFillCheckCircle />
                                    <div className="d-inline" style={{ marginLeft: "0.5rem" }}>Let's get started</div>
                                </Button>
                            </div>
                        </Container>
                    </form>
                    <hr style={{ margin: "2rem" }}></hr>
                    <div className="text-center">
                        <p className="d-inline" style={{ marginRight: "0.7em" }}>Already have an account?</p>       <Link className="text-decoration-none" to="/auth/login">Log in here</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default RegisterForm;