const prisma = require("../prismaClient");
const axios = require("axios");

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

const submitCode = async (req, res) => {
    try {
        const { problemId, battleId, code, languageId } = req.body;

        if (!problemId || !code || !languageId) {
            return res.status(400).json({
                success: false,
                message: "ProblemId, code, and languageId are required",
            });
        }

        const problem = await prisma.problem.findUnique({
            where: { id: parseInt(problemId) },
            include: {
                testCases: {
                    orderBy: { orderIndex: "asc" },
                },
            },
        });

        if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }

        if (battleId) {
            const participant = await prisma.battleParticipant.findFirst({
                where: {
                    userId: req.user.id,
                    battleId: parseInt(battleId),
                },
                include: { battle: true },
            });

            if (!participant) {
                return res.status(403).json({ success: false, message: "Not a participant in this battle" });
            }

            if (participant.battle.status !== "ACTIVE") {
                return res.status(400).json({ success: false, message: "Battle is not active" });
            }
        }

        const submission = await prisma.submission.create({
            data: {
                userId: req.user.id,
                problemId: parseInt(problemId),
                battleId: battleId ? parseInt(battleId) : null,
                code,
                languageId: parseInt(languageId),
                totalTestCases: problem.testCases.length,
            },
        });

        runTestCases(
            submission.id,
            code,
            languageId,
            problem.testCases,
            problem.timeLimit,
            problem.memoryLimit
        ).catch(console.error);

        return res.status(201).json({
            success: true,
            message: "Submission created and being processed",
            data: { submissionId: submission.id },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

async function runTestCases(submissionId, code, languageId, testCases, timeLimit, memoryLimit) {
    try {
        const testResults = [];
        let passedCount = 0;
        let totalScore = 0;
        let maxTime = 0;
        let maxMemory = 0;

        for (const testCase of testCases) {
            try {
                const submissionResponse = await axios.post(
                    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
                    {
                        source_code: code,
                        language_id: parseInt(languageId),
                        stdin: testCase.input,
                        expected_output: testCase.output,
                        cpu_time_limit: timeLimit / 1000,
                        memory_limit: memoryLimit,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-RapidAPI-Key": RAPIDAPI_KEY,
                            "X-RapidAPI-Host": RAPIDAPI_HOST,
                        },
                    }
                );

                const token = submissionResponse.data.token;

                let result = null;
                let attempts = 0;
                while ((!result || !result.status || result.status.id < 3) && attempts < 20) {
                    await new Promise((resolve) => setTimeout(resolve, 500));

                    const checkResponse = await axios.get(
                        `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
                        {
                            headers: {
                                "X-RapidAPI-Key": RAPIDAPI_KEY,
                                "X-RapidAPI-Host": RAPIDAPI_HOST,
                            },
                        }
                    );

                    result = checkResponse.data;
                    attempts++;
                }

                const passed = result.status.id === 3;
                if (passed) {
                    passedCount++;
                    totalScore += testCase.points;
                }

                testResults.push({
                    testCaseId: testCase.id,
                    passed,
                    statusId: result.status.id,
                    statusDescription: result.status.description,
                    time: result.time,
                    memory: result.memory,
                });

                if (result.time) maxTime = Math.max(maxTime, parseFloat(result.time));
                if (result.memory) maxMemory = Math.max(maxMemory, parseInt(result.memory));

                if (!passed && !testCase.isSample) {
                    break;
                }
            } catch (error) {
                console.error("Error running test case:", error);
                testResults.push({
                    testCaseId: testCase.id,
                    passed: false,
                    error: "Execution error",
                });
            }
        }

        const allPassed = passedCount === testCases.length;
        const finalStatus = allPassed ? "ACCEPTED" : "WRONG_ANSWER";

        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status: finalStatus,
                passedTestCases: passedCount,
                score: totalScore,
                executionTime: maxTime,
                memoryUsed: maxMemory,
                testResults: JSON.stringify(testResults),
            },
        });

        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
        });

        if (submission.battleId && allPassed) {
            await prisma.battleParticipant.updateMany({
                where: {
                    userId: submission.userId,
                    battleId: submission.battleId,
                },
                data: {
                    score: { increment: totalScore },
                    hasCompleted: true,
                },
            });
        }
    } catch (error) {
        console.error("Error in runTestCases:", error);
        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status: "INTERNAL_ERROR",
                errorMessage: error.message,
            },
        });
    }
}

const getSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const submission = await prisma.submission.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                status: true,
                score: true,
                passedTestCases: true,
                totalTestCases: true,
                executionTime: true,
                memoryUsed: true,
                submittedAt: true,
            },
        });

        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        return res.status(200).json({ success: true, data: submission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;

        const submission = await prisma.submission.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: { id: true, username: true, avatar: true },
                },
                problem: {
                    select: { id: true, title: true, difficulty: true },
                },
                battle: {
                    select: { id: true, type: true, mode: true },
                },
            },
        });

        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        if (submission.testResults) {
            submission.testResults = JSON.parse(submission.testResults);
        }

        return res.status(200).json({ success: true, data: submission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getUserSubmissions = async (req, res) => {
    try {
        const { userId } = req.params;
        const { problemId, status, page = 1, limit = 20 } = req.query;

        const where = { userId: parseInt(userId) };
        if (problemId) where.problemId = parseInt(problemId);
        if (status) where.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [submissions, total] = await Promise.all([
            prisma.submission.findMany({
                where,
                include: {
                    problem: {
                        select: { id: true, title: true, difficulty: true },
                    },
                },
                skip,
                take: parseInt(limit),
                orderBy: { submittedAt: "desc" },
            }),
            prisma.submission.count({ where }),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                submissions,
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

const getBattleSubmissions = async (req, res) => {
    try {
        const { battleId } = req.params;

        const submissions = await prisma.submission.findMany({
            where: { battleId: parseInt(battleId) },
            include: {
                user: {
                    select: { id: true, username: true, avatar: true },
                },
            },
            orderBy: { submittedAt: "desc" },
        });

        return res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    submitCode,
    getSubmissionStatus,
    getSubmissionById,
    getUserSubmissions,
    getBattleSubmissions,
};
