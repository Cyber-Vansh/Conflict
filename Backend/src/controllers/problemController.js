const prisma = require("../prismaClient");

const getAllProblems = async (req, res) => {
    try {
        const { difficulty, isPublic, tags, page = 1, limit = 20 } = req.query;

        const where = {};
        if (difficulty) where.difficulty = difficulty;
        if (isPublic !== undefined) where.isPublic = isPublic === "true";
        if (tags) where.tags = { contains: tags };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [problems, total] = await Promise.all([
            prisma.problem.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    difficulty: true,
                    tags: true,
                    isPublic: true,
                    author: {
                        select: { id: true, username: true },
                    },
                    createdAt: true,
                },
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: "desc" },
            }),
            prisma.problem.count({ where }),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                problems,
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

const getProblemById = async (req, res) => {
    try {
        const { id } = req.params;
        const { includeHidden } = req.query;

        const problem = await prisma.problem.findUnique({
            where: { id: parseInt(id) },
            include: {
                testCases: {
                    where: includeHidden === "true" ? {} : { isSample: true },
                    orderBy: { orderIndex: "asc" },
                    select: {
                        id: true,
                        input: true,
                        output: true,
                        isSample: true,
                        points: true,
                    },
                },
                author: {
                    select: { id: true, username: true, avatar: true },
                },
            },
        });

        if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }

        return res.status(200).json({ success: true, data: problem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getRandomProblem = async (req, res) => {
    try {
        const { difficulty, isPublic = "true" } = req.query;

        const where = { isPublic: isPublic === "true" };
        if (difficulty) where.difficulty = difficulty;

        const count = await prisma.problem.count({ where });
        if (count === 0) {
            return res.status(404).json({ success: false, message: "No problems found" });
        }

        const skip = Math.floor(Math.random() * count);

        const problem = await prisma.problem.findFirst({
            where,
            skip,
            include: {
                testCases: {
                    where: { isSample: true },
                    orderBy: { orderIndex: "asc" },
                },
                author: {
                    select: { username: true },
                },
            },
        });

        return res.status(200).json({ success: true, data: problem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const createProblem = async (req, res) => {
    try {
        const {
            title,
            description,
            difficulty,
            timeLimit,
            memoryLimit,
            codeTemplates,
            isPublic,
            tags,
            testCases,
        } = req.body;

        if (!title || !description || !difficulty || !testCases || testCases.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Title, description, difficulty, and test cases are required",
            });
        }

        const problem = await prisma.problem.create({
            data: {
                title,
                description,
                difficulty,
                timeLimit: timeLimit || 2000,
                memoryLimit: memoryLimit || 256000,
                codeTemplates,
                isPublic: isPublic !== undefined ? isPublic : true,
                tags,
                authorId: req.user.id,
                testCases: {
                    create: testCases.map((tc, index) => ({
                        input: tc.input,
                        output: tc.output,
                        isSample: tc.isSample || false,
                        points: tc.points || 1,
                        orderIndex: index,
                    })),
                },
            },
            include: {
                testCases: true,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            data: problem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            difficulty,
            timeLimit,
            memoryLimit,
            codeTemplates,
            isPublic,
            tags,
            testCases,
        } = req.body;

        const existingProblem = await prisma.problem.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingProblem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }

        if (existingProblem.authorId !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (difficulty) updateData.difficulty = difficulty;
        if (timeLimit) updateData.timeLimit = timeLimit;
        if (memoryLimit) updateData.memoryLimit = memoryLimit;
        if (codeTemplates !== undefined) updateData.codeTemplates = codeTemplates;
        if (isPublic !== undefined) updateData.isPublic = isPublic;
        if (tags !== undefined) updateData.tags = tags;

        if (testCases) {
            await prisma.testCase.deleteMany({
                where: { problemId: parseInt(id) },
            });

            updateData.testCases = {
                create: testCases.map((tc, index) => ({
                    input: tc.input,
                    output: tc.output,
                    isSample: tc.isSample || false,
                    points: tc.points || 1,
                    orderIndex: index,
                })),
            };
        }

        const problem = await prisma.problem.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: { testCases: true },
        });

        return res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            data: problem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await prisma.problem.findUnique({
            where: { id: parseInt(id) },
        });

        if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }

        if (problem.authorId !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        await prisma.problem.delete({
            where: { id: parseInt(id) },
        });

        return res.status(200).json({
            success: true,
            message: "Problem deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    getAllProblems,
    getProblemById,
    getRandomProblem,
    createProblem,
    updateProblem,
    deleteProblem,
};
