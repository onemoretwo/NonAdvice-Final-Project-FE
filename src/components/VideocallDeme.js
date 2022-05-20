import React, { useState } from 'react';
import '../assets/styles/VideocallDemo.css';
import { useEffect } from 'react';
import axios from 'axios';

import { Socket } from 'socket.io-client/dist/socket.io';

import { Container } from 'react-bootstrap';

export default function VideoCallDemo () {

    const hostname = "http://localhost:9000";
    var userId = JSON.parse(localStorage.getItem("userData")).id;
    const [store, setStore] = useState({});

    useEffect(() => {
        axios.get(`${hostname}/api/store/myInfo/${userId}`).then((res) => {
            setStore(res.data);
        })

        // videoCall
        const startButton = document.getElementById('startButton');
        const callButton = document.getElementById('callButton');
        const hangupButton = document.getElementById('hangupButton');
        // callButton.disabled = true;
        // hangupButton.disabled = true;
        // startButton.addEventListener('click', start);
        // callButton.addEventListener('click', call);
        // hangupButton.addEventListener('click', hangup);

        let startTime;
        const localVideo = document.getElementById('localVideo');
        const remoteVideo = document.getElementById('remoteVideo');

        localVideo.addEventListener('loadedmetadata', function() {
            console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
        });

        remoteVideo.addEventListener('loadedmetadata', function() {
            console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
        });

        remoteVideo.addEventListener('resize', () => {
            console.log(`Remote video size changed to ${remoteVideo.videoWidth}x${remoteVideo.videoHeight}`);
            if (startTime) {
                const elapsedTime = window.performance.now() - startTime;
                console.log('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
                startTime = null;
            }
        });

        let localStream;
        let pc1;
        let pc2;
        const offerOptions = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        };

        function getName(pc) {
            return (pc === pc1) ? 'pc1' : 'pc2';
        }

        function getOtherPc(pc) {
            return (pc === pc1) ? pc2 : pc1;
        }

        async function start() {
            console.log('Requesting local stream');
            startButton.disabled = true;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
                console.log('Received local stream');
                localVideo.srcObject = stream;
                localStream = stream;
                callButton.disabled = false;
            } catch (e) {
                alert(`getUserMedia() error: ${e.name}`);
            }
        }

        async function call() {
            callButton.disabled = true;
            hangupButton.disabled = false;
            console.log('Starting call');
            startTime = window.performance.now();
            const videoTracks = localStream.getVideoTracks();
            const audioTracks = localStream.getAudioTracks();
            if (videoTracks.length > 0) {
                console.log(`Using video device: ${videoTracks[0].label}`);
            }
            if (audioTracks.length > 0) {
                console.log(`Using audio device: ${audioTracks[0].label}`);
            }
            const configuration = {};
            console.log('RTCPeerConnection configuration:', configuration);
            pc1 = new RTCPeerConnection(configuration);
            console.log('Created local peer connection object pc1');
            pc1.addEventListener('icecandidate', e => onIceCandidate(pc1, e));
            pc2 = new RTCPeerConnection(configuration);
            console.log('Created remote peer connection object pc2');
            pc2.addEventListener('icecandidate', e => onIceCandidate(pc2, e));
            pc1.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc1, e));
            pc2.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc2, e));
            pc2.addEventListener('track', gotRemoteStream);

            localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));
            console.log('Added local stream to pc1');

            try {
                console.log('pc1 createOffer start');
                const offer = await pc1.createOffer(offerOptions);
                await onCreateOfferSuccess(offer);
            } catch (e) {
                onCreateSessionDescriptionError(e);
            }
        }

        function onCreateSessionDescriptionError(error) {
        console.log(`Failed to create session description: ${error.toString()}`);
        }

        async function onCreateOfferSuccess(desc) {
        console.log(`Offer from pc1\n${desc.sdp}`);
        console.log('pc1 setLocalDescription start');
        try {
            await pc1.setLocalDescription(desc);
            onSetLocalSuccess(pc1);
        } catch (e) {
            onSetSessionDescriptionError();
        }

        console.log('pc2 setRemoteDescription start');
        try {
            await pc2.setRemoteDescription(desc);
            onSetRemoteSuccess(pc2);
        } catch (e) {
            onSetSessionDescriptionError();
        }

        console.log('pc2 createAnswer start');
        try {
            const answer = await pc2.createAnswer();
            await onCreateAnswerSuccess(answer);
        } catch (e) {
            onCreateSessionDescriptionError(e);
        }
        }

        function onSetLocalSuccess(pc) {
        console.log(`${getName(pc)} setLocalDescription complete`);
        }

        function onSetRemoteSuccess(pc) {
        console.log(`${getName(pc)} setRemoteDescription complete`);
        }

        function onSetSessionDescriptionError(error) {
        console.log(`Failed to set session description: ${error.toString()}`);
        }

        function gotRemoteStream(e) {
            if (remoteVideo.srcObject !== e.streams[0]) {
                remoteVideo.srcObject = e.streams[0];
                console.log('pc2 received remote stream');
            }
        }

        async function onCreateAnswerSuccess(desc) {
        console.log(`Answer from pc2:\n${desc.sdp}`);
        console.log('pc2 setLocalDescription start');
        try {
            await pc2.setLocalDescription(desc);
            onSetLocalSuccess(pc2);
        } catch (e) {
            onSetSessionDescriptionError(e);
        }
        console.log('pc1 setRemoteDescription start');
        try {
            await pc1.setRemoteDescription(desc);
            onSetRemoteSuccess(pc1);
        } catch (e) {
            onSetSessionDescriptionError(e);
        }
        }

        async function onIceCandidate(pc, event) {
        try {
            await (getOtherPc(pc).addIceCandidate(event.candidate));
            onAddIceCandidateSuccess(pc);
        } catch (e) {
            onAddIceCandidateError(pc, e);
        }
        console.log(`${getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
        }

        function onAddIceCandidateSuccess(pc) {
        console.log(`${getName(pc)} addIceCandidate success`);
        }

        function onAddIceCandidateError(pc, error) {
        console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
        }

        function onIceStateChange(pc, event) {
        if (pc) {
            console.log(`${getName(pc)} ICE state: ${pc.iceConnectionState}`);
            console.log('ICE state change event: ', event);
        }
        }

        function hangup() {
        console.log('Ending call');
        pc1.close();
        pc2.close();
        pc1 = null;
        pc2 = null;
        hangupButton.disabled = true;
        callButton.disabled = false;
        }
    }, []);

    return (
        <Container fluid>
                <Container className="mt-5 mb-4">
                    <h1>{store.name}</h1>
                </Container>
                <hr className="mt-5 mb-4"></hr>
                <Container>
                    <div className="mt-5">
                        <div className="container">
                        <div id ="video_container" class="align-items-center">
                            <div class="local_div" id="div1">
                            
                            <video id="localVideo" autoplay muted playsinline></video>
                        </div>
                        <div class="remote_div" id="div2">
                           
                            <video id="remoteVideo" autoplay playsinline></video>
                        </div>
                        </div>
                        </div>
                    </div>
                </Container>
        </Container>
    )
}