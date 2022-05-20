import React from "react";
import { Container } from "react-bootstrap";

import RequestList from '../../components/Request/RequestList';

export default function RequestView(){
    return(
        <div>
            <Container fluid>
                <Container className="mt-5 mb-4">
                    <h1>New Requests</h1>
                </Container>
                <hr className="mt-5 mb-4"></hr>
                <Container>
                    <RequestList />
                </Container>
            </Container>
        </div>
    )
}