import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

import { BsSearch } from 'react-icons/bs';

import StoreCard from './StoreCard';

export default function NearbyTemplate(){

    const hostname = "http://192.168.0.227:9000";
    const [storeIds, setStoreIds] = useState([]);

    useEffect(() => {
        axios.get(`${hostname}/api/store/allId`, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            console.log(res.data);
            setStoreIds(res.data);
        })
    },[]);

    const [keyword, setKeyword] = useState({keyword: ""});

    function handleOnChange(e){
        setKeyword({
            [e.target.name]: e.target.value,
        });
    }

    function handleSearch() {
        axios.post(`${hostname}/api/store/search`, keyword, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            console.log(res);
            setStoreIds(res.data.store)
        })
    }

    return (
        <div>
            <Form className="d-flex justify-content-end">
                <Row className="align-items-center">
                    <Col xs="auto">
                        <Form.Label htmlFor="searchFrom" visuallyHidden>
                            Search
                        </Form.Label>
                        <Form.Control
                            name="keyword"
                            className="mb-2"
                            id="searchForm"
                            onChange={handleOnChange}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button className="mb-2" onClick={handleSearch}>
                            <BsSearch /><span className="mx-1"></span>
                            Search
                        </Button>
                    </Col>
                </Row>
            </Form>

            <div className="mt-4">
                <Row>
                {
                    storeIds.map((item) => {
                            if(item.callStatus === "y"){
                                return (
                                    <Col key={item.id} md="4" className="py-5 d-flex justify-content-center">
                                        <StoreCard id={item.id} />
                                    </Col>
                                )
                            }
                        }
                    )
                }
                </Row>

            </div>
        </div>
    )
}