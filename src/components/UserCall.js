import { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import pcConfig from './config';

import { Container, Row, Col, Button } from "react-bootstrap";
import { BiMicrophone, BiMicrophoneOff, BiVideo, BiVideoOff, BiPhoneCall } from 'react-icons/bi'
import { useParams } from "react-router";


export default function UserCall(){

    const { id } = useParams();

    const [microphone, setMicrophone] = useState(true);
    const [video, setVideo] = useState(true);

    function handleMicrophone(){
        var stream = document.querySelector("#localVideo").srcObject;
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        setMicrophone(!microphone);
    }

    function handleVideo(){
        var stream = document.querySelector("#localVideo").srcObject;
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
        setVideo(!video);
    }

    function handleEnd(){
        sendMessage('bye', room);
        window.location.href = "/user/nearbystore";
    }

    var isChannelReady = false;
    var isInitiator = false;
    var isStarted = false;
    var localStream;
    var pc;
    var remoteStream;
    var room = parseInt(id);

    // var localVideo = document.querySelector('#localVideo');
    // var remoteVideo = document.querySelector('#remoteVideo');

    var localStreamConstraints = {
        audio: true,
        video: true
    };

    var socket = socketIo("http://192.168.0.227:9000");

    socket.on('joined', function(room) {
        console.log('joined: ' + room);
        isChannelReady = true;
    });

    socket.on('kick', function() {
        handleEnd();
    })

    socket.on('created', function(room) {
        console.log('Created room ' + room);
        isInitiator = true;
    });

    socket.on('log', function(array) {
        console.log.apply(console, array);
    });

    socket.on('byeFromUser', function() {
        console.log("user bye");
        handleEnd();
    })

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
        document.querySelector('#localVideo').srcObject = stream;
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
        document.querySelector('#remoteVideo').srcObject = remoteStream;
    }
    function handleRemoteStreamRemoved(event) {
        console.log('Remote stream removed. Event: ', event);
    }

    // function hangup() {
    //     console.log('Hanging up.');
    //     stop();
    //     sendMessage('bye', room);
    // }

    function handleRemoteHangup() {
        console.log('Session teminated.');
        stop();
        isInitiator = false;
    }
    function stop() {
        isStarted = false;
        pc.close();
        pc = null;
    }

    useEffect(() => {
        socket.emit('create or join', room);

        console.log('Going to find Local media');
        navigator.mediaDevices.getUserMedia(localStreamConstraints)
        .then(gotStream)
        .catch((e) => {
            console.log(e);
            alert('getUserMedia() error: ' + e.name);
        });

        console.log('Getting user media with constraints', localStreamConstraints);

        window.onbeforeunload = function() {
            sendMessage('bye', room);
            socket.emit('byeFromUser', room);
        }

    }, []);


    return(
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
                    <h1>Consulting</h1>
                </Container>
                <hr className="mt-5 mb-4"></hr>
            <Container className="pt-4">
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
                <Button variant="primary mx-2" onClick={() => handleMicrophone()} style={{ borderRadius: "50%" }}>
                    {microphone ?  <BiMicrophone size={35} /> :  <BiMicrophoneOff size={35} /> }
                </Button>
                <Button variant="primary mx-2" onClick={() => handleVideo()} style={{ borderRadius: "50%" }}>
                    {video ? <BiVideo size={35} /> : <BiVideoOff size={35} /> }
                </Button>
                <Button variant="danger mx-2" onClick={() => handleEnd()} style={{ borderRadius: "50%" }}>
                    <BiPhoneCall size={35} />
                </Button>
            </Container>
        </Container>
    )
}