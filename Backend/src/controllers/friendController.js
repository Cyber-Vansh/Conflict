const prisma = require("../prismaClient");

const sendRequest = async (req, res) => {
    try {
        const { userId } = req.body;
        const requesterId = req.user.id;

        if (userId === requesterId) {
            return res.status(400).json({ message: "Cannot send request to yourself" });
        }

        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId, addresseeId: userId },
                    { requesterId: userId, addresseeId: requesterId },
                ],
            },
        });

        if (existingFriendship) {
            return res.status(400).json({ message: "Friendship or request already exists" });
        }

        await prisma.friendship.create({
            data: {
                requesterId,
                addresseeId: userId,
                status: "PENDING",
            },
        });

        res.status(200).json({ success: true, message: "Friend request sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const acceptRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user.id;

        const friendship = await prisma.friendship.findUnique({
            where: { id: requestId },
        });

        if (!friendship || friendship.addresseeId !== userId) {
            return res.status(404).json({ message: "Request not found" });
        }

        await prisma.friendship.update({
            where: { id: requestId },
            data: { status: "ACCEPTED" },
        });

        res.status(200).json({ success: true, message: "Friend request accepted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const rejectRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user.id;

        const friendship = await prisma.friendship.findUnique({
            where: { id: requestId },
        });

        if (!friendship || friendship.addresseeId !== userId) {
            return res.status(404).json({ message: "Request not found" });
        }

        await prisma.friendship.update({
            where: { id: requestId },
            data: { status: "REJECTED" },
        });

        res.status(200).json({ success: true, message: "Friend request rejected" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getFriends = async (req, res) => {
    try {
        const userId = req.user.id;

        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    { requesterId: userId, status: "ACCEPTED" },
                    { addresseeId: userId, status: "ACCEPTED" },
                ],
            },
            include: {
                requester: { select: { id: true, username: true, avatar: true, fullName: true } },
                addressee: { select: { id: true, username: true, avatar: true, fullName: true } },
            },
        });

        const friends = friendships.map((f) =>
            f.requesterId === userId ? f.addressee : f.requester
        );

        res.status(200).json({ success: true, data: friends });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const requests = await prisma.friendship.findMany({
            where: {
                addresseeId: userId,
                status: "PENDING",
            },
            include: {
                requester: { select: { id: true, username: true, avatar: true, fullName: true } },
            },
        });

        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        const userId = req.user.id;

        if (!q) {
            return res.status(400).json({ message: "Query parameter 'q' is required" });
        }

        const users = await prisma.user.findMany({
            where: {
                username: {
                    contains: q,
                },
                NOT: {
                    id: userId,
                },
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
            },
            take: 10,
        });

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const removeFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const userId = req.user.id;

        const friendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: userId, addresseeId: friendId },
                    { requesterId: friendId, addresseeId: userId },
                ],
                status: "ACCEPTED"
            },
        });

        if (!friendship) {
            return res.status(404).json({ message: "Friendship not found" });
        }

        await prisma.friendship.delete({
            where: { id: friendship.id },
        });

        res.status(200).json({ success: true, message: "Friend removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    sendRequest,
    acceptRequest,
    rejectRequest,
    getFriends,
    getRequests,
    searchUsers,
    removeFriend,
};
