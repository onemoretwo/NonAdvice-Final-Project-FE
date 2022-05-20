import React from "react";

import { Container } from "react-bootstrap";

import UserTemplate from "../../components/ManageUser/UserTemplate";

export default function UserView(){
    return(
        <div>
            <Container fluid>
                <Container className="mt-5 mb-4">
                    <h1>User Management</h1>
                </Container>
                <hr className="mt-4 mb-4"></hr>
                <Container>
                    <UserTemplate />
                </Container>
            </Container>
        </div>
    )
}