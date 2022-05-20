import React from 'react';

import { Container, Nav } from 'react-bootstrap';
import { MdStoreMallDirectory,MdHistory } from 'react-icons/md'


export default function UserSidebar(){

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
                        <span className="pt-2"><MdStoreMallDirectory size={30} /></span>
                        <Nav.Link href="/user/nearbystore" className="text-dark">Nearby Store</Nav.Link>
                    </div>
                    <div className="d-flex flex-row sidebar-item">
                        <span className="pt-2"><MdHistory size={30} /></span>
                        <Nav.Link href="/user/history" className="text-dark">history</Nav.Link>
                    </div>
                </Nav>
            </Container>
        </div>
    )
}