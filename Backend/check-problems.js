require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProblems() {
    const problems = await prisma.problem.findMany({
        include: {
            testCases: true
        }
    });

    console.log(`Total problems in database: ${problems.length}`);
    problems.forEach(p => {
        console.log(`- ${p.title}: ${p.testCases.length} test cases, isPublic: ${p.isPublic}`);
    });

    await prisma.$disconnect();
}

checkProblems();
