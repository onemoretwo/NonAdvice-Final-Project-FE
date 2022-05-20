import React, { useEffect, useState } from "react";

import { Modal, Button, Container, Form, Row, Col, Image } from "react-bootstrap";
import TimeField from "react-simple-timefield";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";

import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default function StoreRegisterProfileModal(props){

    const hostname = "http://localhost:9000";

    const[sImage, setSImage] = useState();
    const[sPreview, setSPreview] = useState();
    const sRef = React.useRef();

    const[slImage, setSlImage] = useState();
    const[slPreview, setSlPreview] = useState();
    const slRef = React.useRef();

    const[pImage, setPImage] = useState();
    const[pPreview, setPPreview] = useState();
    const pRef = React.useRef();

    const[plImage, setPlImage] = useState();
    const[plPreview, setPlPreview] = useState();
    const plRef = React.useRef();

    const [formData, updateFormData] = useState({
        email: props.email,
        name: props.name,
        address: "",
        startTime: "00:00",
        endTime: "00:00",
        pharmacist_name: "",
        pharmacist_birthDate: new Date(),
    });

    useEffect(() => {
        if(sImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSPreview(reader.result);
            }
            reader.readAsDataURL(sImage);
        }else{
            setSPreview(null);
        }
    },[sImage]);

    useEffect(() => {
        if(slImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSlPreview(reader.result);
            }
            reader.readAsDataURL(slImage);
        }else{
            setSlPreview(null);
        }
    },[slImage]);

    useEffect(() => {
        if(pImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPPreview(reader.result);
            }
            reader.readAsDataURL(pImage);
        }else{
            setPPreview(null);
        }
    },[pImage]);

    useEffect(() => {
        if(plImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPlPreview(reader.result);
            }
            reader.readAsDataURL(plImage);
        }else{
            setPlPreview(null);
        }
    },[plImage]);

    function handleOnChange(e){
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    function handleOnChangeImage(e){
        const file = e.target.files[0];
        const type = e.target.name;
        switch(type){
            case("s"):
                if(file){
                    setSImage(file);
                }else{
                    setSImage(null);
                }
                break;
            case("sl"):
                if(file){
                    setSlImage(file);
                }else{
                    setSlImage(null);
                }
                break;
            case("p"):
                if(file){
                    setPImage(file);
                }else{
                    setPImage(null);
                }
                break;
            case("pl"):
                if(file){
                    setPlImage(file);
                }else{
                    setPlImage(null);
                }
                break;
            default:
                break;
        }
    }

    function handleRegisterBtn(e){
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "Please be sure information you provided is correct before registering",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Register now!'
          }).then((result) => {
              if(result.isConfirmed){
                  if(false){
                      //validate input
                  }else{
                      register();
                  }
              }
          })

    }

    function register(){
        var date = new Date(formData.pharmacist_birthDate);
        var dateFormated = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
        formData.pharmacist_birthDate = dateFormated;

        var userId = JSON.parse(localStorage.getItem("userData")).id;
        formData.pl = "pl" + userId + ".jpg";
        formData.sl = "sl" + userId + ".jpg";
        formData.si = "si" + userId + ".jpg";
        formData.pi = "pi" + userId + ".jpg";


        //upload image
        const imageFormData = new FormData();

        imageFormData.append('si', sImage, formData.si);
        imageFormData.append('pl', plImage, formData.pl);
        imageFormData.append('sl', slImage, formData.sl);
        imageFormData.append('pi', pImage, formData.pi);
        axios.post(`${hostname}/api/store/registerStore/uploadImage`, imageFormData,{
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        });

        //update info
        axios.put(`${hostname}/api/store/registerStore`, formData, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            console.log(res);
            if(res.data.success){
                Swal.fire({
                    icon: 'success',
                    title: 'Register successfully',
                    text: "Wait for admin to approve your application. Admin will email you once it is checked",
                    showConfirmButton: true,
                  }).then(() => {
                      window.location.reload();
                  });
            }
        })
    }

    return(
        <Modal
        {...props}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Registeration
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Container className="w-100">
                <Form>
                    <Container className="text-center pb-2 py-2 text-white" style={{ fontSize: "25px", background: "#282828"}}>
                        Pharmacy Section
                    </Container>
                    <Form.Group as={Row} className="mb-5 mt-4">
                        <Form.Label column sm={3}>
                        Pharmacy Image
                        </Form.Label>
                        <Col sm={5}>
                            <Image style={{ height: "200px", width: "250px" }} src={sPreview} thumbnail></Image>
                        </Col>
                        <Col sm={4}>
                            <Form.Control 
                            name="s"
                            type="file" 
                            ref={sRef} 
                            onChange={handleOnChangeImage}
                            accept="image/*"
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-5 mt-4">
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
                            <Form.Control name="name" type="text" required value={formData.name} readOnly/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-5">
                        <Form.Label column sm={3}>Address</Form.Label>
                        <Col sm={9}>
                            <Form.Control required name="address" type="text" as="textarea" rows={4} required value={formData.address} onChange={handleOnChange}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide your address.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-5">
                        <Form.Label column sm={3}>Start time</Form.Label>
                        <Col sm={9}>
                            <TimeField required name="startTime" value={formData.startTime} onChange={handleOnChange} style={{ width: "80px", textAlign: "center", marginRight: "15px" }}/>
                            to
                            <TimeField required name="endTime" value={formData.endTime} onChange={handleOnChange} style={{ width: "80px", textAlign: "center", marginLeft: "15px" }}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-5 mt-4">
                        <Form.Label column sm={3}>
                        Pharmacy License
                        </Form.Label>
                        <Col sm={5}>
                            <Image style={{ height: "200px", width: "250px" }} src={slPreview} thumbnail></Image>
                        </Col>
                        <Col sm={4}>
                            <Form.Control 
                            name="sl"
                            type="file" 
                            ref={slRef} 
                            onChange={handleOnChangeImage}
                            accept="image/*"
                            />
                        </Col>
                    </Form.Group>
                    <Container className="text-center pb-2 py-2 text-white" style={{ fontSize: "25px", background: "#282828"}}>
                        Pharmacist Section
                    </Container>
                    <Form.Group as={Row} className="mb-5 mt-4">
                        <Form.Label column sm={3}>
                        Pharmacist Image
                        </Form.Label>
                        <Col sm={5}>
                            <Image style={{ height: "200px", width: "250px", objectFit: "cover" }} src={pPreview} thumbnail></Image>
                        </Col>
                        <Col sm={4}>
                            <Form.Control 
                            name="p"
                            type="file" 
                            ref={pRef} 
                            onChange={handleOnChangeImage}
                            accept="image/*"
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-5">
                        <Form.Label column sm={3}>Pharmacist name</Form.Label>
                        <Col sm={9}>
                            <Form.Control name="pharmacist_name" type="text" required value={formData.pharmacist_name} onChange={handleOnChange}/>
                            <Form.Control.Feedback type="invalid">
                                Pharmacist name is required.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-5">
                        <Form.Label column sm={3}>Pharmacist name</Form.Label>
                        <Col sm={9}>
                            <DatePicker selected={formData.pharmacist_birthDate} onChange={(date) => {
                                updateFormData({
                                    ...formData,
                                    pharmacist_birthDate: date,
                                });
                            }} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-5 mt-4">
                        <Form.Label column sm={3}>
                        Pharmacist License
                        </Form.Label>
                        <Col sm={5}>
                            <Image style={{ height: "200px", width: "250px" }} src={plPreview} thumbnail></Image>
                        </Col>
                        <Col sm={4}>
                            <Form.Control 
                            name="pl"
                            type="file" 
                            ref={plRef} 
                            onChange={handleOnChangeImage}
                            accept="image/*"
                            />
                        </Col>
                    </Form.Group>

                </Form>
            </Container>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="primary" type="submit" onClick={(e) => handleRegisterBtn(e)}>
                Register
            </Button>
            <Button variant="secondary" onClick={props.onHide}>
                Close
            </Button>
        </Modal.Footer>
      </Modal>
    )
}