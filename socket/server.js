import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer();

const onlineUsers = new Map()

const io = new Server(server, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== 'undefined' && userId !== 'null') {
        onlineUsers.set(userId, socket.id);
    } else {
        console.error("Connection attempted without required userId query parameter.");
        socket.disconnect();
        return;
    }

    // socket.on('join_room', (roomId) => {
    //     socket.join(roomId)
    // })

    socket.on('send_message', (data) => {
        const { to, message, conversationid } = data
        const receiverSocketId = onlineUsers.get(to)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receive_message', {
                from: userId,
                message,
                conversationid
            })
        }
    })

    socket.on("disconnect", () => {
        onlineUsers.delete(userId)
    });
});

server.listen(4000, () => {
    console.log("Socket.IO running on http://localhost:4000");
});
