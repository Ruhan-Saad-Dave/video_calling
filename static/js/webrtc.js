import { update_user_list } from './ui.js';
import { getUsername } from './auth.js';

const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const peerUsernameInput = document.getElementById('peer-username');

let localStream;
let peerConnection;
let websocket;
let iceCandidatesQueue = [];

export function startWebsocket(username) {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    websocket = new WebSocket(`${wsProtocol}${window.location.host}/ws/${username}`);
    websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        switch (message.type) {
            case 'users':
                update_user_list(message.data, getUsername());
                break;
            case 'signal':
                handleSignaling(message.sender, message.data);
                break;
        }
    };
}

export function startLocalVideo() {
    const constraints = {
        video: true,
        audio: true
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            localVideo.srcObject = stream;
            localStream = stream;
        })
        .catch(error => {
            console.error('Error accessing media devices:', error);
            if (error.name === 'NotAllowedError') {
                alert('Permission to access camera/microphone denied. Please allow access in your browser settings.');
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                alert('No camera or microphone found. Please ensure they are connected and enabled.');
            } else if (error.name === 'AbortError') {
                alert('Camera/microphone access timed out or was aborted. Another application might be using it.');
            } else {
                alert(`An unknown error occurred while accessing media devices: ${error.message}`);
            }
        });
}

export function createPeerConnection() {
    peerConnection = new RTCPeerConnection();
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            sendSignal(peerUsernameInput.value, { 'ice': event.candidate });
        }
    };
    peerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };
    if (localStream) {
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    } else {
        console.warn('Local stream not available when creating peer connection.');
    }
}

export function handleSignaling(sender, data) {
    if (data.sdp) {
        if (!peerConnection) {
            createPeerConnection();
        }
        peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp))
            .then(() => {
                // Process any queued ICE candidates after remote description is set
                while (iceCandidatesQueue.length > 0) {
                    peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidatesQueue.shift()));
                }
                if (data.sdp.type === 'offer') {
                    peerConnection.createAnswer()
                        .then(answer => peerConnection.setLocalDescription(answer))
                        .then(() => {
                            sendSignal(sender, { 'sdp': peerConnection.localDescription });
                        });
                }
            });
    } else if (data.ice) {
        if (peerConnection && peerConnection.remoteDescription) {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.ice));
        } else {
            iceCandidatesQueue.push(data.ice);
        }
    }
}

export function sendSignal(peer, data) {
    websocket.send(JSON.stringify({ 'type': 'signal', 'peer': peer, 'data': data }));
}

export function getPeerConnection() {
    return peerConnection;
}

export function closePeerConnection() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
        remoteVideo.srcObject = null;
    }
}
