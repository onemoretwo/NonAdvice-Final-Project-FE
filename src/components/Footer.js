import React from 'react';
import { Container,Row,Col } from 'react-bootstrap';

export default function Footer(){
    return (
        <div>
            <style>
                {`
                .bg-footer {
                    background-color: rgb(41,44,51);
                }
                `}
            </style>
            <footer>
                <Container className="bg-footer" fluid>
                    <Row style={{ height: "50px" }}>
                        <Col md={6}>
                            <Container className="d-flex justify-content-end">
                                
                            </Container>
                        </Col>
                        <Col>
                            <Container className="d-flex justify-content-start">
                                
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
}