const prisma = require("../prismaClient");

const getGlobalLeaderboard = async (req, res) => {
    try {
        const { type = "overall", limit = 100, offset = 0 } = req.query;

        let orderBy = {};
        if (type === "duals") {
            orderBy = { dualsCrowns: "desc" };
        } else if (type === "havoc") {
            orderBy = { havocCrowns: "desc" };
        } else {
            orderBy = [{ dualsCrowns: "desc" }, { havocCrowns: "desc" }];
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
                dualsCrowns: true,
                havocCrowns: true,
                totalBattles: true,
                wins: true,
                losses: true,
            },
            orderBy,
            take: parseInt(limit),
            skip: parseInt(offset),
        });

        if (type === "overall") {
            users.sort((a, b) => {
                const totalA = a.dualsCrowns + a.havocCrowns;
                const totalB = b.dualsCrowns + b.havocCrowns;
                return totalB - totalA;
            });
        }

        const leaderboard = users.map((user, index) => ({
            rank: parseInt(offset) + index + 1,
            ...user,
            totalCrowns: user.dualsCrowns + user.havocCrowns,
        }));

        return res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getFriendsLeaderboard = async (req, res) => {
    try {
        const { type = "overall", limit = 100 } = req.query;

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
                        totalBattles: true,
                        wins: true,
                        losses: true,
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
                        totalBattles: true,
                        wins: true,
                        losses: true,
                    },
                },
            },
        });

        const friendUsers = [];
        friendships.forEach((friendship) => {
            if (friendship.requesterId === req.user.id) {
                friendUsers.push(friendship.addressee);
            } else {
                friendUsers.push(friendship.requester);
            }
        });

        const currentUser = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
                dualsCrowns: true,
                havocCrowns: true,
                totalBattles: true,
                wins: true,
                losses: true,
            },
        });

        friendUsers.push(currentUser);

        if (type === "duals") {
            friendUsers.sort((a, b) => b.dualsCrowns - a.dualsCrowns);
        } else if (type === "havoc") {
            friendUsers.sort((a, b) => b.havocCrowns - a.havocCrowns);
        } else {
            friendUsers.sort((a, b) => {
                const totalA = a.dualsCrowns + a.havocCrowns;
                const totalB = b.dualsCrowns + b.havocCrowns;
                return totalB - totalA;
            });
        }

        const leaderboard = friendUsers.slice(0, parseInt(limit)).map((user, index) => ({
            rank: index + 1,
            ...user,
            totalCrowns: user.dualsCrowns + user.havocCrowns,
        }));

        return res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getUserRank = async (req, res) => {
    try {
        const { userId } = req.params;
        const { type = "overall" } = req.query;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: {
                id: true,
                username: true,
                avatar: true,
                dualsCrowns: true,
                havocCrowns: true,
                totalBattles: true,
                wins: true,
                losses: true,
            },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let rank;
        if (type === "duals") {
            rank = await prisma.user.count({
                where: { dualsCrowns: { gt: user.dualsCrowns } },
            });
        } else if (type === "havoc") {
            rank = await prisma.user.count({
                where: { havocCrowns: { gt: user.havocCrowns } },
            });
        } else {
            const allUsers = await prisma.user.findMany({
                select: { dualsCrowns: true, havocCrowns: true },
            });
            const userTotal = user.dualsCrowns + user.havocCrowns;
            rank = allUsers.filter((u) => u.dualsCrowns + u.havocCrowns > userTotal).length;
        }

        return res.status(200).json({
            success: true,
            data: {
                user,
                rank: rank + 1,
                type,
                totalCrowns: user.dualsCrowns + user.havocCrowns,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    getGlobalLeaderboard,
    getFriendsLeaderboard,
    getUserRank,
};
