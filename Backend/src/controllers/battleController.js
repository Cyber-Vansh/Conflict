const prisma = require("../prismaClient");

const createBattle = async (req, res) => {
    try {
        const { type, mode, problemId, duration, maxPlayers } = req.body;

        if (!type || !mode || !problemId || !duration) {
            return res.status(400).json({
                success: false,
                message: "Type, mode, problemId, and duration are required",
            });
        }

        const problem = await prisma.problem.findUnique({
            where: { id: parseInt(problemId) },
        });

        if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }

        const battle = await prisma.battle.create({
            data: {
                type,
                mode,
                problemId: parseInt(problemId),
                duration: parseInt(duration),
                maxPlayers: maxPlayers || (type === "DUALS" ? 2 : 10),
                participants: {
                    create: {
                        userId: req.user.id,
                    },
                },
            },
            include: {
                problem: {
                    select: { id: true, title: true, difficulty: true },
                },
                participants: {
                    include: {
                        user: {
                            select: { id: true, username: true, avatar: true },
                        },
                    },
                },
            },
        });

        return res.status(201).json({
            success: true,
            message: "Battle created successfully",
            data: battle,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getActiveBattles = async (req, res) => {
    try {
        const { type, mode, status = "WAITING" } = req.query;

        const where = {};
        if (type) where.type = type;
        if (mode) where.mode = mode;
        if (status) where.status = status;

        const battles = await prisma.battle.findMany({
            where,
            include: {
                problem: {
                    select: { id: true, title: true, difficulty: true },
                },
                participants: {
                    include: {
                        user: {
                            select: { id: true, username: true, avatar: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        return res.status(200).json({ success: true, data: battles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getBattleById = async (req, res) => {
    try {
        const { id } = req.params;

        const battle = await prisma.battle.findUnique({
            where: { id: parseInt(id) },
            include: {
                problem: {
                    include: {
                        testCases: {
                            where: { isSample: true },
                            orderBy: { id: "asc" },
                        },
                    },
                },
                participants: {
                    include: {
                        user: {
                            select: { id: true, username: true, avatar: true, dualsCrowns: true, havocCrowns: true },
                        },
                    },
                    orderBy: { score: "desc" },
                },
            },
        });

        if (!battle) {
            return res.status(404).json({ success: false, message: "Battle not found" });
        }

        return res.status(200).json({ success: true, data: battle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const joinBattle = async (req, res) => {
    try {
        const { id } = req.params;

        const battle = await prisma.battle.findUnique({
            where: { id: parseInt(id) },
            include: {
                participants: true,
            },
        });

        if (!battle) {
            return res.status(404).json({ success: false, message: "Battle not found" });
        }

        if (battle.status !== "WAITING") {
            return res.status(400).json({ success: false, message: "Battle already started or completed" });
        }

        if (battle.participants.length >= battle.maxPlayers) {
            return res.status(400).json({ success: false, message: "Battle is full" });
        }

        const existingParticipant = battle.participants.find((p) => p.userId === req.user.id);
        if (existingParticipant) {
            return res.status(400).json({ success: false, message: "Already joined this battle" });
        }

        const participant = await prisma.battleParticipant.create({
            data: {
                userId: req.user.id,
                battleId: parseInt(id),
            },
            include: {
                user: {
                    select: { id: true, username: true, avatar: true },
                },
            },
        });

        return res.status(200).json({
            success: true,
            message: "Joined battle successfully",
            data: participant,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const startBattle = async (req, res) => {
    try {
        const { id } = req.params;

        const battle = await prisma.battle.findUnique({
            where: { id: parseInt(id) },
            include: { participants: true },
        });

        if (!battle) {
            return res.status(404).json({ success: false, message: "Battle not found" });
        }

        if (battle.status !== "WAITING") {
            return res.status(400).json({ success: false, message: "Battle already started or completed" });
        }

        if (battle.participants.length < 2) {
            return res.status(400).json({ success: false, message: "Not enough participants" });
        }

        const updatedBattle = await prisma.battle.update({
            where: { id: parseInt(id) },
            data: {
                status: "ACTIVE",
                startTime: new Date(),
                endTime: new Date(Date.now() + battle.duration * 1000),
            },
            include: {
                problem: true,
                participants: {
                    include: {
                        user: {
                            select: { id: true, username: true, avatar: true },
                        },
                    },
                },
            },
        });

        return res.status(200).json({
            success: true,
            message: "Battle started",
            data: updatedBattle,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const endBattle = async (req, res) => {
    try {
        const { id } = req.params;

        const battle = await prisma.battle.findUnique({
            where: { id: parseInt(id) },
            include: {
                participants: {
                    include: {
                        user: true,
                    },
                    orderBy: { score: "desc" },
                },
            },
        });

        if (!battle) {
            return res.status(404).json({ success: false, message: "Battle not found" });
        }

        if (battle.status !== "ACTIVE") {
            return res.status(400).json({ success: false, message: "Battle is not active" });
        }

        const rankedParticipants = battle.participants.map((p, index) => ({
            id: p.id,
            rank: index + 1,
            userId: p.userId,
            score: p.score,
        }));

        const crownChanges = calculateCrownChanges(rankedParticipants, battle.type, battle.mode);

        await prisma.$transaction(async (tx) => {
            for (let i = 0; i < rankedParticipants.length; i++) {
                const participant = rankedParticipants[i];
                const crownChange = crownChanges[i];

                await tx.battleParticipant.update({
                    where: { id: participant.id },
                    data: {
                        rank: participant.rank,
                        crownChange,
                    },
                });

                if (battle.mode === "RANKED") {
                    const crownField = battle.type === "DUALS" ? "dualsCrowns" : "havocCrowns";
                    await tx.user.update({
                        where: { id: participant.userId },
                        data: {
                            [crownField]: { increment: crownChange },
                            totalBattles: { increment: 1 },
                            wins: participant.rank === 1 ? { increment: 1 } : undefined,
                            losses: participant.rank > 1 ? { increment: 1 } : undefined,
                        },
                    });
                }
            }

            await tx.battle.update({
                where: { id: parseInt(id) },
                data: {
                    status: "COMPLETED",
                    endTime: new Date(),
                },
            });
        });

        const updatedBattle = await prisma.battle.findUnique({
            where: { id: parseInt(id) },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, username: true, avatar: true, dualsCrowns: true, havocCrowns: true },
                        },
                    },
                    orderBy: { rank: "asc" },
                },
            },
        });

        return res.status(200).json({
            success: true,
            message: "Battle ended",
            data: updatedBattle,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

function calculateCrownChanges(participants, battleType, battleMode) {
    if (battleMode !== "RANKED") {
        return participants.map(() => 0);
    }

    const changes = [];
    const numParticipants = participants.length;

    for (let i = 0; i < numParticipants; i++) {
        const rank = i + 1;
        let change = 0;

        if (battleType === "DUALS") {
            if (rank === 1) {
                change = 25;
            } else {
                change = -15;
            }
        } else {
            if (rank === 1) {
                change = 30;
            } else if (rank === 2) {
                change = 10;
            } else if (rank === 3) {
                change = 0;
            } else {
                change = -10;
            }
        }

        changes.push(change);
    }

    return changes;
}

const leaveBattle = async (req, res) => {
    try {
        const { id } = req.params;

        const battle = await prisma.battle.findUnique({
            where: { id: parseInt(id) },
        });

        if (!battle) {
            return res.status(404).json({ success: false, message: "Battle not found" });
        }

        if (battle.status !== "WAITING") {
            return res.status(400).json({ success: false, message: "Cannot leave active or completed battle" });
        }

        await prisma.battleParticipant.deleteMany({
            where: {
                battleId: parseInt(id),
                userId: req.user.id,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Left battle successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getUserBattles = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, type, page = 1, limit = 20 } = req.query;

        const where = { userId: parseInt(userId) };
        const battleWhere = {};
        if (status) battleWhere.status = status;
        if (type) battleWhere.type = type;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [participants, total] = await Promise.all([
            prisma.battleParticipant.findMany({
                where,
                include: {
                    battle: {
                        where: battleWhere,
                        include: {
                            problem: {
                                select: { id: true, title: true, difficulty: true },
                            },
                        },
                    },
                },
                skip,
                take: parseInt(limit),
                orderBy: { joinedAt: "desc" },
            }),
            prisma.battleParticipant.count({ where }),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                battles: participants,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    createBattle,
    getActiveBattles,
    getBattleById,
    joinBattle,
    startBattle,
    endBattle,
    leaveBattle,
    getUserBattles,
};
