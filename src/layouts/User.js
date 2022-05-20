import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Switch,Route,Redirect } from 'react-router';

import Navbar from '../components/Navbar/Navbar';

import Sidebar from '../components/Sidebar/UserSidebar';
import Footer from '../components/Footer';

import NearbyView from '../views/user/nearby';
import Store from '../components/NearbyStore/Store';
import History from '../views/user/history';
import UserCall from '../components/UserCall';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function User(props){

    axios.get("http://192.168.0.227:9000/api/users/is/banned", {
        headers: {
            "x-access-token": localStorage.getItem("token"), 
        }
    }).then((res) => {
        if(res.data.permission[0].permission === "banned"){
            Swal.fire({
                icon: 'error',
                title: 'Banned',
                text: 'You have been banned, Contact our admin for more information',
                allowOutsideClick: false,
              }).then(() => {
                axios.get(`http://192.168.0.227:9000/api/users/user/logout`, {
                    headers: {
                        "x-access-token": localStorage.getItem("token"), 
                    }
                }).then((res) => {
                    console.log(res)
                })
                localStorage.clear();
                window.location.href = "/auth/login";
              })
        }
    });

    return (
        <div>
            <style>
                {`
                .sidebar{
                    background-color: rgb(244,245,247);
                    border-right-style: solid;
                    border-width: 1px;
                    border-color: grey;
                }
                `}
            </style>
            <Navbar role={props.role}/>
            <Container fluid>
                <Row>
                    <Col xs={2} className="mx-0 sidebar" id="sidebar-wrapper" style={{ padding: "0" }}>
                        <Sidebar />
                    </Col>
                    <Col xs={10} id="page-content-wrapper">
                        <Switch>
                            <Route path="/user/nearbystore/:id/call">
                                <UserCall />
                            </Route>
                            <Route path="/user/nearbystore/:id" children={<Store />} />
                            <Route path="/user/nearbystore">
                                <NearbyView />
                            </Route>
                            <Route path="/user/history">
                                <History />
                            </Route>

                            <Redirect exact from="/user" to="/user/nearbystore" />
                            <Route>
                                {/* 404 not found */}
                                <h1>not found</h1>
                            </Route>
                        </Switch>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    )
}