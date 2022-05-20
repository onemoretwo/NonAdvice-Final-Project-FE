import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import socketIo from "socket.io-client";

import map from '../../assets/img/mapDemo.jpg';

import { Col, Container, Row, Image, Button, ButtonGroup, Badge, Modal } from 'react-bootstrap';
import Swal from "sweetalert2";

import { BiTime,BiMobileVibration } from 'react-icons/bi';
import { AiTwotoneHome,AiOutlineCheckCircle,AiFillCheckCircle } from 'react-icons/ai';
import { FiPhoneCall,FiMapPin } from 'react-icons/fi';
import axios from 'axios';

export default function Store(){

    const [mapShow, setMapShow] = useState(false);
    const [store, setStore] = useState({});

    let { id } = useParams();
    var hostname = "http://192.168.0.227:9000";

    var socket = socketIo("http://192.168.0.227:9000");

    socket.on('can join', function(room) {
        console.log("joining");
        window.location.href = `/user/nearbystore/${room}/call`;
    })

    socket.on("full", function(room) {
        Swal.fire({
            icon: 'warning',
            title: 'The pharmacist is in a call.',
          });
    });

    socket.on('log', function(array) {
        console.log.apply(console, array);
    });

    useEffect(() => {
        axios.get(`${hostname}/api/store/${id}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            console.log(res);
            setStore(res.data);
        });
    },[]);

    function handleCall(){
        axios.get(`${hostname}/api/users/is/Allow`, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            if(res.data.isAllow){
                Swal.fire({
                    title: 'Are you sure to call?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Call'
                  }).then((result) => {
                      // make a call hear
                      if(result.isConfirmed){

                        //socket calling
                        socket.emit('userCheck', store.user_id);
                      }
                  })
            }else{
                Swal.fire({
                    icon: 'warning',
                    title: 'You must complete your profile',
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    text: 'Please complete your profile before making a call',
                  }).then((result) => {
                      if(result.isConfirmed){
                        window.location.href ="/user/myprofile";
                      }
                  })
            }
        })
    }

    return (
        <Container fluid>
            <style>
            {`
                @import url('https://fonts.googleapis.com/css2?family=Mitr&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');

                .detail-font{
                    font-family: 'Mitr', sans-serif;
                }

                .header{
                    font-family: 'Alfa Slab One', cursive;
                }

                .each-detail{
                    margin-bottom: 1.5rem;
                }
            `}
            </style>
            <h1 className="my-4 mx-2 text-center">{store.name}</h1>
            <hr className="mt-3 mb-4"></hr>

            <Container className="w-75">
                
                <Row className="mt-4">
                    <Col xs={5}>
                        <Container fluid style={{  }}>
                            {store.store_img !== undefined &&
                                <Image src={`http://192.168.0.227:9000/resources/images/storeImage/Main/${store.store_img}`} thumbnail />
                            }
                            <div className="mt-5 d-flex justify-content-center">
                            <ButtonGroup>
                                <Button variant="success" style={{ width: "130px" }}><AiOutlineCheckCircle size={30}/> Active</Button>
                                <Button variant="warning" className="font-weight-bold" style={{ width: "130px" }} onClick={handleCall} ><FiPhoneCall size={25}/>  Call</Button>
                            </ButtonGroup>
                            </div>
                            <div className="mt-5 detail-font">
                                <div className="each-detail" style={{ fontSize: "18px" }}>
                                    <p>License : <Badge pill bg="success"><AiFillCheckCircle size={20}/> Approve</Badge>{' '}</p>
                                </div>
                                <div className="each-detail">
                                    <BiTime size={30}/><p className="d-inline mx-3 font-weight-bold">Open : 12AM - 9PM</p>
                                </div>
                                <div className="each-detail">
                                    <AiTwotoneHome size={30}/>
                                    <p className="mx-3 d-inline">
                                    Address : {store.address}
                                    </p>
                                </div>
                                <div className="each-detail">
                                    <BiMobileVibration size={30}/>
                                    <p className="mx-3 d-inline">
                                        Tel : {store.tel}
                                    </p>
                                </div>
                            </div>

                            <Button variant="dark" style={{ marginLeft: "auto", marginRight: "auto", display: "block" }} onClick={() => setMapShow(true)}>
                                <FiMapPin size={30}/> Map
                            </Button>
                        </Container>
                    </Col>
                    <Col>
                        <Container fluid>
                            <div>
                                <div className="text-center py-3 header">
                                    PHARMACIST
                                </div>
                                {store.pharmacist_img !== undefined &&
                                <Image src={`http://192.168.0.227:9000/resources/images/storeImage/Pharmacist/${store.pharmacist_img}`} thumbnail className="w-50 mt-3" style={{ display: "block", marginRight: "auto", marginLeft: "auto" }} />
                                }
                            </div>
                            <div className="d-flex justify-content-center">
                                <div className="w-75 mt-5 detail-font">
                                    <h5>{store.pharmacist_name}</h5>
                                    <div className="mt-3" style={{ fontSize: "18px" }}>
                                        <p>Age : 34</p>
                                        <p>License : <Badge pill bg="success"><AiFillCheckCircle size={20}/> Approve</Badge>{' '}</p>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
            <Modal
                size="lg"
                show={mapShow}
                onHide={() => setMapShow(false)}
                centered
            >
                <Modal.Header closeButton>
                <Modal.Title>
                    Location
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Image src={map} style={{ maxWidth: "100%", maxHeight: "100%" }}/>
                </Modal.Body>
            </Modal>
        </Container>
    )
}