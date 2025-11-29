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
            title: "Two Sum",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            difficulty: "EASY",
            isPublic: true,
            timeLimit: 2,
            memoryLimit: 128,
            testCases: [
            ]
        },
        {
            title: "Reverse String",
            description: "Write a function that reverses a string. The input string is given as an array of characters.",
            difficulty: "EASY",
            isPublic: true,
            timeLimit: 1,
            memoryLimit: 64,
            testCases: [
            ]
        },
        {
            title: "FizzBuzz",
            description: "Given an integer n, return a string array answer where answer[i] is 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, 'FizzBuzz' for multiples of both, or the number as string otherwise.",
            difficulty: "EASY",
            isPublic: true,
            timeLimit: 2,
            memoryLimit: 128,
            testCases: [
            ]
        },
        {
            title: "Valid Parentheses",
            description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
            difficulty: "EASY",
            isPublic: true,
            timeLimit: 2,
            memoryLimit: 128,
            testCases: [
            ]
        },
        {
            title: "Maximum Subarray",
            description: "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
            difficulty: "MEDIUM",
            isPublic: true,
            timeLimit: 3,
            memoryLimit: 256,
            testCases: [
            ]
        },
        {
            title: "Longest Palindromic Substring",
            description: "Given a string s, return the longest palindromic substring in s.",
            difficulty: "MEDIUM",
            isPublic: true,
            timeLimit: 3,
            memoryLimit: 256,
            testCases: [
            ]
        },
        {
            title: "3Sum",
            description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
            difficulty: "MEDIUM",
            isPublic: true,
            timeLimit: 4,
            memoryLimit: 256,
            testCases: [
            ]
        },
        {
            title: "Binary Tree Level Order Traversal",
            description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
            difficulty: "MEDIUM",
            isPublic: true,
            timeLimit: 3,
            memoryLimit: 256,
            testCases: [
            ]
        },
        {
            title: "Median of Two Sorted Arrays",
            description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
            difficulty: "HARD",
            isPublic: true,
            timeLimit: 5,
            memoryLimit: 512,
            testCases: [
            ]
        },
        {
            title: "Merge K Sorted Lists",
            description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
            difficulty: "HARD",
            isPublic: true,
            timeLimit: 5,
            memoryLimit: 512,
            testCases: [
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
