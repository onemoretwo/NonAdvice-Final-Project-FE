import React, { useEffect, useState } from 'react';
import socketIo from "socket.io-client";
import pcConfig from './config';

import { Col, Container, Row, Button, Alert } from 'react-bootstrap';
import { BiMicrophone, BiMicrophoneOff, BiVideo, BiVideoOff, BiPhoneCall } from 'react-icons/bi'
import Swal from 'sweetalert2';
import axios from 'axios';

export default function StoreCall(props){

    const room = props.store.user_id;

    const hostname = "http://192.168.0.227:9000";
    const [state, setState] = useState(false);

    const [microphone, setMicrophone] = useState(true);
    const [video, setVideo] = useState(true);
    const [incall, setIncall] = useState(false);

    function handleEnd(){
        socket.emit("endCall", room);
    }

    var isChannelReady = false;
    var isInitiator = false;
    var isStarted = false;
    var localStream;
    var pc;
    var remoteStream;

    var localVideo = document.querySelector('#localVideo');
    var remoteVideo = document.querySelector('#remoteVideo');

    var localStreamConstraints = {
        audio: true,
        video: true
    };

    function handleMicrophone(){
        var stream = localVideo.srcObject;
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        setMicrophone(!microphone);
    }

    function handleVideo(){
        var stream = localVideo.srcObject;
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
        setVideo(!video);
    }

    var socket = socketIo("http://192.168.0.227:9000");

    socket.on('created', function(room) {
        console.log('Created room ' + room);
        isInitiator = true;
    });

    socket.on('join', function(room) {
        console.log('Another peer made a request to join room ' + room);
        console.log('This peer is the initiator of room ' + room + '!');
        setIncall(true);
        isChannelReady = true;
    });

    socket.on('log', function(array) {
        console.log.apply(console, array);
    });

    socket.on('message', function(message, room) {
        console.log('Client received message:', message, room);
        if (message === 'got user media'){
            maybeStart();
        }else if (message.type === 'offer'){
            if(!isInitiator && !isStarted){
                maybeStart();
            }
            pc.setRemoteDescription(new RTCSessionDescription(message));
            doAnswer();
        }else if (message.type === "answer" && isStarted){
            pc.setRemoteDescription(new RTCSessionDescription(message));
        }else if (message.type === 'candidate' && isStarted) {
            var candidate = new RTCIceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate
            });
            pc.addIceCandidate(candidate);
        }else if (message === 'bye' && isStarted) {
            handleRemoteHangup();
        }
    });

    function sendMessage(message, room) {
        console.log('Client sending message: ', message, room);
        socket.emit('message', message, room);
    }

    function gotStream(stream){
        console.log('Adding local stream');
        localStream = stream;
        localVideo.srcObject = stream;
        handleVideo();
        handleMicrophone();
        sendMessage('got user media', room);
        if (isInitiator) {
            maybeStart();
        }
    }

    function maybeStart(){
        console.log('>>>>>>> maybeStart() ', isStarted, localStreamConstraints, isChannelReady);
        if (!isStarted && typeof localStream !== 'undefined' && isChannelReady) {
            console.log('>>>>>> creating peer connection');
            createPeerConnection();
            pc.addStream(localStream);
            isStarted = true;
            console.log('isInitiator', isInitiator);
            if (isInitiator) {
                doCall();
            }
        }
    }

    function createPeerConnection() {
        try {
            pc = new RTCPeerConnection(pcConfig);
            pc.onicecandidate = handleIceCandidate;
            pc.onaddstream = handleRemoteStreamAdded;
            pc.onremovestream = handleRemoteStreamRemoved;
            console.log('Created RTCPeerConnection');
        } catch (e) {
            console.log('Failed to create PeerConnection, exception: ' + e.message);
            alert("Cannot create RTCPeerConnection object.");
            return;
        }
    }

    function handleIceCandidate(event) {
        console.log('icecandidate event: ', event);
        if (event.candidate) {
            sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            }, room);
        } else {
            console.log('End of candidates.');
        }
    }

    function handleCreateOfferError(event) {
        console.log('createOffer() error: ', event);
    }
    function doCall() {
        console.log('Sending offer to peer');
        pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
    }
    function doAnswer(){
        console.log('Sending answer to peer.');
        pc.createAnswer().then(
            setLocalAndSendMessage,
            onCreateSessionDescriptionError
        );
    }
    function setLocalAndSendMessage(sessionDescription) {
        pc.setLocalDescription(sessionDescription);
        console.log('setLocalAndSendMessage sending message', sessionDescription);
        sendMessage(sessionDescription, room);
    }
    function onCreateSessionDescriptionError(error) {
        console.log('Failed to create session description: ' + error.toString());
    }
    function handleRemoteStreamAdded(event) {
        console.log('Remote stream added.');
        remoteStream = event.stream;
        remoteVideo.srcObject = remoteStream;
    }
    function handleRemoteStreamRemoved(event) {
        console.log('Remote stream removed. Event: ', event);
    }

    function handleRemoteHangup() {
        console.log('Session teminated.');
        stop();
        setIncall(false);
        isChannelReady = false;
    }
    function stop() {
        isStarted = false;
        pc.close();
        pc = null;
    }


    function createRoom(){
        socket.emit('create or join', room);

        navigator.mediaDevices.getUserMedia(localStreamConstraints)
        .then(gotStream)
        .catch((e) => {
            alert('getUserMedia() error: ' + e.name);
        });

        console.log('Getting user media with constraints', localStreamConstraints);

        window.onbeforeunload = function() {
            sendMessage('bye', room);
        }
    }


    useEffect(() => {
        
    },[]);

    function closeSession() {
        Swal.fire({
            title: 'Close session?',
            text: "Are you sure want to close session",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Close'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`${hostname}/api/store/closeSession`, {}, {
                    headers: {
                        "x-access-token": localStorage.getItem("token"), 
                    }
                }).then((res) => {
                    if(res.data.success){
                        Swal.fire({
                            title: 'Close!',
                            text: 'Session is close, no one can call you',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            window.location.reload();
                        })
                    }
                })
            }
          })
    }

    function openSession() {
        Swal.fire({
            title: 'Opening session?',
            text: "Start video call with your customer",
            // icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Open'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`${hostname}/api/store/openSession`, {}, {
                    headers: {
                        "x-access-token": localStorage.getItem("token"), 
                    }
                }).then((res) => {
                    console.log(res);
                    if(res.data.success){
                        createRoom();
                        setState(true);
                        Swal.fire({
                            title: 'Open!',
                            text: 'Wait customer to call you.',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                })
            }
          })
    }

    return (
        <Container fluid>
                <style>
                    {`
                    .video{
                        background: grey;
                        width: 95%
                    }
                    `}
                </style>
                <Container className="mt-5 mb-4">
                    <h1>{props.store.name}</h1>
                </Container>
                <hr className="mt-5 mb-4"></hr>
                <Container className="pt-4">
                    {state &&
                    <Alert variant="success" className="mb-5">
                        Your are currently OPEN
                    </Alert>
                    }
                    <Row>
                        <Col className="text-center">
                            <video id="localVideo" className="video rounded" autoPlay muted playsInline></video>
                        </Col>
                        <Col className="text-center">
                            <video id="remoteVideo" className="video rounded" autoPlay playsInline></video>
                        </Col>
                    </Row>
                </Container>
                <Container className="mt-5">
                    <Button variant="primary mx-2" onClick={() => handleMicrophone()} style={{ borderRadius: "50%" }} disabled={!state}>
                        {microphone ?  <BiMicrophone size={35} /> :  <BiMicrophoneOff size={35} /> }
                    </Button>
                    <Button variant="primary mx-2" onClick={() => handleVideo()} style={{ borderRadius: "50%" }} disabled={!state}>
                        {video ? <BiVideo size={35} /> : <BiVideoOff size={35} /> }
                    </Button>
                    <Button variant="danger mx-2" onClick={() => handleEnd()} style={{ borderRadius: "50%" }} disabled={!incall}>
                        <BiPhoneCall size={35} />
                    </Button>
                </Container>
                <Container className="text-center mt-5">
                {!incall &&
                <div>
                    {!state &&
                        <Button variant="success" onClick={openSession} className="btn btn-success btn-lg btn-block btn-huge" style={{ padding: "20px 50px" }}>Open session</Button>
                    }
                    {state &&
                        <Button variant="danger" onClick={closeSession} className="btn btn-success btn-lg btn-block btn-huge" style={{ padding: "20px 50px" }}>End session</Button>
                    }
                </div>
                }
                </Container>
        </Container>
    )
}