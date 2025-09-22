Your job is to create a video calling system using only python. Note that this system will be hosted. The user should be able to login, and make video call to other user they select. make sure that the video will work in low latency. If you need any thing like api keys do tell.

---

## Work Completed on Video Calling System:

This section details the work performed to create the Python-based video calling system:

### 1. Initial Setup & Project Structure:
*   Created the foundational project directory structure, separating backend (`server/`) and frontend (`static/`) components.
*   Initialized a basic FastAPI server and corresponding HTML, CSS, and JavaScript files.

### 2. Core Functionality Implementation:
*   **WebRTC Signaling Server:** Developed a real-time signaling server using FastAPI's WebSocket capabilities to facilitate WebRTC connection establishment between peers.
*   **Client-Side WebRTC Logic:** Implemented comprehensive JavaScript logic for:
    *   Capturing local audio and video streams (`getUserMedia`).
    *   Creating and managing `RTCPeerConnection` objects.
    *   Handling the exchange of Session Description Protocol (SDP) offers and answers.
    *   Managing Interactive Connectivity Establishment (ICE) candidates for NAT traversal.
*   **User Authentication:**
    *   Integrated a user registration and login system.
    *   Implemented secure password hashing using `passlib` with the `bcrypt` algorithm.
    *   Utilized an SQLite database (`users.db`) for storing user credentials.
*   **Online User List:** Developed functionality to display a real-time list of currently connected users, allowing for easy selection of a peer to call.
*   **Call Management:** Added features for initiating and gracefully ending video calls.

### 3. Refinements & Bug Fixes:
*   **Static File Serving:** Corrected file paths and server configuration to ensure proper serving of CSS, JavaScript, and other static assets.
*   **Database Integration:** Resolved import errors and ensured reliable database interaction for user management.
*   **Dependency Compatibility:** Addressed and fixed compatibility issues between `passlib` and `bcrypt` libraries.
*   **WebRTC Stability:** Implemented an ICE candidate queuing mechanism to prevent `InvalidStateError` (remote description null) during connection setup, significantly improving call establishment reliability.
*   **Media Device Access:** Enhanced `getUserMedia` error handling with more flexible media constraints and informative alerts, particularly beneficial for virtual webcam setups (e.g., DroidCam).
*   **Code Organization:** Modularized frontend JavaScript code into `auth.js`, `webrtc.js`, and `ui.js` for improved readability and maintainability.
