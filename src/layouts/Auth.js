import React from 'react';
import { 
    Switch,
    Route,
    Redirect
 } from 'react-router-dom';

 import { Col, Container, Row, Image } from 'react-bootstrap';

 import Banner from '../assets/img/loginBanner.jpg';

 import Notfound from '../components/Notfound';

 import Login from '../views/auth/login'
 import Register from '../views/auth/register'
 import StoreRegister from '../views/auth/storeregister'

 export default function Auth() {
     return (
         <div>
            <style>
                {`
                .bg-auth {
                    background-color: rgb(30,41,59);
                }

                .font-logo{
                    font-family: 'Kaisei Opti', serif;
                }
                `}
            </style>
            <Container fluid>
                <Row className="bg-auth" style={{ height: "100vh", padding: "0" }}>
                    <Col md={5} className="d-flex align-items-center">
                        <Container className="d-flex flex-column align-items-center" style={{ width: "80%" }}>
                            <div className="jumbotron text-light font-logo container-fluid">
                                <h1 className="pb-3 display-5"><u>Consulting Pharmacy</u></h1>
                            </div>
                            <Image  src={ Banner } thumbnail className="mt-5"></Image>
                        </Container>
                    </Col>
                    <Col className="d-flex align-items-center justify-content-center">
                        <Switch>
                            <Route path="/auth/login">
                                <Login />
                            </Route>
                            <Route path="/auth/register">
                                <Register />
                            </Route>
                            <Route path="/auth/storeregister">
                                <StoreRegister />
                            </Route>
                            <Redirect exact from="/auth" to="/auth/login" />
                            <Route>
                                <Notfound />
                            </Route>
                        </Switch>
                    </Col>
                </Row>
            </Container>
         </div>
     );
 }