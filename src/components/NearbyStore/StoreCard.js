import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { BiTime } from 'react-icons/bi';

import { Card } from 'react-bootstrap';
import axios from 'axios';

export default function StoreCard(props){
    var storeId = props.id;
    let path = "/user/nearbystore/" + storeId;
    var hostname = "http://192.168.0.227:9000";

    const [store, setStore] = useState({});

    useEffect(() => {
        axios.get(`${hostname}/api/store/${storeId}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            setStore(res.data);
        });
    },[]);

    return(
        <Card style={{ width: '22rem', cursor: 'pointer' }}>
            <Card.Header className="py-3"></Card.Header>
            {store.store_img !== undefined &&
            <Card.Img style={{ maxWidth: "350px", maxHeight: "262.5px"}} variant="top" src={`http://192.168.0.227:9000/resources/images/storeImage/Main/${store.store_img}`} />
            }
            <Card.Body>
                <Card.Title>{store.name}</Card.Title>
                <Card.Subtitle className="my-2 mx-1"><BiTime size={25}/>Open : 12AM - 9PM</Card.Subtitle>
                <Card.Text className="mt-2">
                    Address : {store.address}
                </Card.Text>
                <Card.Text>
                    Tel : {store.tel}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted text-center bg-success"><b className="text-white">Active</b></Card.Footer>
            <Link to={path} className="stretched-link"></Link>
        </Card>
    )
}