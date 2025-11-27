const prisma = require("../prismaClient");

const sendFriendRequest = async (req, res) => {
    try {
        const { addresseeId } = req.body;

        if (!addresseeId) {
            return res.status(400).json({ success: false, message: "AddresseeId is required" });
        }

        if (addresseeId === req.user.id) {
            return res.status(400).json({ success: false, message: "Cannot send friend request to yourself" });
        }

        const addressee = await prisma.user.findUnique({
            where: { id: parseInt(addresseeId) },
        });

        if (!addressee) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: req.user.id, addresseeId: parseInt(addresseeId) },
                    { requesterId: parseInt(addresseeId), addresseeId: req.user.id },
                ],
            },
        });

        if (existingFriendship) {
            return res.status(400).json({
                success: false,
                message: "Friendship request already exists",
            });
        }

        const friendship = await prisma.friendship.create({
            data: {
                requesterId: req.user.id,
                addresseeId: parseInt(addresseeId),
            },
            include: {
                addressee: {
                    select: { id: true, username: true, avatar: true },
                },
            },
        });

        return res.status(201).json({
            success: true,
            message: "Friend request sent",
            data: friendship,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const respondToRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body;

        if (!action || !["ACCEPTED", "REJECTED", "BLOCKED"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Valid action is required (ACCEPTED, REJECTED, BLOCKED)",
            });
        }

        const friendship = await prisma.friendship.findUnique({
            where: { id: parseInt(id) },
        });

        if (!friendship) {
            return res.status(404).json({ success: false, message: "Friend request not found" });
        }

        if (friendship.addresseeId !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const updatedFriendship = await prisma.friendship.update({
            where: { id: parseInt(id) },
            data: { status: action },
            include: {
                requester: {
                    select: { id: true, username: true, avatar: true },
                },
            },
        });

        return res.status(200).json({
            success: true,
            message: `Friend request ${action.toLowerCase()}`,
            data: updatedFriendship,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getFriends = async (req, res) => {
    try {
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    { requesterId: req.user.id, status: "ACCEPTED" },
                    { addresseeId: req.user.id, status: "ACCEPTED" },
                ],
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        avatar: true,
                        dualsCrowns: true,
                        havocCrowns: true,
                    },
                },
                addressee: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        avatar: true,
                        dualsCrowns: true,
                        havocCrowns: true,
                    },
                },
            },
        });

        const friends = friendships.map((friendship) => {
            const friend =
                friendship.requesterId === req.user.id ? friendship.addressee : friendship.requester;
            return {
                friendshipId: friendship.id,
                ...friend,
            };
        });

        return res.status(200).json({ success: true, data: friends });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getPendingRequests = async (req, res) => {
    try {
        const sent = await prisma.friendship.findMany({
            where: {
                requesterId: req.user.id,
                status: "PENDING",
            },
            include: {
                addressee: {
                    select: { id: true, username: true, avatar: true },
                },
            },
        });

        const received = await prisma.friendship.findMany({
            where: {
                addresseeId: req.user.id,
                status: "PENDING",
            },
            include: {
                requester: {
                    select: { id: true, username: true, avatar: true },
                },
            },
        });

        return res.status(200).json({
            success: true,
            data: { sent, received },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const removeFriend = async (req, res) => {
    try {
        const { id } = req.params;

        const friendship = await prisma.friendship.findUnique({
            where: { id: parseInt(id) },
        });

        if (!friendship) {
            return res.status(404).json({ success: false, message: "Friendship not found" });
        }

        if (friendship.requesterId !== req.user.id && friendship.addresseeId !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        await prisma.friendship.delete({
            where: { id: parseInt(id) },
        });

        return res.status(200).json({
            success: true,
            message: "Friend removed successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const blockUser = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "UserId is required" });
        }

        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: req.user.id, addresseeId: parseInt(userId) },
                    { requesterId: parseInt(userId), addresseeId: req.user.id },
                ],
            },
        });

        if (existingFriendship) {
            await prisma.friendship.update({
                where: { id: existingFriendship.id },
                data: { status: "BLOCKED" },
            });
        } else {
            await prisma.friendship.create({
                data: {
                    requesterId: req.user.id,
                    addresseeId: parseInt(userId),
                    status: "BLOCKED",
                },
            });
        }

        return res.status(200).json({
            success: true,
            message: "User blocked successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    sendFriendRequest,
    respondToRequest,
    getFriends,
    getPendingRequests,
    removeFriend,
    blockUser,
};
