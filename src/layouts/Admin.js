import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Switch,Route,Redirect } from 'react-router';

import RequestView from "../views/admin/request";
import UserView from "../views/admin/user";
import Sidebar from '../components/Sidebar/AdminSidebar'

import Navbar from '../components/Navbar/Navbar';

export default function Admin(props){
    return(
        <div>
            <Navbar role={props.role}/>
            <Container fluid>
                <Row style={{ height: "100vh" }}>
                    <Col xs={2} className="mx-0 px-0" >
                        <Sidebar />
                    </Col>
                    <Col xs={10}>
                        <Switch>
                            <Route path="/admin/request/:id" children={<h1>child request page</h1>} />
                            <Route path="/admin/request">
                                <RequestView />
                            </Route>
                            <Route path="/admin/users">
                                <UserView />
                            </Route>

                            <Redirect exact from="/admin" to="/admin/request" />
                            <Route>
                                {/* 404 not found */}
                                <h1>not found</h1>
                            </Route>
                        </Switch>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}