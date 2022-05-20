import React from "react";

import { Form, Row, Col, Button, Container } from "react-bootstrap";

import { BsSearch } from 'react-icons/bs';

export default function HistoryList(){
    return (
        <div>
            <style>
            {`
                .each-row{
                    height: 6.5rem;
                    border-radius: 20px;
                    background-color: #C1E1C1;
                }
            `}
            </style>
            <Form className="d-flex justify-content-end">
                <Row className="align-items-center">
                    <Col xs="auto">
                        <Form.Label htmlFor="searchFrom" visuallyHidden>
                            Search
                        </Form.Label>
                        <Form.Control
                            className="mb-2"
                            id="searchForm"
                        />
                    </Col>
                    <Col xs="auto">
                        to
                    </Col>
                    <Col xs="auto">
                        <Form.Label htmlFor="searchFrom" visuallyHidden>
                            Search
                        </Form.Label>
                        <Form.Control
                            className="mb-2"
                            id="searchForm"
                        />
                    </Col>
                    <Col xs="auto">
                        <Button type="submit" className="mb-2">
                            <BsSearch /><span className="mx-1"></span>
                            Search
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Container className="mt-5">
                <div className="mb-3">
                    <Row>
                        <Col><hr></hr></Col>
                        <Col md="auto">16 September 2021</Col>
                        <Col><hr></hr></Col>
                    </Row>
                </div>
                <Container fluid className="each-row my-4 border border-secondary">
                    
                </Container>
                <Container fluid className="each-row my-4 border border-secondary">
                    
                </Container>
                <Container fluid className="each-row my-4 border border-secondary">
                    
                </Container>
                <div className="mb-3">
                    <Row>
                        <Col><hr></hr></Col>
                        <Col md="auto">17 September 2021</Col>
                        <Col><hr></hr></Col>
                    </Row>
                </div>
                <Container fluid className="each-row my-4 border border-secondary">
                    
                </Container>
                <Container fluid className="each-row my-4 border border-secondary">
                    
                </Container>
                <Container fluid className="each-row my-4 border border-secondary">
                    
                </Container>
            </Container>
        </div>
    )
}