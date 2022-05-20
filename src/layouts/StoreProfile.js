import axios from "axios";
import React, { useEffect, useState } from "react";

import { Col, Container, Image, Row, Button } from "react-bootstrap";
import { AiTwotoneMail } from "react-icons/ai";

import MyNavbar from "../components/Navbar/Navbar";
import StoreRegisterProfileModal from "../components/Modal/StoreRegisterProfileModal";

// import { GiHealthNormal } from "react-icons/gi"

export default function StoreProfile(props){

    const hostname = "http://192.168.0.227:9000";

    const [store, setStore] = useState({});
    const [rsModalShow, setRsModalShow] = useState(false);

    useEffect(() => {
        var userId = props.userId;
        axios.get(`${hostname}/api/store/myInfo2/${userId}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            console.log(res);
            var mystore = res.data;
            setStore(mystore)
        });
    },[]);

    return(
        <div>
            <style>
                {`
                .store-header{
                    background: #282828;
                    color: white;
                }
                
                #storeInfo {
                    font-size: 20px;
                }

                #storeInfo p{
                    display: inline;
                }
                `}
            </style>
            <MyNavbar role={props.role}/>
            <div className="py-5 px-5 mt-2 text-center" style={{ fontSize:"50px" }}>
                My Pharmacy
                <div className="mt-5">
                <hr></hr>
                </div>
            </div>
            {(store.status !== undefined && store.status.data[0] === 0 && store.address === null) &&
                <div className="px-5 mt-2">
                    <div className="mb-4">
                        <div className="pb-4 m-auto text-center">
                            <AiTwotoneMail size={30}/><p className="d-inline mx-3" style={{ fontSize:"22px" }}>{store.email}</p>
                        </div>
                        <hr></hr>
                    </div>
                    <div className="d-grid gap-2 w-50 m-auto">
                        <Button variant="primary" onClick={() => setRsModalShow(true)} size="lg">
                            ลงทะเบียนร้านค้า
                        </Button>
                        <StoreRegisterProfileModal show={rsModalShow} onHide={() => setRsModalShow(false)} email={store.email} name={store.name}/>
                    </div>
                </div>
            }
            {(store.status !== undefined && store.status.data[0] === 0 && store.address !== null) &&
                <div className="px-5 mt-2">
                    <div className="mb-4">
                        <div className="pb-4 m-auto text-center">
                            <AiTwotoneMail size={30}/><p className="d-inline mx-3" style={{ fontSize:"22px" }}>{store.email}</p>
                        </div>
                        <hr></hr>
                    </div>
                    <div className="d-grid gap-2 w-50 m-auto">
                        <Button variant="info" size="lg">
                            รอการยืนยัน
                        </Button>
                    </div>
                </div>
            }

            {(store.status !== undefined && store.address !== null &&  store.status.data[0] === 1) &&
            <Container>
                <Row id="store" className="mb-5">
                    <div className="py-3 mb-4 store-header text-center" style={{ fontSize: "23px"}}>
                        STORE
                    </div>
                    <Col md={5}>
                        <Image src={`http://192.168.0.227:9000/resources/images/storeImage/main/${store.store_img}`} thumbnail></Image>
                    </Col>
                    <Col>
                        <Container className="w-75 pt-5" id="storeInfo">
                            <Container className="mb-5">
                                <Row><Col md={4}>Email :</Col><Col><p>{store.email}</p></Col></Row>
                            </Container>
                            <Container className="mb-5">
                                <Row><Col md={4}>Name :</Col><Col><p>{store.name}</p></Col></Row>
                            </Container>
                            <Container className="mb-5">
                                <Row><Col md={4}>Address :</Col><Col><p>{store.address}</p></Col></Row>
                            </Container>
                            <Container className="mb-5">
                                <Row><Col md={4}>Tel :</Col><Col><p>{store.tel}</p></Col></Row>
                            </Container>
                            <Container className="mb-5">
                                <Row><Col md={4}>Open time :</Col><Col><p>{store.name}</p></Col></Row>
                            </Container>
                            <Container className="d-grid gap-2">
                                <Button variant="outline-secondary">Edit</Button>
                            </Container>
                        </Container>
                    </Col>
                </Row>
                <Row id="pharmacist" className="mb-5">
                    <div className="py-3 mb-4 store-header text-center" style={{ fontSize: "23px"}}>
                        Phamacist
                    </div>
                    <Col md={5}>
                        <Image src={`http://192.168.0.227:9000/resources/images/storeImage/Pharmacist/${store.pharmacist_img}`} thumbnail></Image>
                    </Col>
                    <Col>
                        <Container className="w-75 pt-5" id="storeInfo">
                            <Container className="mb-5">
                                <Row><Col md={4}>Name :</Col><Col><p>{store.pharmacist_name}</p></Col></Row>
                            </Container>
                            <Container className="mb-5">
                                <Row><Col md={4}>Birth date :</Col><Col><p>{store.pharmacist_birthDate}</p></Col></Row>
                            </Container>
                        </Container>
                    </Col>
                </Row>
            </Container>
            }
        </div>
    )
}