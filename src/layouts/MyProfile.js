import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Container, Image, Row, Button } from "react-bootstrap";
import { AiTwotoneMail, AiFillCamera } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import {HiIdentification} from "react-icons/hi";
import { GrMap } from "react-icons/gr";

import Navbar from '../components/Navbar/Navbar';
import Footer from "../components/Footer";
import UserChangePwdModal from "../components/Modal/UserChangePwdModal";
import UserChangeInfoModal from "../components/Modal/UserChangeInfoModal";
import UserChangeImageModal from "../components/Modal/UserChangeImageModal";

export default function MyProfile(props){

    const [cpwdModalShow, setCpwdModalShow] = useState(false);
    const [cInfoModalShow, setInfoModalShow] = useState(false);
    const [cImgModalShow, setImgModalShow] = useState(false);


    const hostname = "http://localhost:9000";
    const [user, setUser] = useState({});

    useEffect(() => {
        var userId = props.userId;
        axios.get(`${hostname}/api/users/${userId}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            var myuser = res.data
            setUser(myuser)
        })
    },[]);


    return(
        <div>
        <style>
            {`
            @import url('https://fonts.googleapis.com/css2?family=PT+Sans&family=Varela+Round&display=swap');
            .detail {
                font-family: 'Varela Round', sans-serif;
            }
            .ht {
                font-weight: bold
            }
            .unknown {
                color: red
            }
            `}
        </style>
        <Navbar role={props.role} />
            <div style={{ height: "90vh" }}>
                <div>
                    <Container fluid style={{ height: "250px", backgroundColor: "grey" }}>
                        <Container className="d-flex justify-content-center">
                                <Image style={{ height: "300px", width: "350px",position: "relative", bottom: "-50px", objectFit: "cover" }} src={`http://localhost:9000/resources/images/userImage/${user.img}`} roundedCircle thumbnail/>
                                <div>
                                    <Button onClick={() => setImgModalShow(true)} className="position-relative" style={{ bottom: "-260px", borderRadius: "50%", boxShadow: "none"}}><AiFillCamera size={30} /></Button>
                                    <UserChangeImageModal 
                                    show={cImgModalShow}
                                    onHide={() => setImgModalShow(false)}
                                    img={user.img} />
                                </div>
                        </Container>
                    </Container>
                    <Container style={{ marginTop: "15vh" }} className="d-flex justify-content-center">
                        <div className="w-75" style={{ padding: "4rem 2rem 1rem 2rem", border: "solid" }}>
                            <Container fluid>
                                <Row>
                                    <Col xs={5}>
                                    <Container>
                                        <div className="mb-5 detail">
                                            <div className="mb-3">
                                                <AiTwotoneMail size={30} /><p className="mx-2 d-inline ht mb-5">Email :</p>
                                            </div>
                                            <p style={{ padding: "0 75px" }}>{user.email}</p>
                                        </div>
                                        <div className="mb-5 detail">
                                            <div className="mb-3">
                                                <FaUser size={28} /><p className="mx-2 d-inline ht mb-5">Name :</p>
                                            </div>
                                            <p style={{ padding: "0 75px" }} className={user.name === null ? "unknown" : undefined}>{user.name === null || user.surname ? "unknown" : `${user.name} ${user.surname}`}</p>
                                        </div>
                                        <div className="mb-5 detail">
                                            <div className="mb-3">
                                                <HiIdentification size={28} /><p className="mx-2 d-inline ht mb-5">Telephone Number :</p>
                                            </div>
                                            <p style={{ padding: "0 75px" }} className={user.telephone_number === null ? "unknown" : undefined}>{user.telephone_number === null ? "unknown" : user.telephone_number}</p>
                                        </div>
                                    </Container>
                                    </Col>
                                    <Col xs={5}>
                                    
                                        <div className="mb-5 detail">
                                            <div className="mb-3">
                                                <HiIdentification size={28} /><p className="mx-2 ht d-inline ">Identification Number :</p>
                                            </div>
                                            <p style={{ padding: "0 75px" }} className={user.identification_number === null ? "unknown" : undefined}>{user.identification_number === null ? "unknown" : user.identification_number}</p>
                                        </div>
                                        <div className="mb-5 detail">
                                            <div className="mb-3">
                                                <GrMap size={30} /><p className="mx-2 d-inline ht mb-5">Address :</p>
                                            </div>
                                            <p style={{ padding: "0 75px" }} className={user.address === null ? "unknown" : undefined}>{user.address === null ? "unknown" : user.address}</p>
                                        </div>
                                    
                                    </Col>
                                    <Col xs={2}>
                                        <Button variant="dark" className="mb-3" onClick={() => setInfoModalShow(true)}>Edit profile</Button>
                                        <UserChangeInfoModal
                                        show={cInfoModalShow}
                                        onHide={() => setInfoModalShow(false)}
                                        user={user}
                                        />
                                        <Button variant="dark" className="text-nowrap" onClick={() => setCpwdModalShow(true)}>change password</Button>
                                        <UserChangePwdModal 
                                        show={cpwdModalShow}
                                        onHide={() => setCpwdModalShow(false)}
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Container>
                </div>
            </div>
            <Footer />
        </div>
    )
}