import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { Modal, Button, Form, Container, Image } from "react-bootstrap";

import { AiTwotoneCamera } from "react-icons/ai"; 

export default function UserChangeImageModal(props){

    const hostname = "http://localhost:9000";
    var imageName = props.img;

    const [image, setImage] = useState();
    const [preview, setPreview] = useState();

    const fileInputRef = React.useRef();

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(image);
        }else{
            setPreview(null);
        }
    },[image])

    function handleOnSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image, "user");

        axios.post(`${hostname}/api/users/updateImage`, formData, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            if (res.data.updateSuccess){
                Swal.fire({
                    icon: 'success',
                    title: 'Change Image Success',
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(() => {
                      props.onHide();
                  })
            }
        });
    }

    function handleExit(){
        setImage(null);
    }

    function handleOnChange(e){
        const file = e.target.files[0];
        console.log(file);
        if (file){
            setImage(file);
        }else{
            setImage(null);
        }
    }

    return (
        <div>
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onExited={handleExit}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="w-100">
                    <p className="text-center w-100"><AiTwotoneCamera size={30} /> Update Profile Picture</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <div className="text-center">
                                <Image style={{ height: "200px", width: "250px", objectFit: "cover" }} src={preview ? preview : `http://localhost:9000/resources/images/userImage/${imageName}`} roundedCircle thumbnail></Image>
                        </div>                    
                        <Container className="w-75">
                            <Form>
                                <Form.Group controlId="formFile" className="my-5">
                                    <Form.Control 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleOnChange}
                                    accept="image/*"
                                    />
                                </Form.Group>
                            </Form>
                        </Container>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                        <Button variant="primary" onClick={handleOnSubmit}>
                            Save Changes
                        </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}