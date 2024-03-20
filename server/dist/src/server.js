"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const index_1 = __importDefault(require("./index"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 8081;
const server = http_1.default.createServer(index_1.default);
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["SEND_CHANGES"] = "send-changes";
    SocketEvents["RECEIVE_CHANGES"] = "receive-changes";
    SocketEvents["CURRENT_USERS_UPDATE"] = "current-users-update";
})(SocketEvents || (SocketEvents = {}));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: "*"
    }
});
io.on('connection', (socket) => {
    console.log('a user connected');
    const accessToken = socket.handshake.query.accessToken;
    const documentId = socket.handshake.query.documentId;
    if (!accessToken || !documentId)
        return socket.disconnect();
    (0, jsonwebtoken_1.verify)(accessToken, process.env.ACCESS_KEY, (err, decoded) => {
        if (err)
            return socket.disconnect();
        const { id, email } = decoded;
        socket.email = email;
        prisma.document.findFirst({
            where: {
                id: Number(documentId),
                OR: [
                    { userId: decoded.id },
                    { documentUsers: { some: { userId: decoded.id } } }
                ]
            }
        }).then(doc => {
            if (!doc)
                return socket.disconnect();
            socket.join(documentId);
            socket.on("content", (data) => {
                socket.to(documentId).emit("receive-content", data);
            });
            socket.on("mouse-move", (data) => {
                const userEmail = socket.email;
                socket.to(documentId).emit("mouse-move", { data, userEmail });
            });
            io.in(documentId).fetchSockets().then((clients) => {
                io.sockets.in(documentId).emit("send_emails", clients.map((client) => client.email));
            });
        });
    });
    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});
server.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
});
