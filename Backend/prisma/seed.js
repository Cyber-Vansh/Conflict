require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    let adminUser = await prisma.user.findUnique({
        where: { username: 'admin' }
    });

    if (!adminUser) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        adminUser = await prisma.user.create({
            data: {
                username: 'admin',
                fullName: 'System Admin',
                email: 'admin@conflict.com',
                password: hashedPassword,
                bio: 'System Administrator'
            }
        });
        console.log('Created admin user');
    } else {
        console.log('Admin user already exists');
    }

    const problems = [
        {
            title: "A+B Problem",
            description: `You are given two integers A and B. Calculate and print their sum.

**Input Format:**
First line contains two space-separated integers A and B.

**Output Format:**
Print a single integer - the sum of A and B.

**Constraints:**
-10^9 ≤ A, B ≤ 10^9`,
            difficulty: "EASY",
            isPublic: true,
            timeLimit: 1,
            memoryLimit: 64,
            testCases: [
                { input: "5 3", output: "8", isSample: true },
                { input: "10 20", output: "30", isSample: true },
                { input: "-5 3", output: "-2", isSample: false },
                { input: "0 0", output: "0", isSample: false },
                { input: "1000000000 1000000000", output: "2000000000", isSample: false }
            ]
        },
        {
            title: "Even or Odd",
            description: `Given an integer N, determine whether it is even or odd.

**Input Format:**
Single integer N.

**Output Format:**
Print "Even" if N is even, otherwise print "Odd".

**Constraints:**
-10^9 ≤ N ≤ 10^9`,
            difficulty: "EASY",
            isPublic: true,
            timeLimit: 1,
            memoryLimit: 64,
            testCases: [
                { input: "4", output: "Even", isSample: true },
                { input: "7", output: "Odd", isSample: true },
                { input: "0", output: "Even", isSample: false },
                { input: "-5", output: "Odd", isSample: false },
                { input: "1000", output: "Even", isSample: false }
            ]
        },
        {
            title: "Maximum of Three",
            description: `Given three integers A, B, and C, find and print the maximum among them.

**Input Format:**
Three space-separated integers A, B, C.

**Output Format:**
Print a single integer - the maximum value.

**Constraints:**
-10^9 ≤ A, B, C ≤ 10^9`,
            difficulty: "EASY",
            isPublic: true,
            timeLimit: 1,
            memoryLimit: 64,
            testCases: [
                { input: "5 3 8", output: "8", isSample: true },
                { input: "10 10 5", output: "10", isSample: true },
                { input: "-1 -5 -3", output: "-1", isSample: false },
                { input: "0 0 0", output: "0", isSample: false },
                { input: "100 99 101", output: "101", isSample: false }
            ]
        },
        {
            title: "Array Sum",
            description: `Given an array of N integers, calculate and print the sum of all elements.

**Input Format:**
First line contains integer N - the size of array.
Second line contains N space-separated integers.

**Output Format:**
Print a single integer - sum of all array elements.

**Constraints:**
1 ≤ N ≤ 10^5
-10^9 ≤ array[i] ≤ 10^9`,
            difficulty: "EASY",
            isPublic: true,
            timeLimit: 2,
            memoryLimit: 128,
            testCases: [
                { input: "5\n1 2 3 4 5", output: "15", isSample: true },
                { input: "3\n10 -5 7", output: "12", isSample: true },
                { input: "1\n100", output: "100", isSample: false },
                { input: "4\n0 0 0 0", output: "0", isSample: false },
                { input: "6\n-1 -2 -3 1 2 3", output: "0", isSample: false }
            ]
        },
        {
            title: "Palindrome Check",
            description: `Given a string S, determine if it is a palindrome (reads the same forwards and backwards).

**Input Format:**
Single line containing string S.

**Output Format:**
Print "YES" if S is a palindrome, otherwise print "NO".

**Constraints:**
1 ≤ |S| ≤ 10^5
S contains only lowercase English letters.`,
            difficulty: "EASY",
            isPublic: true,
            timeLimit: 2,
            memoryLimit: 128,
            testCases: [
                { input: "racecar", output: "YES", isSample: true },
                { input: "hello", output: "NO", isSample: true },
                { input: "a", output: "YES", isSample: false },
                { input: "abba", output: "YES", isSample: false },
                { input: "abcd", output: "NO", isSample: false }
            ]
        },
        {
            title: "Fibonacci Number",
            description: `Given an integer N, print the Nth Fibonacci number (0-indexed).

Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, ...

**Input Format:**
Single integer N.

**Output Format:**
Print the Nth Fibonacci number.

**Constraints:**
0 ≤ N ≤ 30`,
            difficulty: "EASY",
            isPublic: true,
            timeLimit: 2,
            memoryLimit: 64,
            testCases: [
                { input: "0", output: "0", isSample: true },
                { input: "1", output: "1", isSample: true },
                { input: "5", output: "5", isSample: true },
                { input: "10", output: "55", isSample: false },
                { input: "15", output: "610", isSample: false }
            ]
        },
        {
            title: "Count Vowels",
            description: `Given a string S, count the number of vowels (a, e, i, o, u) in it.

**Input Format:**
Single line containing string S.

**Output Format:**
Print the count of vowels.

**Constraints:**
1 ≤ |S| ≤ 10^5
S contains only lowercase English letters.`,
            difficulty: "EASY",
            isPublic: true,
            timeLimit: 2,
            memoryLimit: 128,
            testCases: [
                { input: "hello", output: "2", isSample: true },
                { input: "programming", output: "3", isSample: true },
                { input: "aeiou", output: "5", isSample: false },
                { input: "bcdfg", output: "0", isSample: false },
                { input: "beautiful", output: "5", isSample: false }
            ]
        },
        {
            title: "Prime Check",
            description: `Given an integer N, determine if it is a prime number.

**Input Format:**
Single integer N.

**Output Format:**
Print "YES" if N is prime, otherwise print "NO".

**Constraints:**
2 ≤ N ≤ 10^6`,
            difficulty: "MEDIUM",
            isPublic: true,
            timeLimit: 2,
            memoryLimit: 128,
            testCases: [
                { input: "7", output: "YES", isSample: true },
                { input: "10", output: "NO", isSample: true },
                { input: "2", output: "YES", isSample: false },
                { input: "100", output: "NO", isSample: false },
                { input: "97", output: "YES", isSample: false }
            ]
        },
        {
            title: "Reverse Array",
            description: `Given an array of N integers, print the array in reverse order.

**Input Format:**
First line contains integer N.
Second line contains N space-separated integers.

**Output Format:**
Print N space-separated integers in reverse order.

**Constraints:**
1 ≤ N ≤ 10^5
-10^9 ≤ array[i] ≤ 10^9`,
            difficulty: "EASY",
            isPublic: true,
            timeLimit: 2,
            memoryLimit: 128,
            testCases: [
                { input: "5\n1 2 3 4 5", output: "5 4 3 2 1", isSample: true },
                { input: "3\n10 20 30", output: "30 20 10", isSample: true },
                { input: "1\n100", output: "100", isSample: false },
                { input: "4\n-1 0 1 2", output: "2 1 0 -1", isSample: false },
                { input: "6\n5 5 5 5 5 5", output: "5 5 5 5 5 5", isSample: false }
            ]
        },
        {
            title: "GCD of Two Numbers",
            description: `Given two integers A and B, find their Greatest Common Divisor (GCD).

**Input Format:**
Two space-separated integers A and B.

**Output Format:**
Print a single integer - the GCD of A and B.

**Constraints:**
1 ≤ A, B ≤ 10^9`,
            difficulty: "MEDIUM",
            isPublic: true,
            timeLimit: 2,
            memoryLimit: 64,
            testCases: [
                { input: "12 8", output: "4", isSample: true },
                { input: "15 25", output: "5", isSample: true },
                { input: "7 3", output: "1", isSample: false },
                { input: "100 50", output: "50", isSample: false },
                { input: "1000000000 500000000", output: "500000000", isSample: false }
            ]
        }
    ];

    for (const problemData of problems) {
        const { testCases, ...problemInfo } = problemData;

        const problem = await prisma.problem.create({
            data: {
                ...problemInfo,
                authorId: adminUser.id,
                testCases: {
                    create: testCases
                }
            },
            include: {
                testCases: true
            }
        });

        console.log(`Created problem: ${problem.title} (${problem.difficulty}) with ${problem.testCases.length} test cases`);
    }

    console.log('\\nSeed completed successfully!');
    console.log(`Total problems created: ${problems.length}`);
    console.log('Admin credentials:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
}

main()
    .catch((e) => {
        console.error('Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
