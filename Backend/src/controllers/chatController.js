const prisma = require("../prismaClient");

const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const friendId = parseInt(req.params.friendId);

        if (!friendId) {
            return res.status(400).json({ message: "Friend ID is required" });
        }

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: friendId },
                    { senderId: friendId, receiverId: userId },
                ],
            },
            orderBy: { createdAt: "asc" },
        });

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    getMessages,
};
