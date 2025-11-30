const prisma = require("../prismaClient");
const axios = require("axios");
const { getIO } = require("../socket");

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
                    orderBy: { id: "asc" },
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
            let result = null;
            try {
                const submissionResponse = await axios.post(
                    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
                    {
                        source_code: code,
                        language_id: parseInt(languageId),
                        stdin: testCase.input,
                        cpu_time_limit: timeLimit < 100 ? timeLimit : timeLimit / 1000,
                        memory_limit: memoryLimit * 1024,
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
                let attempts = 0;

                while (attempts < 10) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const resultResponse = await axios.get(
                        `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
                        {
                            headers: {
                                "X-RapidAPI-Key": RAPIDAPI_KEY,
                                "X-RapidAPI-Host": RAPIDAPI_HOST,
                            },
                        }
                    );

                    if (resultResponse.data.status.id !== 1 && resultResponse.data.status.id !== 2) {
                        result = resultResponse.data;
                        break;
                    }
                    attempts++;
                }
            } catch (apiError) {
                throw apiError;
            }

            if (!result) {
                throw new Error("Failed to retrieve submission result");
            }
            const normalize = (str) => (str || "").trim().split(/\s+/).join(" ");

            const actualOutput = (result.stdout || "").trim();
            const expectedOutput = (testCase.output || "").trim();

            const normalizedActual = normalize(actualOutput);
            const normalizedExpected = normalize(expectedOutput);

            const passed = normalizedActual === normalizedExpected;

            const executionSuccess = result.status.id === 3;

            const finalPassed = executionSuccess && passed;

            console.log(`\n--- Test Case ${testCase.id} Debug ---`);
            console.log(`Input:            ${JSON.stringify(testCase.input)}`);
            console.log(`Expected (Raw):   ${JSON.stringify(expectedOutput)}`);
            console.log(`Actual (Raw):     ${JSON.stringify(actualOutput)}`);
            console.log(`Expected (Norm):  ${JSON.stringify(normalizedExpected)}`);
            console.log(`Actual (Norm):    ${JSON.stringify(normalizedActual)}`);
            console.log(`Comparison:       ${normalizedActual === normalizedExpected}`);
            console.log(`Passed Logic:     ${passed}`);
            console.log(`Judge0 Status:    ${result.status.id} (${result.status.description})`);
            console.log(`Final Passed:     ${finalPassed}`);
            console.log(`----------------------------------\n`);

            if (finalPassed) {
                passedCount++;
                totalScore += 10;
            }

            testResults.push({
                testCaseId: testCase.id,
                passed: finalPassed,
                statusId: finalPassed ? 3 : (executionSuccess ? 4 : result.status.id),
                statusDescription: finalPassed ? "Accepted" : (executionSuccess ? "Wrong Answer" : result.status.description),
                time: result.time,
                memory: result.memory,
                actualOutput: actualOutput,
                expectedOutput: expectedOutput,
                debug: {
                    normalizedActual,
                    normalizedExpected
                }
            });

            if (result.time) maxTime = Math.max(maxTime, parseFloat(result.time));
            if (result.memory) maxMemory = Math.max(maxMemory, parseInt(result.memory));

            if (!passed && !testCase.isSample) {
                break;
            }
        }


        const allPassed = passedCount === testCases.length;

        // Determine final status based on test results
        let finalStatus = "ACCEPTED";
        if (!allPassed) {
            const errorPriorities = {
                6: 5,
                13: 4,
                5: 3,
                6: 2,
            };

            let worstStatusId = 4;
            let worstPriority = 0;

            for (const res of testResults) {
                if (!res.passed) {
                    const statusId = res.statusId;
                    let priority = 0;
                    if (statusId === 5) priority = 3;
                    else if (statusId === 6) priority = 5;
                    else if (statusId >= 7 && statusId <= 12) priority = 2;
                    else if (statusId === 13 || statusId === 14) priority = 4;

                    if (priority > worstPriority) {
                        worstPriority = priority;
                        worstStatusId = statusId;
                    }
                }
            }

            if (worstStatusId === 5) finalStatus = "TIME_LIMIT_EXCEEDED";
            else if (worstStatusId === 6) finalStatus = "COMPILATION_ERROR";
            else if (worstStatusId >= 7 && worstStatusId <= 12) finalStatus = "RUNTIME_ERROR";
            else if (worstStatusId === 13) finalStatus = "INTERNAL_ERROR";
            else finalStatus = "WRONG_ANSWER";
        }

        let finalScore = 0;

        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
        });

        if (allPassed && submission.battleId) {
            const battle = await prisma.battle.findUnique({
                where: { id: submission.battleId },
                include: { problem: true }
            });

            if (battle && battle.status === "ACTIVE") {
                const difficultyScores = { "EASY": 500, "MEDIUM": 1000, "HARD": 1500 };
                const maxScore = difficultyScores[battle.problem.difficulty] || 500;

                const timeElapsed = (Date.now() - new Date(battle.startTime).getTime()) / 1000;
                const duration = battle.duration;

                const timeFactor = maxScore * (1 - (timeElapsed / duration) / 2);

                const wrongSubmissions = await prisma.submission.count({
                    where: {
                        userId: submission.userId,
                        battleId: submission.battleId,
                        problemId: submission.problemId,
                        status: { not: "ACCEPTED" },
                        id: { lt: submissionId }
                    }
                });

                const penalty = wrongSubmissions * 50;

                finalScore = Math.max(Math.floor(timeFactor - penalty), 10);
            }
        } else if (allPassed) {
            const problem = await prisma.problem.findUnique({ where: { id: submission.problemId } });
            const difficultyScores = { "EASY": 500, "MEDIUM": 1000, "HARD": 1500 };
            finalScore = difficultyScores[problem.difficulty] || 500;
        }

        const updatedSubmission = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status: finalStatus,
                passedTestCases: passedCount,
                score: finalScore,
                executionTime: maxTime,
                memoryUsed: maxMemory,
                testResults: JSON.stringify(testResults),
            },
        });

        try {
            const io = getIO();
            io.to(`user_${updatedSubmission.userId}`).emit("submission:processed", {
                submissionId: updatedSubmission.id,
                status: finalStatus,
                score: finalScore,
                passedTestCases: passedCount,
                totalTestCases: testCases.length,
                testResults: testResults
            });
        } catch (e) {
            console.error("Socket emit error (submission:processed):", e.message);
        }

        if (submission.battleId && allPassed) {
            await prisma.battleParticipant.updateMany({
                where: {
                    userId: submission.userId,
                    battleId: submission.battleId,
                },
                data: {
                    score: { increment: finalScore },
                    hasCompleted: true,
                },
            });

            try {
                const io = getIO();
                io.to(`battle_${submission.battleId}`).emit("battle:update", {
                    battleId: submission.battleId,
                    type: "score_update",
                    userId: submission.userId,
                    score: finalScore
                });
            } catch (e) {
                console.error("Socket emit error (battle:update):", e.message);
            }
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
