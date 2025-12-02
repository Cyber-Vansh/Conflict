const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("join_battle", (battleId) => {
            socket.join(`battle_${battleId}`);
            console.log(`Socket ${socket.id} joined battle_${battleId}`);
        });

        socket.on("leave_battle", (battleId) => {
            socket.leave(`battle_${battleId}`);
            console.log(`Socket ${socket.id} left battle_${battleId}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });

        // Chat Events
        socket.on("join_chat", (userId) => {
            socket.join(`user_${userId}`);
            console.log(`Socket ${socket.id} joined user_${userId}`);
        });

        socket.on("private_message", async (data) => {
            const { senderId, receiverId, content } = data;

            // Save message to database
            try {
                const prisma = require("./prismaClient");
                const message = await prisma.message.create({
                    data: {
                        senderId,
                        receiverId,
                        content,
                        read: false
                    },
                    include: {
                        sender: { select: { id: true, username: true, avatar: true } }
                    }
                });

                io.to(`user_${receiverId}`).emit("receive_message", message);
                io.to(`user_${senderId}`).emit("message_sent", message);
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initSocket, getIO };
