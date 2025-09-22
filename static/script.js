import { initAuth } from './js/auth.js';
import { createPeerConnection, sendSignal, closePeerConnection, getPeerConnection } from './js/webrtc.js';

const callBtn = document.getElementById('call-btn');
const hangupBtn = document.getElementById('hangup-btn');
const peerUsernameInput = document.getElementById('peer-username');

initAuth();

callBtn.addEventListener('click', () => {
    const peerUsername = peerUsernameInput.value;
    if (peerUsername) {
        createPeerConnection();
        getPeerConnection().createOffer()
            .then(offer => getPeerConnection().setLocalDescription(offer))
            .then(() => {
                sendSignal(peerUsername, { 'sdp': getPeerConnection().localDescription });
            });
    }
});

hangupBtn.addEventListener('click', () => {
    closePeerConnection();
});
