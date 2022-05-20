import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Switch,Route,Redirect } from 'react-router';

import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/StoreSidebar';
import Footer from '../components/Footer';

import History from '../views/user/history';
import axios from "axios";
import Swal from "sweetalert2";
import StoreCall from "../components/storeCall";

export default function Store(props){

    const hostname = "http://192.168.0.227:9000";
    const id = JSON.parse(localStorage.getItem("userData")).id;

    const[store , setStore] = useState({});

    useEffect(() => {
        axios.get(`${hostname}/api/store/myInfo2/${id}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            console.log(res);
            setStore(res.data);
        });
    },[]);

    if(store.status !== undefined && store.address === null && store.status.data[0] === 0){

        Swal.fire({
            icon: "info",
            title: "Register your store first",
            text: "You have to complete your registeration first.\nOnce you are approved, you can start your journey.",
            allowOutsideClick: false,
            confirmButtonText: 'Complete my profile'
        }).then((result) => {
            window.location.href = "/store/myprofile"
        });
    }else if(store.status !== undefined && store.address !== null && store.status.data[0] === 0){
        Swal.fire({
            icon: "info",
            title: "Your registeration is waiting to be approve",
            text: "Once it is done, Admin will email you.",
            allowOutsideClick: false,
            confirmButtonText: 'Complete my profile'
        }).then((result) => {
            window.location.href = "/store/myprofile"
        });
    }

    return(
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
            <Navbar role={props.role} />
            <Container fluid>
                <Row>
                    <Col xs={2} className="mx-0 sidebar" id="sidebar-wrapper" style={{ padding: "0" }}>
                        <Sidebar />
                    </Col>
                    <Col xs={10} id="page-content-wrapper">
                        <Switch>
                            <Route path="/store/call">
                                <StoreCall store={store} />
                            </Route>
                            <Route path="/store/history">
                                <History />
                            </Route>
                            <Redirect exact from="/store" to="/store/call" />
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