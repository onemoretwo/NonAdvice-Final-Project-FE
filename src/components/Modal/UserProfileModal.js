import React from "react";
import { Modal, Button, Image, Tabs, Tab, Col, Container, Row, Badge } from "react-bootstrap";

import { AiOutlineUser, AiOutlineMobile, AiOutlineMail, AiOutlineIdcard } from 'react-icons/ai';
import { BiMap } from 'react-icons/bi';

//this modal is for admin
export default function UserProfileModal(props){

    var user = props.user;

    return (
        <Modal
      show={props.show === props.user.id}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter" className="w-100">
                <p className="text-center w-100">Profile</p>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="text-center">
                <Image style={{ height: "250px", width:"250px", objectFit: "cover" }} src={`http://localhost:9000/resources/images/userImage/${user.img}`} roundedCircle thumbnail></Image>
            </div>
            <Tabs defaultActiveKey="Infomation" className="mb-3 mt-4">
                <Tab eventKey="Infomation" title="Infomation">
                    <Container className="mt-4">
                        {user.name === null &&
                            <Row className="mb-4"><Col md={4} className="header"><Badge bg="danger" style={{ fontSize:"15px" }}>User have not completed filling profile</Badge></Col></Row>
                        }
                        <Row className="mb-4"><Col md={4} className="header"><AiOutlineMail size={25}/> &nbsp;&nbsp;&nbsp;Email</Col><Col>{user.email}</Col></Row>
                        {user.name !== null &&
                            <>
                            <Row className="mb-4"><Col md={4} className="header"><AiOutlineUser size={25}/> &nbsp;&nbsp;&nbsp;Name</Col><Col>{<span>{user.name}&nbsp;&nbsp;&nbsp;&nbsp;{user.surname}</span>}</Col></Row>
                            <Row className="mb-4"><Col md={4} className="header"><AiOutlineIdcard size={25}/> &nbsp;&nbsp;&nbsp;Identification Number</Col><Col>{user.identification_number}</Col></Row>
                            <Row className="mb-4"><Col md={4} className="header"><AiOutlineMobile size={25}/> &nbsp;&nbsp;&nbsp;Telephone Number</Col><Col>{user.telephone_number}</Col></Row>
                            <Row className="mb-4"><Col md={4} className="header"><BiMap size={25}/> &nbsp;&nbsp;&nbsp;Address</Col><Col>{user.address}</Col></Row>
                            </>
                            
                        }
                    </Container>
                </Tab>
            </Tabs>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
    </Modal>
    )
}