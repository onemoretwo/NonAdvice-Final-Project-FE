import React from 'react';
import { Container } from 'react-bootstrap';

import NearbyTable from '../../components/NearbyStore/NearbyTemplate';

export default function NearbyView(){
    return (
        <div>
            <Container fluid>
                <Container className="mt-5 mb-4">
                    <h1>Nearby Pharmacies</h1>
                </Container>
                <hr className="mt-5 mb-4"></hr>
                <Container>
                    <NearbyTable />
                </Container>
            </Container>
        </div>
    )
}