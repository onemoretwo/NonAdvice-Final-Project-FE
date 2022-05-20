import React from 'react';
import { Container, Nav } from 'react-bootstrap';

import { AiOutlineForm } from 'react-icons/ai';
import { FiUsers } from 'react-icons/fi';
import { GoReport } from 'react-icons/go';
import { SiGoogleanalytics } from 'react-icons/si';


export default function AdminSidebar(){
    return(
        <div style={{ background: "#282828" }}>
            <style>
            {`
                .sidebar-font{
                    font-family: 'Kaisei Opti', serif;
                }

                .sidebar-item{
                    margin-bottom: 3rem;
                    margin-left: 2rem;
                    width: 100%;
                    color: white
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
                        <span className="pt-2"><AiOutlineForm size={30} /></span>
                        <Nav.Link href="/admin/request" className="text-white">Request</Nav.Link>
                    </div>
                    <div className="d-flex flex-row sidebar-item">
                        <span className="pt-2"><FiUsers size={30} /></span>
                        <Nav.Link href="/admin/users" className="text-white">User</Nav.Link>
                    </div>
                    <div className="d-flex flex-row sidebar-item">
                        <span className="pt-2"><GoReport size={30} /></span>
                        <Nav.Link href="/admin/users" className="text-white">Report</Nav.Link>
                    </div>
                    <div className="d-flex flex-row sidebar-item">
                        <span className="pt-2"><SiGoogleanalytics size={30} /></span>
                        <Nav.Link href="/admin/users" className="text-white">Analytic</Nav.Link>
                    </div>
                </Nav>
            </Container>
        </div>
    )
}