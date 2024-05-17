let http = require("http"); // Import the http module
let socket_io = require("socket.io"); // Import the socket.io module
let express = require("express"); // Import the express module
const uuid = require("uuid"); // Import the uuid module
const fs = require('fs') // Import the fs module

let app = express(); // Create a new express app
app.use(express.static("public")); // Serve the public directory
let server = http.createServer(app); // Create a new http server
let io = new socket_io.Server(server); // Create a new socket.io server

io.on("connection", (socket) => {}); // On connection event => handle the connection

app.get("/", (req, res) => {res.sendFile(__dirname + "index.html");}); // Get request to the root => send the index.html file
server.listen(8004); // Listen on port 8004
console.log("Server running on port 8004."); // Log that the server is running on port 8004.