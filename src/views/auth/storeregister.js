import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Form, Card, Button, Container } from 'react-bootstrap'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


export default function StoreRegisterForm(){

    const initialForm = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        tel: "",
    };

    const [form, updateForm] = useState(initialForm);

    function handleSubmitBtn(e){
        e.preventDefault();
        const password = form.password;
        const confirmPassword = form.confirmPassword;
        toast.configure();
        if(password !== confirmPassword){
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
        axios.post("http://localhost:9000/api/auth/storeRegister", form).then((res) => {
            if(res.data.isUniq){
                Swal.fire(
                    'Register Success !',
                    '',
                    'success'
                ).then(() => {
                    window.location.href = '/auth/login';
                })
            }else if(!res.data.isUnique){
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
        })
    }

    function handleOnChange(e){
        updateForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="container d-flex justify-content-center">
                <Card className="p-4" style={{ backgroundColor: "rgb(226, 232, 240)", width: "50%" }}>
                    <Card.Header className="text-center"><b>Store Registeration</b></Card.Header>
                    <Card.Body>
                        <form onSubmit={handleSubmitBtn}>
                            <Form.Group className="mb-3" controlId="storeName" >
                                <Form.Label>Store's Name</Form.Label>
                                <Form.Control required onChange={handleOnChange} name="name" type="text" value={form.name}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="Email" >
                                <Form.Label>Email</Form.Label>
                                <Form.Control required onChange={handleOnChange} name="email" type="email" value={form.email}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="Password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control required onChange={handleOnChange} name="password" type="password" value={form.password}/>
                                <Form.Text className="text-muted" >
                                    Password must be at least 7 characters
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="ConfirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control required onChange={handleOnChange} name="confirmPassword" type="password" value={form.confirmPassword} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="Tel" >
                                <Form.Label>Telephone Number</Form.Label>
                                <Form.Control required onChange={handleOnChange} name="tel" type="text" value={form.tel}/>
                            </Form.Group>
                            <Container>
                                <div className="d-flex justify-content-center">
                                    <Button variant="dark" type="submit">
                                        REGISTER
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
    )
}