import React, { useEffect, useState } from "react";
import { Modal, Button, Container, Row, Col, Image, Tabs, Tab, Badge } from "react-bootstrap";

import { AiOutlineUser, AiOutlineMobile, AiOutlineMail } from 'react-icons/ai';
import { BiTimeFive,BiMap } from 'react-icons/bi';
import { AiOutlineCheckSquare } from "react-icons/ai";

export default function StoreProfileModal(props){

    var store = props.store;

    const [key, setKey] = useState("Store");
    const [picture, setPicture] = useState(`http://localhost:9000/resources/images/storeImage/Main/${store.store_img}`);

    useEffect(() => {
        console.log(store.license_img);
        if(key === "Store"){
            setPicture(`http://localhost:9000/resources/images/storeImage/Main/${store.store_img}`);
        }else if (key === "Pharmacist"){
            setPicture(`http://localhost:9000/resources/images/storeImage/Pharmacist/${store.pharmacist_img}`);
        }
    }, [key]);

    function openTime(openTime, closeTime){
        var openHour = openTime.split(":")[0];
        var openMin = openTime.split(":")[1];
        var closeHour = closeTime.split(":")[0];
        var closeMin = closeTime.split(":")[1];
        return `${openHour}:${openMin} - ${closeHour}:${closeMin}`;
    }

    return (
        <div>
        <style>
            {`
            .header{
                font-size: 15px;
                font-weight: bold;
            }
            .cover {
                padding: 0;
                background: none;
                border: none;
            }
            .scrollable{
                overflow-y: scroll;
                max-height: 700px;
            }
            .license-img{
                max-width: 400px;
            }
            `}
        </style>
        <Modal
      show={props.show === props.store.id}
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
        <Modal.Body className="scrollable">
            {(store.license_img !== null && store.status.data[0] === 0) &&
                    <Container className="mt-3 mb-5 py-4 border-top border-bottom text-center">
                    <Badge bg="warning" text="dark" style={{ fontSize:"15px", padding:"15px 10px", cursor:"pointer" }} onClick={() => {
                        console.log("go");
                    }}>
                        Waiting for approve
                    </Badge>{' '}
                    </Container>
            }
                    { 
                    <div className="text-center">
                        <Image style={{ maxHeight: "380px", objectFit: "cover" }} src={picture} thumbnail></Image>
                    </div>
                    }
                    <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3 mt-3"
                    >
                        <Tab eventKey="Store" title="Store">
                            <Container className="mt-4">
                                {store.address === null &&
                                    <Row className="mb-4"><Col md={4} className="header"><Badge bg="danger" style={{ fontSize:"15px" }}>User have not completed filling profile</Badge></Col></Row>
                                }
                                <Row className="mb-4"><Col md={4} className="header"><AiOutlineMail size={25}/> &nbsp;&nbsp;&nbsp;Email</Col><Col>{store.email}</Col></Row>
                                <Row className="mb-4"><Col md={4} className="header"><AiOutlineUser size={25}/> &nbsp;&nbsp;&nbsp;Name</Col><Col>{store.name}</Col></Row>
                                {store.address !== null &&
                                <>
                                <Row className="mb-4"><Col md={4} className="header"><AiOutlineMobile size={25}/> &nbsp;&nbsp;&nbsp;TelephoneNumber</Col><Col>{store.tel}</Col></Row>
                                <Row className="mb-4"><Col md={4} className="header"><BiTimeFive size={25}/> &nbsp;&nbsp;&nbsp;Open time</Col><Col>{openTime(store.open_time, store.close_time)}</Col></Row>
                                <Row className="mb-4"><Col md={4} className="header"><BiMap size={25}/> &nbsp;&nbsp;&nbsp;Address</Col><Col>{store.address}</Col></Row>
                                <Row className="mb-4">
                                    <Col md={4} className="header">
                                        <AiOutlineCheckSquare size={25}/> &nbsp;&nbsp;&nbsp;License
                                    </Col>
                                    <Col>

                                        {store.license_img !== null &&
                                            <span>
                                            <div>
                                                <Image className="mt-4 license-img text-center" src={`http://localhost:9000/resources/images/storeImage/StoreLicense/${store.license_img}`} thumbnail></Image>
                                            </div>
                                            </span>
                                        }
                                    </Col>
                                </Row>
                                </>
                                }
                            </Container>
                        </Tab>
                        <Tab eventKey="Pharmacist" title="Pharmacist" disabled={store.address === null}>
                            <Container className="mt-4">
                                <Row className="mb-4"><Col md={4} className="header"><AiOutlineUser size={25}/> &nbsp;&nbsp;&nbsp;Name</Col><Col>{store.pharmacist_name}</Col></Row>
                                <Row className="mb-4">
                                    <Col md={4} className="header"><AiOutlineCheckSquare size={25}/> &nbsp;&nbsp;&nbsp;Professional License</Col>
                                    <Col>
                                        {store.professional_license_img !== null &&
                                            <span>
                                            <div>
                                                <Image className="mt-4 license-img text-center" src={`http://localhost:9000/resources/images/storeImage/ProfessionalLicense/${store.professional_license_img}`} thumbnail></Image>
                                            </div>
                                            </span>
                                        }
                                    </Col>
                                </Row>
                            </Container>
                        </Tab>
                    </Tabs>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
    </Modal>
    </div>
    )
}