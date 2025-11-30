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
