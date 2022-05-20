import axios from "axios";
import React, { useEffect, useState }  from "react";

import { Container, Table, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

import AdminVerifyRequestModal from "../Modal/AdminVerifyRequestModal";

export default function RequestList(){

    const hostname = "http://localhost:9000";

    const [store, setStore] = useState();
    const [modalShow, setModalShow] = useState("0");

    const [checker, setChecker] = useState(0);

    function onHide(){
        setModalShow(null);
    }

    useEffect(() => {
        console.log(checker);
        axios.get(`${hostname}/api/admin/newRequest`, {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
            if(res.data.success){
                console.log(res.data.store);
                setStore(res.data.store);
            }
        });
    },[checker])

    return(
        <div>
            <style>
                {`
                #header th {
                    text-align: center;
                    vertical-align: middle;
                }
                tr td:nth-child(1), tr td:nth-child(4){
                    text-align: center;
                }
                tr td{
                    vertical-align: middle;
                }
                `}
            </style>
            <Container className="mt-4 position-absolute">
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr id="header">
                            <th className="col-2">date</th>
                            <th className="col-4">Store name</th>
                            <th className="col-4">Email</th>
                            <th className="col-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {store !== undefined &&
                            store.map((item, i) => {
                                return(
                                    <tr key={item.user_id}>
                                        <td>{item.created_at.substring(0,10)}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>
                                            <Button onClick={() => setModalShow(item.user_id)}><FaSearch /> </Button>
                                            <AdminVerifyRequestModal show={modalShow} onHide={onHide} store={item} onApprove={() => setChecker(checker + 1)} />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}