import React, { useEffect, useState } from 'react';
// import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import axios from 'axios';

import { Image } from 'react-bootstrap';

import Footer from './Footer';
import Navbar from './Navbar/Navbar';

function Home(props) {
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://192.168.0.227:9000/api", {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((res) => {
                setMessage(res.data.message);
            });
    });

    return (
        <div>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Russo+One&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Rampart+One&family=Russo+One&display=swap');

                .bg{
                    background-image: url('http://localhost:9000/resources/images/home.jpg');
                    height: 95vh;
                    width: 85%;
                    margin: auto;
                    background-repeat: no-repeat;
                }

                .logo {
                    width: 180px;
                    position: absolute;
                    top: 230px;
                    left: 380px
                }

                .name {
                    position: absolute;
                    top: 500px;
                    left: 190px;
                    font-family: 'Russo One', sans-serif;
                    color: white;
                    font-size: 55px;
                }

                .text {
                    color: white;
                    position: absolute;
                    top: 600px;
                    left: 280px;
                    font-size: 30px;
                    font-family: 'Rampart One', cursive;
                }

                .button {
                  display: inline-block;
                  color: #fff;
                  text-transform: uppercase;
                  padding: 20px 30px;
                  border-radius: 5px;
                  box-shadow: 0px 17px 10px -10px rgba(0, 0, 0, 0.4);
                  cursor: pointer;
                  -webkit-transition: all ease-in-out 300ms;
                  transition: all ease-in-out 300ms;
                }
                .button:hover {
                    color: white;
                  box-shadow: 0px 37px 20px -20px rgba(0, 0, 0, 0.2);
                  -webkit-transform: translate(0px, -5px) scale(1.2);
                          transform: translate(0px, -5px) scale(1.2);
                }
                .btn-link{
                    font-size: 18px;
                    margin: 0 35px;
                    text-decoration: none
                }
                .btn-start {
                    position: absolute;
                    top: 720px;
                    left: 210px
                }
                `}
            </style>
            <Navbar role={props.role}/>
            <div style={{ background: "darkgrey" }}>
                <div className="bg">
                    <Image className="logo" src={'http://192.168.0.227:9000/resources/images/homelogo.png'} ></Image>
                    <h1 className="name">Consulting Pharmacy</h1>
                    <h4 className="text">consult anywhere anytime</h4>
                    <div className="btn-start">
                        <div onClick={() => { window.location.href = "/auth/storeregister" }} className="button btn btn-success btn-link">ลงทะเบียนร้านค้า</div>
                        <div onClick={() => { window.location.href = "/auth/register" }} className="button btn btn-success btn-link px-5">เริ่มต้นปรึกษา</div>
                    </div>
                </div>
                
            </div>
            <Footer />
        </div>
    )
}

export default Home;