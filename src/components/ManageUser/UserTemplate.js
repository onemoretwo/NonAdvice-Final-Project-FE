import React, { useEffect, useState } from "react";
import { Container, Table, Form, Row, Col,Button,Tab,Tabs, Badge } from "react-bootstrap";
import Swal from "sweetalert2";

import { BsSearch } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';
import { AiFillWarning } from 'react-icons/ai';

import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import axios from "axios";

import UserProfileModal from "../Modal/UserProfileModal";
import StoreProfileModal from "../Modal/StoreProfileModal";

export default function UserTemplate(){

    const hostname = "http://localhost:9000";

    const [users, setUser] = useState();
    // var userCache;
    const [stores, setStore] = useState();
    // var storeCache;
    const [key, setKey] = useState('user');
    const [keyword, setKeyword] = useState("");

    const [modalShow, setModalShow] = useState("0");

    useEffect(() => {
        axios.get(`${hostname}/api/users`, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            setUser(res.data.users);
        });

        axios.get(`${hostname}/api/store`, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            console.log(res.data.stores)
            setStore(res.data.stores);
        });
    },[]);

    function onHide(){
        console.log(modalShow)
        setModalShow(null);
    }

    function searchByEmail(){
        var data = {keyword : keyword}
        if (key === "user"){
            axios.post(`${hostname}/api/users`, data, {
                headers: {
                    "x-access-token": localStorage.getItem("token"), 
                }
            }).then((res) => {
                setUser(res.data.users);
            })
        }else if (key === "pharmacy"){
            axios.post(`${hostname}/api/store`, data, {
                headers: {
                    "x-access-token": localStorage.getItem("token"), 
                }
            }).then((res) => {
                setStore(res.data.stores);
            })
        }
    }

    function lastActiveCalculate(timeStamp){
        var date = new Date(timeStamp.substring(0,10));
        var today = Date.now();

        const oneDay = 1000 * 60 * 60 * 24;

        // Calculating the time difference between two dates
        const diffInTime = today - date.getTime();

        if(diffInTime < oneDay){
            if (diffInTime < 1000*60*60){
                return Math.round(diffInTime/(1000*60)) + "  min.";
            }else{
                return Math.round(diffInTime/(1000*60*60)) + "  hr.";
            }
        }

        // Calculating the no. of days between two dates
        const diffInDays = Math.round(diffInTime / oneDay);

        return diffInDays + "  days";
        
    }

    return(
        <div>
            <style>
                {`
                .my-custom-scrollbar {
                    position: relative;
                    height: 600px;
                    overflow: auto;
                }

                .table-wrapper-scroll-y {
                    display: block;
                }


                #header th {
                            text-align: center;
                            vertical-align: middle;
                        }

                        td:nth-child(1), td:nth-child(6), td:nth-child(5), td:nth-child(4) {
                            text-align: center
                        }

                        table {
                            max-height: 500px;
                            overflow-y: scroll;
                        }

                        .switch-btn{
                            width: 100px;
                            font-size: 20px;
                        }

                        td{
                            vertical-align: middle
                        }
                `}
            </style>
            <div className="d-flex">
                <div className="w-100">
                    <Form className="d-flex justify-content-end">
                        <Row className="align-items-center">
                            <Col xs="auto">
                                <Form.Label htmlFor="searchFrom" visuallyHidden>
                                    Search
                                </Form.Label>
                                <Form.Control
                                    className="mb-2"
                                    placeholder="search by email"
                                    onChange={(e) => {
                                        setKeyword(e.target.value);
                                    }}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button onClick={searchByEmail} className="mb-2">
                                    <BsSearch /><span className="mx-1"></span>
                                    Search
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>

            <Tabs 
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3">
                <Tab eventKey="user" title="user">
                    <Container className="mt-5">
                        <div className="table-wrapper-scroll-y my-custom-scrollbar">
                            <Table striped bordered hover variant="dark" className="mb-0 table-fixed">
                                <thead>
                                    <tr id="header">
                                        <th className="col-1"></th>
                                        <th className="col-3">Email</th>
                                        <th className="col-3">Name</th>
                                        <th className="col-1">Last active</th>
                                        <th className="col-1">Permission</th>
                                        <th className="col-1"></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {users !== undefined &&
                                        users.map((item, i) => {
                                            return (
                                                <tr key={item.id}>
                                                    <td>{i+1}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.name === null ? <Badge bg="secondary" style={{ fontSize:"13.5px" }}>uncomplete</Badge> : item.name + " " + item.surname}</td>
                                                    <td>{lastActiveCalculate(item.updated_at)}</td>
                                                    <td>
                                                        <BootstrapSwitchButton 
                                                            checked={item.permission === "active" ? true : false}
                                                            size="sm"
                                                            width="70"
                                                            onstyle="success"
                                                            offstyle="danger"
                                                            offlabel="Banned"
                                                            onlabel="Active"
                                                            onChange={(checked) => {
                                                                Swal.fire({
                                                                title: 'Are you sure?',
                                                                text: "You want to suspend this user",
                                                                icon: 'warning',
                                                                showCancelButton: true,
                                                                confirmButtonColor: '#3085d6',
                                                                cancelButtonColor: '#d33',
                                                                confirmButtonText: 'Yes !'
                                                                }).then((result) => {
                                                                    if(result.isConfirmed){
                                                                        axios.put(`${hostname}/api/users/switchPermission/${item.id}`, {permission: item.permission},{
                                                                            headers: {
                                                                                "x-access-token": localStorage.getItem("token"),
                                                                            }
                                                                        }).then((res) => {
                                                                            if(res.data.success){
                                                                                if(res.data.permission === "active"){
                                                                                    Swal.fire(
                                                                                    'Unsuspended!',
                                                                                    `You have unsuspended user ${item.email}.`,
                                                                                    'success'
                                                                                    )
                                                                                }else if(res.data.permission === "banned"){
                                                                                    Swal.fire(
                                                                                    'Suspended!',
                                                                                    `You have suspended user ${item.email}.`,
                                                                                    'success'
                                                                                    )
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }} />
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => setModalShow(item.id)}><FaSearch /> </Button>
                                                        <UserProfileModal show={modalShow} onHide={onHide} user={item} /></td>
                                                    </tr>
                                            )
                                        })
                                    }


                                </tbody>
                            </Table>
                        </div>
                    </Container>
                </Tab>

                <Tab eventKey="pharmacy" title="Pharmacy">
                    <Container className="mt-5" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <div className="table-wrapper-scroll-y my-custom-scrollbar">
                            <Table striped bordered hover variant="dark" className="mb-0 table-fixed">
                                <thead>
                                    <tr id="header">
                                        <th className="col-3">Name</th>
                                        <th className="col-3">Email</th>
                                        <th className="col-2">Pharmacist name</th>
                                        <th className="col-1">Last use</th>
                                        <th className="col-1">Permission</th>
                                        <th className="col-1"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    {stores !== undefined &&
                                        stores.map((item) => {
                                            return (
                                                <tr key={item.id}>
                                                    <td style={{ textAlign: "left" }}>
                                                        {item.name}
                                                        {(item.license_img !== null && item.status.data[0] === 0) &&
                                                            <span style={{ float:"right",color:"yellow" }}><AiFillWarning size={20}/></span>
                                                        }
                                                    </td>
                                                    
                                                    <td>{item.email}</td>
                                                    <td>{item.pharmacist_name === null ? <Badge bg="secondary" style={{ fontSize:"13.5px" }}>uncomplete</Badge> : item.pharmacist_name}</td>
                                                    <td>{lastActiveCalculate(item.updated_at)}</td>
                                                    <td>
                                                        <BootstrapSwitchButton

                                                            checked={item.permission === "active" ? true : false}
                                                            size="sm"
                                                            width="70"
                                                            onstyle="success"
                                                            offstyle="danger"
                                                            offlabel="Banned"
                                                            onlabel="Active"
                                                            
                                                            onChange={(checked) => {
                                                                Swal.fire({
                                                                title: 'Are you sure?',
                                                                text: "You want to suspend this user",
                                                                icon: 'warning',
                                                                showCancelButton: true,
                                                                confirmButtonColor: '#3085d6',
                                                                cancelButtonColor: '#d33',
                                                                confirmButtonText: 'Yes !'
                                                                }).then((result) => {
                                                                    if(result.isConfirmed){
                                                                        axios.put(`${hostname}/api/store/switchPermission/${item.id}`, {permission: item.permission},{
                                                                            headers: {
                                                                                "x-access-token": localStorage.getItem("token"),
                                                                            }
                                                                        }).then((res) => {
                                                                            if(res.data.success){
                                                                                if(res.data.permission === "active"){
                                                                                    Swal.fire(
                                                                                    'Unsuspended!',
                                                                                    `You have unsuspended user ${item.email}.`,
                                                                                    'success'
                                                                                    )
                                                                                }else if(res.data.permission === "banned"){
                                                                                    Swal.fire(
                                                                                    'Suspended!',
                                                                                    `You have suspended user ${item.email}.`,
                                                                                    'success'
                                                                                    )
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }} />
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => setModalShow(item.id)}><FaSearch/> </Button>
                                                        <StoreProfileModal show={modalShow} onHide={onHide} store={item} />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }


                                </tbody>
                            </Table>
                        </div>
                    </Container>
                </Tab>
            </Tabs>
        </div>
    )
}