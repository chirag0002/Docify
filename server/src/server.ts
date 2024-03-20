import http from "http";
import app from './index'
import { Server, Socket } from "socket.io";
import { VerifyErrors, verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
const PORT = process.env.PORT || 8081
const server = http.createServer(app)

enum SocketEvents {
    SEND_CHANGES = "send-changes",
    RECEIVE_CHANGES = "receive-changes",
    CURRENT_USERS_UPDATE = "current-users-update"
}

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: "*"
    }
})

io.on('connection', (socket) => {

    console.log('a user connected')

    const accessToken = socket.handshake.query.accessToken as string | undefined;
    const documentId = socket.handshake.query.documentId as string | undefined;

    if (!accessToken || !documentId) return socket.disconnect()

    verify(accessToken, process.env.ACCESS_KEY,
        (err: VerifyErrors | null, decoded: any) => {
            if (err) return socket.disconnect()
            const { id, email }: { id: string, email: string } = decoded;
            (socket as any).email = email
            prisma.document.findFirst({
                where: {
                    id: Number(documentId),
                    OR: [
                        { userId: decoded.id },
                        { documentUsers: { some: { userId: decoded.id } } }
                    ]
                }
            }).then(doc => {
                if (!doc) return socket.disconnect()
                socket.join(documentId)

                socket.on("content", (data) => {
                    socket.to(documentId).emit("receive-content", data)
                })

                socket.on("mouse-move", (data) => {
                    const userEmail = (socket as any).email;
                    socket.to(documentId).emit("mouse-move", {data, userEmail});
                });

                io.in(documentId).fetchSockets().then((clients) => {
                    io.sockets.in(documentId).emit("send_emails", clients.map((client) => (client as any).email)
                    );
                });
            })

        })

    socket.on("disconnect", () => {
        console.log("disconnected")
    })
});

server.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
})