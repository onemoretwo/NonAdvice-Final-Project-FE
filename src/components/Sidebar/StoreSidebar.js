import React from "react";

import { Container, Nav } from 'react-bootstrap';
import { MdVideoCall,MdHistory } from 'react-icons/md'

export default function StoreSidebar(){
    return(
        <div>
            <style>
                {`

                .sidebar-font{
                    font-family: 'Kaisei Opti', serif;
                }

                .sidebar-item{
                    margin-bottom: 3rem;
                    margin-left: 2rem;
                    width: 100%;
                    color: black
                }

                .spacer{
                    border-top-style: solid;
                    border-width: 1px;
                }
                `}
            </style>
            <Container>
                <Nav className="flex-column align-items-start sidebar-font" style={{ height: "100vh" }}>
                    <hr className="my-4"></hr>
                    <div className="d-flex flex-row sidebar-item">
                        <span className="pt-2"><MdVideoCall size={30} /></span>
                        <Nav.Link href="/store/call" className="text-dark">Call</Nav.Link>
                    </div>
                    <div className="d-flex flex-row sidebar-item">
                        <span className="pt-2"><MdHistory size={30} /></span>
                        <Nav.Link href="/store/history" className="text-dark">history</Nav.Link>
                    </div>
                </Nav>
            </Container>
        </div>
    )
}