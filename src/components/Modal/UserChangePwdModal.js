import axios from "axios";
import React, { useState } from "react";

import { Modal, Button, Form, Col, Row, Container } from "react-bootstrap";
import { toast } from 'react-toastify';
import { AiOutlineEdit } from "react-icons/ai";
import Swal from "sweetalert2";
export default function UserChangePwdModal(props){

    const hostname = "http://localhost:9000";

    const [allowChange, setAllowChange] = useState(false);

    const initialChangePasswordForm = {
        password: "",
        newPassword: "",
        confirmPassword: "",
    };

    const [formData, updateFormData] = useState(initialChangePasswordForm);

    function handleOnChange(e){
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
    }

    function handleOnExit(){
        setAllowChange(false);
        updateFormData(initialChangePasswordForm)
    }

    function handleSubmitCurrentPassword(){
        const data = {
            password: formData.password,
        }
        axios.post(`${hostname}/api/users/changePassword`, data,{
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            console.log(res.data);
            if(res.data.passwordMatch){
                setAllowChange(true);
            }else{
                toast.configure();
                toast.error('Invalid password !', {
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

    function handleSubmitChangePassword(){
        if (formData.newPassword !== formData.confirmPassword){
            toast.configure();
                toast.error('Password does not match !', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
        }else{
            const data = {
                password: formData.newPassword,
            }
            axios.put(`${hostname}/api/users/changePassword`,data,{
                headers: {
                    "x-access-token": localStorage.getItem("token"), 
                }
            }).then((res) => {
                toast.configure();
                if (res.data.updateSuccess){
                    localStorage.clear();
                    Swal.fire({
                        icon: 'success',
                        title: 'Change password Successful',
                        text: 'Please login again',
                        showConfirmButton: false,
                        timer: 2500,
                      }).then(() => {
                        window.location.href = "/auth/login";
                      })
                }else{
                    toast.error('Error on changing password, please try again', {
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
    }

    return (
        <div>
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onExit={handleOnExit}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="w-100">
                    <p className="text-center w-100"><AiOutlineEdit /> Changes password</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!allowChange ?
                    <Container className="w-75">
                        <Form>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="4">
                                Enter your password
                                </Form.Label>
                                <Col sm="8">
                                <Form.Control onChange={handleOnChange} name="password" type="password" placeholder="Password" value={formData.password} required/>
                                </Col>
                            </Form.Group>
                            <div className="d-flex justify-content-center">
                                <Button onClick={handleSubmitCurrentPassword}>submit</Button>
                            </div>
                        </Form>
                    </Container>
                    :
                    <Container className="w-75">
                        <Form>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="4">
                                New password
                                </Form.Label>
                                <Col sm="8">
                                <Form.Control onChange={handleOnChange} name="newPassword" type="password" placeholder="Password" value={formData.newPassword} required/>
                                <Form.Text id="passwordHelpBlock" muted>
                                    Your password must be at least 8 characters long.
                                </Form.Text>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="4">
                                Confirm password
                                </Form.Label>
                                <Col sm="8">
                                <Form.Control onChange={handleOnChange} name="confirmPassword" type="password" placeholder="Password" value={formData.confirmPassword} required/>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Container>
                    }
                    
                </Modal.Body>
                <Modal.Footer>
                    {allowChange &&
                        <Button variant="primary" onClick={handleSubmitChangePassword}>
                            Save Changes
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </div>
    )
}