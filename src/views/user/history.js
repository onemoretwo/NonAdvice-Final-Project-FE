import React from 'react'
import { Container } from 'react-bootstrap'

import HistoryList from '../../components/History/UserHistory/HistoryList'

export default function History(){
    return (
        <Container fluid>
            <Container className="mt-5 mb-4">
                    <h1>History</h1>
            </Container>
            <hr className="mt-5 mb-4"></hr>
            <Container>
                <HistoryList />
            </Container>
        </Container>
    )
}