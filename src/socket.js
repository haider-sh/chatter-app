import { io } from "socket.io-client";

const URL = "https://chatter-backend-production-1d5f.up.railway.app/";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected. Reason:', reason);
});

socket.on("session", ({ sessionID, userID }) => {
  socket.auth = { sessionID };

  localStorage.setItem("sessionID", sessionID);

  socket.userID = userID;
});

const sessionID = localStorage.getItem("sessionID");
if (sessionID) {
  socket.auth = { sessionID };
  console.log("connecting...");
  socket.connect();
}

export default socket;