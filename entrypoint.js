let app = require("./app");
let http = require("http");
require('./database/db') // Connect to database.

// Define a port for the server to listen on
let port = process.env.PORT || 3000;
app.set("port", port);

// Create a server instance
let server = http.createServer(app);

// Make the server listen on a port
server.listen(port);

// Handle errors and success
server.on("error", onError);
server.on("listening", onListening);

function pipeOrPort(address) {
    return typeof address == "string" ? `pipe ${address}` : `port ${address.port}`;
}

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    let bind = pipeOrPort(server.address());

    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges.`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is already in use.`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    let bind = pipeOrPort(server.address());
    console.log(`Listening on ${bind}`);
}