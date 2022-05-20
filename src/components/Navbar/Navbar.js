import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// import { currentStore } from '../../userSate';

import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

import { FaUserCircle } from 'react-icons/fa'
import axios from 'axios';

export default function MyNavbar(props){

    const hostname = "http://localhost:9000";

    const role = props.role;
    // const {removeCurrent} = currentStore();

    function handleLogoutBtn(){
        axios.get(`${hostname}/api/users/user/logout`, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            console.log(res)
        })
        localStorage.clear();
        window.location.href = "/auth/login";
    }

    var dashboard;
    if(role === "regular"){
        dashboard = "/user";
    }else if(role === "store"){
        dashboard = "/store";
    }else if(role === "admin"){
        dashboard = "/admin";
    }

    if(role === "regular" || role === "admin" || role === "store"){
        return (
            <>
            <style type="text/css">
                {`
                .nav-bg-green {
                    background-color: #2F5233;
                }

                .nav-font{
                    font-family: 'Kaisei Opti', serif;
                }
                `}
            </style>


            <div className="nav-font">
                <Navbar  className="nav-bg-green" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand href="/" style={{ fontSize: "1.5em" }}>
                            Consulting Pharmacy
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                            <Nav>
                                {(window.location.pathname === "/" || window.location.pathname === "/about" || window.location.pathname === "/user/myprofile" || window.location.pathname === "/store/myprofile") &&
                                <Nav.Link href={dashboard} style={{ marginRight: "2em" }}>Dashboard</Nav.Link>
                                }
                                <Nav.Link href="/about" style={{ marginRight: "3em" }}>About</Nav.Link>
                                <NavDropdown title={ <FaUserCircle size={25} /> } id="collasible-nav-dropdown">
                                    {(role === "regular") &&
                                        <div>
                                        <NavDropdown.Item href="/user/myprofile">My Profile</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        </div>
                                    }
                                    {(role === "store") &&
                                        <div>
                                        <NavDropdown.Item href="/store/myprofile">My Profile</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        </div>
                                    }
                                    <NavDropdown.Item onClick={handleLogoutBtn}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
            </>
        );
    }

    else if(role === "guest"){
        return(
            <>
            <style type="text/css">
                {`
                .nav-bg-green {
                    background-color: #2F5233;
                }

                .nav-font{
                    font-family: 'Kaisei Opti', serif;
                }
                `}
            </style>


            <div className="nav-font">
                <Navbar  className="nav-bg-green" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand href="/" style={{ fontSize: "1.5em" }}>
                            Consulting Pharmacy
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                            <Nav>
                                <Nav.Link href="/about" style={{ marginRight: "3em" }}>About</Nav.Link>
                                <Nav.Link href="/auth/register" style={{ marginRight: "1.5em" }}>Register</Nav.Link>
                                <Nav.Link href="/auth/login" style={{ marginRight: "1.5em" }}>Login</Nav.Link>
                                
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
            </>
        )
    }
}