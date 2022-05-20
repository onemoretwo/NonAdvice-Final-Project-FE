import axios from "axios";
import React, { useEffect, useState } from "react";

import { Modal, Button, Form, Col, Row, Container } from "react-bootstrap";
import { AiOutlineEdit } from "react-icons/ai";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";

export default function UserChangeInfoModal(props){

    const hostname = "http://localhost:9000";
    var user = props.user;

    const [formData, updateFormData] = useState({});

    useEffect(() => {
        updateFormData({
            email: user.email,
            name: user.name,
            surname: user.surname,
            telephone_number: user.telephone_number,
            identification_number: user.identification_number,
            address: user.address,
        });
    },[user])

    function handleOnExit(e){
        updateFormData({
            email: user.email,
            name: user.name,
            surname: user.surname,
            telephone_number: user.telephone_number,
            identification_number: user.identification_number,
            address: user.address,
        });
    }

    function handleOnChange(e){
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    function handleSubmitForm(event){
        event.preventDefault();
        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Save',
            denyButtonText: `Cancel`,
          }).then((result) => {
            if (result.isConfirmed){
                axios.put(`${hostname}/api/users/updateProfile`, formData, {
                    headers: {
                        "x-access-token": localStorage.getItem("token"), 
                    }
                }).then((res) => {
                    if(res.data.updateSuccess){
                        Swal.fire({
                            icon: 'success',
                            title: 'Change profile Successful',
                            showConfirmButton: false,
                            timer: 1500,
                          }).then(() => {
                              window.location.reload();
                          })
                    }else{
                        toast.configure();
                        toast.error('Error on updating profile, please try again', {
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
          })
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
                    <p className="text-center w-100"><AiOutlineEdit /> Edit profile</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className="w-100">
                        <Form>
                            <Form.Group as={Row} className="mb-5">
                                <Form.Label column sm={3}>
                                Email
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control name="email" type="email" value={formData.email} readOnly/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-5">
                                <Form.Label column sm={3}>Name</Form.Label>
                                <Col sm={9}>
                                    <Form.Control name="name" type="text" required value={formData.name !== null ? formData.name : ""} onChange={handleOnChange}/>
                                    <Form.Control.Feedback type="invalid">
                                        Name is required.
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-5">
                                <Form.Label column sm={3}>Surname</Form.Label>
                                <Col sm={9}>
                                    <Form.Control name="surname" type="text" required value={formData.surname !== null ? formData.surname : ""} onChange={handleOnChange}/>
                                    <Form.Control.Feedback type="invalid">
                                        Surname is required.
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-5">
                                <Form.Label column sm={3}>Telephone Number</Form.Label>
                                <Col sm={9}>
                                    <Form.Control required name="telephone_number" type="text" value={formData.telephone_number !== null ? formData.telephone_number : ""} onChange={handleOnChange}/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-5">
                                <Form.Label column sm={3}>Identification Number</Form.Label>
                                <Col sm={9}>
                                    <Form.Control name="identification_number" type="text" required value={formData.identification_number !== null ? formData.identification_number : ""} onChange={handleOnChange}/>
                                    <Form.Control.Feedback type="invalid">
                                        Identification number is required.
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-5">
                                <Form.Label column sm={3}>Address</Form.Label>
                                <Col sm={9}>
                                    <Form.Control name="address" type="text" as="textarea" rows={5} required value={formData.address !== null ? formData.address : ""} onChange={handleOnChange}/>
                                    <Form.Control.Feedback type="invalid">
                                        Please provide your address.
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                        </Form>
                    </Container>
                    
                </Modal.Body>
                <Modal.Footer>
                        <Button variant="primary" onClick={handleSubmitForm}>
                            Save Changes
                        </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
    
}