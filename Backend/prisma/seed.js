require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  let adminUser = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    adminUser = await prisma.user.create({
      data: {
        username: "admin",
        fullName: "System Admin",
        email: "admin@conflict.com",
        password: hashedPassword,
        bio: "System Administrator",
        dualsCrowns: 0,
        havocCrowns: 0,
      },
    });
    console.log("Created admin user");
  } else {
    console.log("Admin user already exists");
  }

  const problems = [
    {
      title: "Sum of Two",
      description: `You are given two integers A and B. Compute their sum.

**Input Format:**
A single line with two space-separated integers A and B.

**Output Format:**
Print A + B.

**Constraints:**
-10^9 ≤ A, B ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "4 6", output: "10", isSample: true },
        { input: "-5 3", output: "-2", isSample: true },
        {
          input: "1000000000 1000000000",
          output: "2000000000",
          isSample: false,
        },
        { input: "-999999999 -1", output: "-1000000000", isSample: false },
        { input: "0 0", output: "0", isSample: false },
      ],
    },
    {
      title: "Odd or Even Check",
      description: `You must determine whether a given integer N is odd or even.

**Input Format:**
One integer N.

**Output Format:**
Print "Even" or "Odd".

**Constraints:**
-10^9 ≤ N ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "8", output: "Even", isSample: true },
        { input: "13", output: "Odd", isSample: true },
        { input: "0", output: "Even", isSample: false },
        { input: "-7", output: "Odd", isSample: false },
        { input: "100000000", output: "Even", isSample: false },
      ],
    },
    {
      title: "Max of Three Numbers",
      description: `Given three integers A, B, and C, determine the largest among them.

**Input Format:**
Three space-separated integers.

**Output Format:**
Print the maximum.

**Constraints:**
-10^9 ≤ A, B, C ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "1 5 3", output: "5", isSample: true },
        { input: "10 10 7", output: "10", isSample: true },
        { input: "-5 -2 -3", output: "-2", isSample: false },
        { input: "100 200 50", output: "200", isSample: false },
        { input: "0 0 0", output: "0", isSample: false },
      ],
    },
    {
      title: "String Reversal",
      description: `You are given a string S. Output the reversed string.

**Input Format:**
One string S.

**Output Format:**
Print S reversed.

**Constraints:**
1 ≤ |S| ≤ 10^5
S consists of lowercase English letters.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "abcde", output: "edcba", isSample: true },
        { input: "a", output: "a", isSample: true },
        { input: "racecar", output: "racecar", isSample: false },
        { input: "zzz", output: "zzz", isSample: false },
        { input: "hello", output: "olleh", isSample: false },
      ],
    },
    {
      title: "Count the Zeros",
      description: `You are given an integer N. Count how many digits in N are equal to zero.

**Input Format:**
A single integer N.

**Output Format:**
Print the number of zero digits in N.

**Constraints:**
0 ≤ N ≤ 10^18`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "1004", output: "2", isSample: true },
        { input: "909090", output: "3", isSample: true },
        { input: "0", output: "1", isSample: false },
        { input: "500005", output: "4", isSample: false },
        { input: "123456", output: "0", isSample: false },
      ],
    },
    {
      title: "Digit Sum",
      description: `Given an integer N, compute the sum of its digits.

**Input Format:**
One integer N.

**Output Format:**
Print the digit sum.

**Constraints:**
0 ≤ N ≤ 10^18`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "123", output: "6", isSample: true },
        { input: "999", output: "27", isSample: true },
        { input: "1000000", output: "1", isSample: false },
        { input: "5", output: "5", isSample: false },
        { input: "987654321", output: "45", isSample: false },
      ],
    },
    {
      title: "Find the Missing Number",
      description: `You are given all integers from 1 to N except one. Find the missing integer.

**Input Format:**
First line: N  
Second line: N−1 distinct integers from 1 to N.

**Output Format:**
Print the missing number.

**Constraints:**
1 ≤ N ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 2 3 5", output: "4", isSample: true },
        { input: "4\n1 4 2", output: "3", isSample: true },
        { input: "3\n1 3", output: "2", isSample: false },
        { input: "2\n2", output: "1", isSample: false },
        { input: "6\n1 2 3 4 6", output: "5", isSample: false },
      ],
    },
    {
      title: "Uppercase Count",
      description: `Given a string S, count how many uppercase English letters it contains.

**Input Format:**
String S.

**Output Format:**
Print the count.

**Constraints:**
1 ≤ |S| ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "HelloWorld", output: "2", isSample: true },
        { input: "ABCdef", output: "3", isSample: true },
        { input: "aaaa", output: "0", isSample: false },
        { input: "UPPER", output: "5", isSample: false },
        { input: "MiXeD", output: "3", isSample: false },
      ],
    },
    {
      title: "Adjacent Difference",
      description: `Given an array of N integers, print the absolute difference between each pair of adjacent elements.

**Input Format:**
N  
Array of N integers.

**Output Format:**
Print N−1 integers: |a[i] − a[i+1]|.

**Constraints:**
1 ≤ N ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 4 2 9 7", output: "3 2 7 2", isSample: true },
        { input: "3\n10 20 30", output: "10 10", isSample: true },
        { input: "1\n5", output: "", isSample: false },
        { input: "4\n0 0 0 0", output: "0 0 0", isSample: false },
        { input: "5\n5 1 5 1 5", output: "4 4 4 4", isSample: false },
      ],
    },
    {
      title: "Last Digit of Power",
      description: `You are given two integers A and B. Compute the last digit of A^B.

**Input Format:**
A B

**Output Format:**
Print the last digit of A^B.

**Constraints:**
0 ≤ A ≤ 10^9  
0 ≤ B ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "2 10", output: "4", isSample: true },
        { input: "7 2", output: "9", isSample: true },
        { input: "10 10", output: "0", isSample: false },
        { input: "3 0", output: "1", isSample: false },
        { input: "9 9", output: "9", isSample: false },
      ],
    },
    {
      title: "Count the Words",
      description: `You are given a sentence containing words separated by spaces. Count how many words appear.

A word is a sequence of non-space characters.

**Input Format:**
One line containing a sentence.

**Output Format:**
Print the number of words.

**Constraints:**
1 ≤ |S| ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "hello world", output: "2", isSample: true },
        { input: "one two three four", output: "4", isSample: true },
        { input: "single", output: "1", isSample: false },
        { input: "a b c d", output: "4", isSample: false },
        { input: "   spaced   words   here  ", output: "3", isSample: false },
      ],
    },
    {
      title: "Minimum of Array",
      description: `Given an array of N integers, print the smallest element.

**Input Format:**
N  
Array of N integers.

**Output Format:**
Print the minimum number.

**Constraints:**
1 ≤ N ≤ 10^5  
-10^9 ≤ a[i] ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n3 1 4 2 5", output: "1", isSample: true },
        { input: "3\n10 10 10", output: "10", isSample: true },
        { input: "4\n0 -1 -2 5", output: "-2", isSample: false },
        { input: "1\n7", output: "7", isSample: false },
        { input: "6\n9 8 7 6 5 4", output: "4", isSample: false },
      ],
    },
    {
      title: "Unique Characters",
      description: `Check if all characters in string S are unique (no duplicates).

**Input Format:**
String S.

**Output Format:**
Print "YES" if all characters are unique, otherwise print "NO".

**Constraints:**
1 ≤ |S| ≤ 10^5  
S contains lowercase English letters.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "abc", output: "YES", isSample: true },
        { input: "hello", output: "NO", isSample: true },
        { input: "z", output: "YES", isSample: false },
        { input: "abcdefgha", output: "NO", isSample: false },
        { input: "qwerty", output: "YES", isSample: false },
      ],
    },
    {
      title: "Rectangle Area",
      description: `Given width W and height H of a rectangle, compute its area.

**Input Format:**
W H

**Output Format:**
Print W × H.

**Constraints:**
1 ≤ W, H ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "3 4", output: "12", isSample: true },
        { input: "10 10", output: "100", isSample: true },
        { input: "1 1000000000", output: "1000000000", isSample: false },
        { input: "7 8", output: "56", isSample: false },
        { input: "50 2", output: "100", isSample: false },
      ],
    },
    {
      title: "Swap the Numbers",
      description: `Given two integers A and B, output them in swapped order.

**Input Format:**
A B

**Output Format:**
Print B A.

**Constraints:**
-10^9 ≤ A, B ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "5 7", output: "7 5", isSample: true },
        { input: "-1 10", output: "10 -1", isSample: true },
        { input: "0 0", output: "0 0", isSample: false },
        { input: "9 3", output: "3 9", isSample: false },
        { input: "-5 -9", output: "-9 -5", isSample: false },
      ],
    },
    {
      title: "Count Divisors",
      description: `Count how many positive integers divide a given number N.

**Input Format:**
One integer N.

**Output Format:**
Print the number of divisors of N.

**Constraints:**
1 ≤ N ≤ 10^6`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "6", output: "4", isSample: true }, // 1,2,3,6
        { input: "10", output: "4", isSample: true }, // 1,2,5,10
        { input: "1", output: "1", isSample: false },
        { input: "12", output: "6", isSample: false },
        { input: "999983", output: "2", isSample: false }, // prime
      ],
    },
    {
      title: "Case Inverter",
      description: `Given a string S, invert the case of each character:
- lowercase becomes uppercase  
- uppercase becomes lowercase

**Input Format:**
String S.

**Output Format:**
Print the modified string.

**Constraints:**
1 ≤ |S| ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "AbC", output: "aBc", isSample: true },
        { input: "helloWORLD", output: "HELLOworld", isSample: true },
        { input: "a", output: "A", isSample: false },
        { input: "Z", output: "z", isSample: false },
        { input: "mIxEd", output: "MiXeD", isSample: false },
      ],
    },
    {
      title: "Sum of N Numbers",
      description: `Compute the sum of N integers.

**Input Format:**
N  
N integers.

**Output Format:**
Print the sum.

**Constraints:**
1 ≤ N ≤ 10^5  
-10^9 ≤ a[i] ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 2 3 4 5", output: "15", isSample: true },
        { input: "3\n10 -10 5", output: "5", isSample: true },
        { input: "1\n999999999", output: "999999999", isSample: false },
        { input: "4\n0 0 0 0", output: "0", isSample: false },
        { input: "6\n5 5 5 5 5 5", output: "30", isSample: false },
      ],
    },
    {
      title: "Count Lowercase",
      description: `Count how many lowercase letters appear in S.

**Input Format:**
String S.

**Output Format:**
Print the count.

**Constraints:**
1 ≤ |S| ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "Hello", output: "4", isSample: true },
        { input: "ABC", output: "0", isSample: true },
        { input: "mixedCASE", output: "5", isSample: false },
        { input: "lower", output: "5", isSample: false },
        { input: "UPPER", output: "0", isSample: false },
      ],
    },
    {
      title: "Difference Between Max and Min",
      description: `Given N numbers, compute the difference between the maximum and minimum.

**Input Format:**
N  
N integers.

**Output Format:**
Print max(a) − min(a).

**Constraints:**
1 ≤ N ≤ 10^5  
-10^9 ≤ a[i] ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 5 3 2 4", output: "4", isSample: true },
        { input: "3\n10 10 10", output: "0", isSample: true },
        { input: "4\n-5 0 5 10", output: "15", isSample: false },
        { input: "1\n1000", output: "0", isSample: false },
        { input: "6\n9 3 7 1 4 8", output: "8", isSample: false },
      ],
    },
    {
      title: "Vowel Remover",
      description: `Given a string S, remove all vowels (a, e, i, o, u) from it.

**Input Format:**
String S.

**Output Format:**
Print the string with all vowels removed.

**Constraints:**
1 ≤ |S| ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "hello", output: "hll", isSample: true },
        { input: "beautiful", output: "btfl", isSample: true },
        { input: "a", output: "", isSample: false },
        { input: "codeforces", output: "cdfrcs", isSample: false },
        { input: "rhythm", output: "rhythm", isSample: false },
      ],
    },
    {
      title: "Count Negatives",
      description: `Given an array of N integers, count how many of them are negative.

**Input Format:**
N  
N integers.

**Output Format:**
Print the count of negative numbers.

**Constraints:**
1 ≤ N ≤ 10^5  
-10^9 ≤ a[i] ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n-1 2 -3 4 -5", output: "3", isSample: true },
        { input: "3\n1 2 3", output: "0", isSample: true },
        { input: "4\n0 0 0 -1", output: "1", isSample: false },
        { input: "6\n-1 -2 -3 -4 -5 -6", output: "6", isSample: false },
        { input: "1\n-10", output: "1", isSample: false },
      ],
    },
    {
      title: "Factorial Modulo 1000000007",
      description: `Given an integer N, compute N! modulo 1,000,000,007.

**Input Format:**
N.

**Output Format:**
Print N! % 1,000,000,007.

**Constraints:**
0 ≤ N ≤ 10^6`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5", output: "120", isSample: true },
        { input: "10", output: "3628800", isSample: true },
        { input: "0", output: "1", isSample: false },
        { input: "1", output: "1", isSample: false },
        {
          input: "20",
          output: "2432902008176640000 % 1000000007 = 146326063",
          isSample: false,
        },
      ],
    },
    {
      title: "Binary String Flip Count",
      description: `Given a binary string S, count how many times the character changes when scanning from left to right.

For example, "001100" → changes at positions: 2→3 and 3→4.

**Input Format:**
String S.

**Output Format:**
Print the number of character changes.

**Constraints:**
1 ≤ |S| ≤ 10^5  
S consists of '0' and '1'.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "000", output: "0", isSample: true },
        { input: "0101", output: "3", isSample: true },
        { input: "001100", output: "2", isSample: false },
        { input: "1", output: "0", isSample: false },
        { input: "101010", output: "5", isSample: false },
      ],
    },
    {
      title: "XOR of Array",
      description: `Given N integers, compute their XOR value.

**Input Format:**
N  
N integers.

**Output Format:**
Print the XOR of all numbers.

**Constraints:**
1 ≤ N ≤ 10^5  
0 ≤ a[i] ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "4\n1 2 3 4", output: "4", isSample: true },
        { input: "3\n7 7 7", output: "7", isSample: true },
        { input: "1\n10", output: "10", isSample: false },
        { input: "5\n1 1 1 1 1", output: "1", isSample: false },
        { input: "5\n5 4 3 2 1", output: "1", isSample: false },
      ],
    },
    {
      title: "Count Occurrences of Character",
      description: `Given a string S and a character C, count how many times C appears in S.

**Input Format:**
S  
C

**Output Format:**
Print the count.

**Constraints:**
1 ≤ |S| ≤ 10^5  
C is a lowercase letter.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "banana\na", output: "3", isSample: true },
        { input: "hello\ne", output: "1", isSample: true },
        { input: "aaaaaaa\na", output: "7", isSample: false },
        { input: "abcdef\nz", output: "0", isSample: false },
        { input: "programming\ng", output: "2", isSample: false },
      ],
    },
    {
      title: "Smallest Positive Missing",
      description: `Given an array of integers (positive, negative, or zero), find the smallest positive integer that does not appear in the array.

**Input Format:**
N  
N integers.

**Output Format:**
Print the smallest missing positive integer.

**Constraints:**
1 ≤ N ≤ 10^5  
-10^9 ≤ a[i] ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 2 0 4 5", output: "3", isSample: true },
        { input: "5\n2 3 7 6 8", output: "1", isSample: true },
        { input: "3\n1 1 2", output: "3", isSample: false },
        { input: "4\n-1 -2 -3 -4", output: "1", isSample: false },
        { input: "6\n5 4 3 2 1 6", output: "7", isSample: false },
      ],
    },
    {
      title: "Count Words Starting with Vowel",
      description: `Given a sentence, count how many words start with a vowel (a, e, i, o, u).

Words are separated by spaces.

**Input Format:**
One line containing a sentence.

**Output Format:**
Print the count of words starting with a vowel.

**Constraints:**
1 ≤ |S| ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "apple orange banana", output: "2", isSample: true },
        { input: "umbrella is useful", output: "2", isSample: true },
        { input: "today is sunny", output: "1", isSample: false },
        { input: "cat dog mouse", output: "0", isSample: false },
        { input: "elephant", output: "1", isSample: false },
      ],
    },
    {
      title: "Second Largest Number",
      description: `Given N integers, find the second largest distinct value.  
If it doesn't exist, print -1.

**Input Format:**
N  
N integers.

**Output Format:**
Print the second largest number or -1.

**Constraints:**
1 ≤ N ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 2 3 4 5", output: "4", isSample: true },
        { input: "4\n10 10 9 9", output: "9", isSample: true },
        { input: "2\n7 7", output: "-1", isSample: false },
        { input: "3\n100 50 100", output: "50", isSample: false },
        { input: "1\n9", output: "-1", isSample: false },
      ],
    },
    {
      title: "Pair Sum Check",
      description: `Given an array of N integers and a target value K, determine if there exists a pair of numbers that sum to K.

**Input Format:**
N K  
N integers.

**Output Format:**
Print "YES" if such a pair exists, otherwise print "NO".

**Constraints:**
1 ≤ N ≤ 10^5  
-10^9 ≤ a[i], K ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5 9\n2 7 11 15 3", output: "YES", isSample: true },
        { input: "4 8\n1 2 3 4", output: "NO", isSample: true },
        { input: "3 0\n-1 1 2", output: "YES", isSample: false },
        { input: "5 100\n20 30 40 50 60", output: "NO", isSample: false },
        { input: "6 10\n5 5 5 5 5 5", output: "YES", isSample: false },
      ],
    },
    {
      title: "String Compression Length",
      description: `You are given a string S. If consecutive characters are equal, compress them by writing the character followed by its count.

Output only the **length** of this compressed string.

Example:  
S = "aaabb" → compressed = "a3b2" → length = 4.

**Input Format:**
String S.

**Output Format:**
Print the length of compressed form.

**Constraints:**
1 ≤ |S| ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "aaabb", output: "4", isSample: true },
        { input: "abc", output: "3", isSample: true },
        { input: "aaaaaaa", output: "2", isSample: false },
        { input: "aabbaa", output: "6", isSample: false },
        { input: "zzzzzzzzzz", output: "2", isSample: false },
      ],
    },
    {
      title: "Sum of Digits Until Single Digit",
      description: `Given an integer N, repeatedly compute the sum of digits until the result becomes a single digit.

**Input Format:**
Integer N.

**Output Format:**
Print the resulting single-digit number.

**Constraints:**
0 ≤ N ≤ 10^18`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "9875", output: "2", isSample: true },
        { input: "9", output: "9", isSample: true },
        { input: "10", output: "1", isSample: false },
        { input: "999999", output: "9", isSample: false },
        { input: "123456789", output: "9", isSample: false },
      ],
    },
    {
      title: "Duplicate Finder",
      description: `Given N integers, check if any number appears more than once.

**Input Format:**
N  
N integers.

**Output Format:**
Print "YES" if duplicates exist, otherwise "NO".

**Constraints:**
1 ≤ N ≤ 10^5
-10^9 ≤ a[i] ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 2 3 4 4", output: "YES", isSample: true },
        { input: "4\n1 2 3 4", output: "NO", isSample: true },
        { input: "3\n5 5 5", output: "YES", isSample: false },
        { input: "6\n1 2 3 4 5 6", output: "NO", isSample: false },
        { input: "1\n100", output: "NO", isSample: false },
      ],
    },
    {
      title: "Count Capitalized Words",
      description: `Given a sentence, count how many words start with an uppercase letter.

**Input Format:**
A sentence.

**Output Format:**
Print the count.

**Constraints:**
1 ≤ |S| ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "Hello world From Codeforces", output: "3", isSample: true },
        { input: "all words small", output: "0", isSample: true },
        { input: "Test caseHere Now", output: "2", isSample: false },
        { input: "A B C", output: "3", isSample: false },
        { input: "no Capital Letter", output: "1", isSample: false },
      ],
    },
    {
      title: "Check Arithmetic Progression",
      description: `Given N integers, check whether they form an arithmetic progression.

**Input Format:**
N  
N integers.

**Output Format:**
Print "YES" if they form an AP, otherwise "NO".

**Constraints:**
2 ≤ N ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "4\n1 3 5 7", output: "YES", isSample: true },
        { input: "3\n10 20 40", output: "NO", isSample: true },
        { input: "2\n5 10", output: "YES", isSample: false },
        { input: "5\n2 2 2 2 2", output: "YES", isSample: false },
        { input: "4\n1 2 4 8", output: "NO", isSample: false },
      ],
    },
    {
      title: "Find the Majority Element",
      description: `An element is called majority if it appears more than N/2 times.  
Given N integers, output the majority element or -1 if it does not exist.

**Input Format:**
N  
N integers.

**Output Format:**
Print the majority element or -1.

**Constraints:**
1 ≤ N ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n2 2 1 2 3", output: "2", isSample: true },
        { input: "4\n1 2 3 4", output: "-1", isSample: true },
        { input: "3\n7 7 7", output: "7", isSample: false },
        { input: "6\n1 1 2 2 2 2", output: "2", isSample: false },
        { input: "1\n9", output: "9", isSample: false },
      ],
    },
    {
      title: "Longest Constant Subarray",
      description: `You are given an array of N integers.  
Find the length of the longest subarray where all elements are equal.

**Input Format:**
N  
N integers.

**Output Format:**
Print the length.

**Constraints:**
1 ≤ N ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 1 2 2 2", output: "3", isSample: true },
        { input: "4\n5 5 5 5", output: "4", isSample: true },
        { input: "3\n1 2 3", output: "1", isSample: false },
        { input: "6\n7 7 8 8 8 8", output: "4", isSample: false },
        { input: "1\n9", output: "1", isSample: false },
      ],
    },
    {
      title: "Print Every k-th Character",
      description: `Given a string S and an integer K, print every K-th character of S starting from index 0.

**Input Format:**
S  
K

**Output Format:**
A string consisting of selected characters.

**Constraints:**
1 ≤ |S| ≤ 10^5  
1 ≤ K ≤ |S|`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "abcdef\n2", output: "ace", isSample: true },
        { input: "hello\n3", output: "hl", isSample: true },
        { input: "a\n1", output: "a", isSample: false },
        { input: "aaaaa\n2", output: "aaa", isSample: false },
        { input: "xyzxyz\n3", output: "xz", isSample: false },
      ],
    },
    {
      title: "Count Numbers Greater Than X",
      description: `Given N integers and a value X, count how many integers are strictly greater than X.

**Input Format:**
N X  
N integers.

**Output Format:**
Print the count.

**Constraints:**
1 ≤ N ≤ 10^5`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5 3\n1 2 3 4 5", output: "2", isSample: true },
        { input: "4 10\n11 12 9 8", output: "2", isSample: true },
        { input: "1 0\n5", output: "1", isSample: false },
        { input: "3 5\n1 2 3", output: "0", isSample: false },
        { input: "6 100\n100 101 102 50 60 200", output: "3", isSample: false },
      ],
    },
    {
      title: "Prefix Sum Query",
      description: `You are given an array of N integers and a number Q.  
For each query consisting of index i, print the sum of all elements from index 1 to i.

**Input Format:**
N Q  
N integers  
Q integers representing queries.

**Output Format:**
For each query print the prefix sum up to that index.

**Constraints:**
1 ≤ N, Q ≤ 10^5  
-10^9 ≤ a[i] ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        {
          input: "5 3\n1 2 3 4 5\n1 3 5",
          output: "1\n6\n15",
          isSample: true,
        },
        {
          input: "4 2\n10 -5 7 2\n2 4",
          output: "5\n14",
          isSample: true,
        },
        {
          input: "1 1\n100\n1",
          output: "100",
          isSample: false,
        },
        {
          input: "5 2\n0 0 0 0 0\n5 3",
          output: "0\n0",
          isSample: false,
        },
        {
          input: "6 3\n1 1 1 1 1 1\n6 1 4",
          output: "6\n1\n4",
          isSample: false,
        },
      ],
    },
    {
      title: "K Largest Elements Sum",
      description: `You are given N integers and a number K.  
Find the sum of the K largest elements in the array.

**Input Format:**
N K  
N integers

**Output Format:**
Print the sum of the K largest elements.

**Constraints:**
1 ≤ K ≤ N ≤ 10^5`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "5 2\n1 5 3 2 4", output: "9", isSample: true },
        { input: "4 1\n10 20 30 40", output: "40", isSample: true },
        { input: "3 3\n5 5 5", output: "15", isSample: false },
        { input: "6 2\n-1 -2 -3 -4 -5 -6", output: "-3", isSample: false },
        { input: "5 3\n100 90 80 70 60", output: "270", isSample: false },
      ],
    },
    {
      title: "Frequency Queries",
      description: `Given an array of N integers and Q queries.  
Each query gives a number X — print how many times X appears in the array.

**Input Format:**
N Q  
N integers  
Q integers (queries X)

**Output Format:**
For each query print its frequency.

**Constraints:**
1 ≤ N, Q ≤ 10^5`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "5 3\n1 2 2 3 3\n2 3 1", output: "2\n2\n1", isSample: true },
        { input: "4 2\n5 5 5 5\n5 1", output: "4\n0", isSample: true },
        { input: "3 1\n1 2 3\n3", output: "1", isSample: false },
        {
          input: "6 2\n10 20 20 20 30 30\n20 40",
          output: "3\n0",
          isSample: false,
        },
        { input: "5 3\n7 7 8 9 7\n7 8 10", output: "3\n1\n0", isSample: false },
      ],
    },
    {
      title: "Rotate Array Right",
      description: `Given an array of N integers, rotate it right by K positions.

**Input Format:**
N K  
N integers

**Output Format:**
Print the rotated array.

**Constraints:**
1 ≤ N ≤ 10^5  
0 ≤ K ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 128,
      testCases: [
        { input: "5 2\n1 2 3 4 5", output: "4 5 1 2 3", isSample: true },
        { input: "4 1\n10 20 30 40", output: "40 10 20 30", isSample: true },
        { input: "3 3\n5 6 7", output: "5 6 7", isSample: false },
        { input: "6 4\n1 1 1 1 1 1", output: "1 1 1 1 1 1", isSample: false },
        { input: "5 7\n2 4 6 8 10", output: "6 8 10 2 4", isSample: false },
      ],
    },
    {
      title: "Number of Distinct Substrings",
      description: `Given a string S, find the number of DISTINCT substrings of S.

**Input Format:**
String S

**Output Format:**
Print number of distinct substrings.

**Constraints:**
1 ≤ |S| ≤ 2000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "aaa", output: "3", isSample: true },
        { input: "ab", output: "3", isSample: true },
        { input: "abcd", output: "10", isSample: false },
        { input: "abab", output: "7", isSample: false },
        { input: "zzzz", output: "4", isSample: false },
      ],
    },
    {
      title: "Matrix Diagonal Sum Difference",
      description: `Given an N×N matrix, compute  
|(sum of primary diagonal) - (sum of secondary diagonal)|.

**Input Format:**
N  
N lines with N integers each

**Output Format:**
Print the absolute difference.

**Constraints:**
1 ≤ N ≤ 1000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3\n1 2 3\n4 5 6\n7 8 9", output: "0", isSample: true },
        { input: "2\n5 1\n2 3", output: "5", isSample: true },
        { input: "1\n100", output: "0", isSample: false },
        { input: "3\n10 0 1\n4 5 6\n7 8 9", output: "2", isSample: false },
        {
          input: "4\n1 2 3 4\n4 3 2 1\n1 1 1 1\n9 9 9 9",
          output: "10",
          isSample: false,
        },
      ],
    },
    {
      title: "Count Subarrays With Sum X",
      description: `Given N integers and a value X, count the number of contiguous subarrays whose sum equals X.

**Input Format:**
N X  
N integers

**Output Format:**
Print the count.

**Constraints:**
1 ≤ N ≤ 10^5  
-10^9 ≤ a[i], X ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "5 5\n1 2 1 2 1", output: "4", isSample: true },
        { input: "4 3\n1 1 1 1", output: "2", isSample: true },
        { input: "3 0\n1 -1 0", output: "3", isSample: false },
        { input: "5 10\n10 0 0 0 0", output: "5", isSample: false },
        { input: "6 7\n2 3 1 2 1 3", output: "2", isSample: false },
      ],
    },
    {
      title: "Sort by Frequency",
      description: `Given N integers, sort numbers in DESCENDING order of frequency.  
If 2 numbers have the same frequency, sort by ASCENDING numeric value.

**Input Format:**
N  
N integers

**Output Format:**
Print the sorted list.

**Constraints:**
1 ≤ N ≤ 10^5`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "6\n1 1 2 2 2 3", output: "2 2 2 1 1 3", isSample: true },
        { input: "5\n4 4 4 4 4", output: "4 4 4 4 4", isSample: true },
        { input: "4\n9 8 7 6", output: "6 7 8 9", isSample: false },
        { input: "6\n3 3 1 1 2 2", output: "1 1 2 2 3 3", isSample: false },
        {
          input: "7\n10 10 20 20 20 30 30",
          output: "20 20 20 10 10 30 30",
          isSample: false,
        },
      ],
    },
    {
      title: "Binary String Alternation Cost",
      description: `You are given a binary string S.  
To make it alternating (010101… or 101010…),  
each time you can flip a character (0→1 or 1→0).

Find the minimum flips required.

**Input Format:**
String S

**Output Format:**
Minimum flips.

**Constraints:**
1 ≤ |S| ≤ 10^5`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 64,
      testCases: [
        { input: "0101", output: "0", isSample: true },
        { input: "1111", output: "2", isSample: true },
        { input: "0", output: "0", isSample: false },
        { input: "1010100", output: "1", isSample: false },
        { input: "000101", output: "3", isSample: false },
      ],
    },
    {
      title: "Range Additions & Point Queries",
      description: `You are given an array of N zeros.  
Then Q operations:  
Each operation: L R V — add value V to all indices in [L, R].  
After all operations output the final array.

**Input Format:**
N Q  
Q lines: L R V

**Output Format:**
Final N integers.

**Constraints:**
1 ≤ N, Q ≤ 10^5  
-10^9 ≤ V ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        {
          input: "5 3\n1 3 2\n2 5 1\n4 4 5",
          output: "2 3 3 6 1",
          isSample: true,
        },
        { input: "3 1\n1 3 10", output: "10 10 10", isSample: true },
        { input: "4 2\n1 1 5\n4 4 7", output: "5 0 0 7", isSample: false },
        { input: "2 2\n1 2 1\n1 2 -1", output: "0 0", isSample: false },
        {
          input: "6 3\n2 3 4\n3 6 2\n1 6 1",
          output: "1 5 7 3 3 3",
          isSample: false,
        },
      ],
    },
    {
      title: "Minimum Distinct After Removing K",
      description: `You are given N integers and a number K.  
You must remove exactly K elements from the array.  
After removal, minimize the number of DISTINCT values left.

**Input Format:**
N K  
N integers

**Output Format:**
Minimum distinct count.

**Constraints:**
1 ≤ N ≤ 10^5  
0 ≤ K ≤ N`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "5 2\n1 2 2 3 3", output: "2", isSample: true },
        { input: "4 0\n5 6 7 8", output: "4", isSample: true },
        { input: "3 3\n1 1 1", output: "0", isSample: false },
        { input: "6 3\n4 4 4 5 6 7", output: "1", isSample: false },
        { input: "7 2\n10 10 20 20 30 40 50", output: "4", isSample: false },
      ],
    },
    {
      title: "Minimum Window With All Characters",
      description: `You are given a string S.  
Find the smallest substring that contains **all distinct characters** present in S.

**Input Format:**
String S

**Output Format:**
Length of smallest such substring.

**Constraints:**
1 ≤ |S| ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "abca", output: "3", isSample: true },
        { input: "aaaa", output: "1", isSample: true },
        { input: "abcabcbb", output: "3", isSample: false },
        { input: "zzzzzz", output: "1", isSample: false },
        { input: "aabcbcdbca", output: "4", isSample: false },
      ],
    },
    {
      title: "Connected Components in Undirected Graph",
      description: `Given an undirected graph with N nodes and M edges,  
count how many connected components the graph has.

**Input Format:**
N M  
M lines: u v

**Output Format:**
Print the number of connected components.

**Constraints:**
1 ≤ N ≤ 10^5  
0 ≤ M ≤ 2×10^5`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "4 2\n1 2\n3 4", output: "2", isSample: true },
        { input: "3 0", output: "3", isSample: true },
        { input: "5 4\n1 2\n2 3\n3 4\n4 5", output: "1", isSample: false },
        { input: "6 2\n1 2\n4 5", output: "4", isSample: false },
        { input: "1 0", output: "1", isSample: false },
      ],
    },
    {
      title: "Longest Increasing Subarray",
      description: `Given an array of N integers,  
find the length of the longest strictly increasing **contiguous** subarray.

**Input Format:**
N  
N integers

**Output Format:**
Print the longest length.

**Constraints:**
1 ≤ N ≤ 10^5`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 2 3 2 5", output: "3", isSample: true },
        { input: "4\n5 4 3 2", output: "1", isSample: true },
        { input: "6\n1 2 3 4 5 6", output: "6", isSample: false },
        { input: "3\n2 2 2", output: "1", isSample: false },
        { input: "7\n1 3 2 4 6 7 8", output: "5", isSample: false },
      ],
    },
    {
      title: "Merge Intervals",
      description: `Given N intervals, merge all overlapping intervals and print the count of merged intervals.

**Input Format:**
N  
N lines: L R

**Output Format:**
Print the count of merged intervals.

**Constraints:**
1 ≤ N ≤ 10^5`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3\n1 3\n2 6\n8 10", output: "2", isSample: true },
        { input: "2\n1 2\n3 4", output: "2", isSample: true },
        { input: "4\n1 10\n2 3\n4 5\n6 7", output: "1", isSample: false },
        { input: "1\n5 5", output: "1", isSample: false },
        { input: "5\n1 4\n4 5\n5 6\n7 8\n10 20", output: "3", isSample: false },
      ],
    },
    {
      title: "Count Islands",
      description: `You are given an N×M grid of '0' and '1'.  
A group of connected '1's (up/down/left/right) is called an island.  
Count how many islands exist.

**Input Format:**
N M  
N lines of grid

**Output Format:**
Print island count.

**Constraints:**
1 ≤ N, M ≤ 1000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "3 3\n110\n010\n001", output: "2", isSample: true },
        { input: "1 1\n1", output: "1", isSample: true },
        { input: "2 2\n00\n00", output: "0", isSample: false },
        { input: "3 3\n111\n111\n111", output: "1", isSample: false },
        {
          input: "4 5\n10001\n00100\n00100\n10001",
          output: "4",
          isSample: false,
        },
      ],
    },
    {
      title: "Sum of Absolute Differences",
      description: `Given a sorted array of N integers,  
compute for each index i the sum of |a[i] − a[j]| over all j.

Output the resulting N values.

**Input Format:**
N  
N sorted integers

**Output Format:**
N integers — answer for each i

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "3\n1 2 3", output: "2 2 2", isSample: true },
        { input: "4\n1 1 1 1", output: "0 0 0 0", isSample: true },
        { input: "1\n5", output: "0", isSample: false },
        { input: "5\n2 4 6 8 10", output: "8 6 6 6 8", isSample: false },
        { input: "3\n5 10 15", output: "10 10 10", isSample: false },
      ],
    },
    {
      title: "Subarray Maximum After K Increments",
      description: `You may increment any element of the array by 1 up to K times total.  
Find the maximum possible length of a subarray with all identical values after increments.

**Input Format:**
N K  
N integers

**Output Format:**
Print the maximum length.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ K ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "5 3\n1 2 4 4 4", output: "4", isSample: true },
        { input: "4 0\n1 1 1 2", output: "3", isSample: true },
        { input: "3 5\n1 2 3", output: "3", isSample: false },
        { input: "6 2\n5 5 5 5 5 5", output: "6", isSample: false },
        { input: "5 1\n10 10 11 11 12", output: "3", isSample: false },
      ],
    },
    {
      title: "Shortest Subarray ≥ X",
      description: `Given N integers and X,  
find the length of the shortest contiguous subarray whose sum is ≥ X.  
Print -1 if no such subarray exists.

**Input Format:**
N X  
N integers

**Output Format:**
Length of shortest subarray, or -1.

**Constraints:**
1 ≤ N ≤ 200000  
-10^9 ≤ a[i], X ≤ 10^14`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "5 7\n2 1 5 1 3", output: "2", isSample: true },
        { input: "3 10\n1 2 3", output: "-1", isSample: true },
        { input: "4 6\n3 3 3 3", output: "2", isSample: false },
        { input: "1 5\n10", output: "1", isSample: false },
        { input: "6 15\n5 1 4 3 2 10", output: "2", isSample: false },
      ],
    },
    {
      title: "Make Array Strictly Increasing",
      description: `You can remove at most one element from the array.  
Check if it is possible to make the array strictly increasing.

**Input Format:**
N  
N integers

**Output Format:**
"YES" or "NO"

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        { input: "5\n1 2 5 3 5", output: "YES", isSample: true },
        { input: "4\n10 1 2 3", output: "YES", isSample: true },
        { input: "3\n3 2 1", output: "NO", isSample: false },
        { input: "1\n7", output: "YES", isSample: false },
        { input: "6\n1 2 3 7 5 6", output: "YES", isSample: false },
      ],
    },
    {
      title: "Longest Substring With ≤ K Distinct Characters",
      description: `Given a string S and an integer K,  
find the length of the longest substring that contains at most K distinct characters.

**Input Format:**
S  
K

**Output Format:**
Print the maximum length.

**Constraints:**
1 ≤ |S| ≤ 200000  
1 ≤ K ≤ 26`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "eceba\n2", output: "3", isSample: true },
        { input: "aa\n1", output: "2", isSample: true },
        { input: "abcabcbb\n3", output: "8", isSample: false },
        { input: "aaaaabbbb\n1", output: "5", isSample: false },
        { input: "aabbcc\n2", output: "4", isSample: false },
      ],
    },
    {
      title: "Longest Balanced Subarray",
      description: `You are given a binary array (0s and 1s).  
Find the longest subarray with an equal number of 0s and 1s.

**Input Format:**
N  
N integers (0 or 1)

**Output Format:**
Length of longest balanced subarray.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "6\n0 1 0 1 1 0", output: "6", isSample: true },
        { input: "4\n0 0 0 0", output: "0", isSample: true },
        { input: "2\n0 1", output: "2", isSample: false },
        { input: "5\n1 1 1 1 1", output: "0", isSample: false },
        { input: "8\n0 0 1 1 0 1 0 1", output: "8", isSample: false },
      ],
    },
    {
      title: "Pair Differences ≤ K",
      description: `Given N integers and a number K,  
count how many pairs (i, j) with i < j satisfy |a[i] − a[j]| ≤ K.

**Input Format:**
N K  
N integers

**Output Format:**
Print the count of valid pairs.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "4 2\n1 3 5 7", output: "1", isSample: true },
        { input: "5 3\n1 2 3 4 5", output: "6", isSample: true },
        { input: "3 0\n5 5 5", output: "3", isSample: false },
        { input: "4 10\n1 20 30 40", output: "0", isSample: false },
        { input: "6 5\n4 8 12 16 20 24", output: "2", isSample: false },
      ],
    },
    {
      title: "Minimum Jumps to Reach End",
      description: `You are given an array where each element a[i] represents the maximum jump length from index i.  
Find the minimum number of jumps needed to reach the end of the array.  
If unreachable, print -1.

**Input Format:**
N  
N integers

**Output Format:**
Minimum jumps or -1.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ a[i] ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "5\n2 3 1 1 4", output: "2", isSample: true },
        { input: "5\n3 2 1 0 4", output: "-1", isSample: true },
        { input: "1\n10", output: "0", isSample: false },
        { input: "3\n1 1 1", output: "2", isSample: false },
        { input: "6\n2 1 2 0 1 4", output: "3", isSample: false },
      ],
    },
    {
      title: "Rearrange to Avoid Adjacent Equal",
      description: `Given a string S, rearrange characters so that no two adjacent characters are equal.  
If possible, print one valid rearrangement; otherwise print -1.

**Input Format:**
String S

**Output Format:**
Rearranged string or -1.

**Constraints:**
1 ≤ |S| ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "aaabb", output: "ababa", isSample: true },
        { input: "aaaa", output: "-1", isSample: true },
        { input: "a", output: "a", isSample: false },
        { input: "aabb", output: "abab", isSample: false },
        { input: "zzzzxy", output: "zxyzxz", isSample: false },
      ],
    },
    {
      title: "Sum of Maximums of All Subarrays",
      description: `Given an array of N integers,  
compute the sum of the maximum element of every subarray.

**Input Format:**
N  
N integers

**Output Format:**
Print the sum.

**Constraints:**
1 ≤ N ≤ 200000  
Values fit in 64-bit integer.`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "3\n1 2 3", output: "10", isSample: true },
        { input: "3\n3 2 1", output: "10", isSample: true },
        { input: "1\n100", output: "100", isSample: false },
        { input: "4\n2 2 2 2", output: "20", isSample: false },
        { input: "5\n1 3 2 5 4", output: "33", isSample: false },
      ],
    },
    {
      title: "Sum of Minimums of All Subarrays",
      description: `Given an array of N integers,  
compute the sum of the minimum element of every subarray.

**Input Format:**
N  
N integers

**Output Format:**
Print the sum.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "3\n1 2 3", output: "4", isSample: true },
        { input: "3\n3 2 1", output: "6", isSample: true },
        { input: "1\n7", output: "7", isSample: false },
        { input: "4\n5 5 5 5", output: "20", isSample: false },
        { input: "5\n3 1 2 4 5", output: "13", isSample: false },
      ],
    },
    {
      title: "Min Cost to Equalize Array",
      description: `You can increment or decrement any element by 1 at cost 1.  
Find the minimum cost to make all elements equal.

**Input Format:**
N  
N integers

**Output Format:**
Minimum cost.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        { input: "3\n1 2 3", output: "2", isSample: true },
        { input: "3\n10 10 10", output: "0", isSample: true },
        { input: "4\n1 100 101 102", output: "201", isSample: false },
        { input: "1\n7", output: "0", isSample: false },
        { input: "5\n3 3 3 3 3", output: "0", isSample: false },
      ],
    },
    {
      title: "Longest Mountain in Array",
      description: `A mountain is defined as: strictly increasing, then strictly decreasing.  
Find the length of the longest mountain.

**Input Format:**
N  
N integers

**Output Format:**
Length of longest mountain.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        { input: "6\n2 1 4 7 3 2", output: "5", isSample: true },
        { input: "3\n1 2 3", output: "0", isSample: true },
        { input: "1\n5", output: "0", isSample: false },
        { input: "5\n1 3 5 4 2", output: "5", isSample: false },
        { input: "7\n2 2 2 2 2 2 2", output: "0", isSample: false },
      ],
    },
    {
      title: "Find All Anagram Substrings",
      description: `Given strings S and P,  
find all starting indices in S where substring of length |P| is an anagram of P.

**Input Format:**
S  
P

**Output Format:**
Indices in increasing order (0-based).

**Constraints:**
1 ≤ |S|, |P| ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "cbaebabacd\nabc", output: "0 6", isSample: true },
        { input: "abab\nab", output: "0 1 2", isSample: true },
        { input: "aaaaa\naaa", output: "0 1 2", isSample: false },
        { input: "xyz\nabc", output: "", isSample: false },
        { input: "bacdgabcda\nabcd", output: "0 5 6", isSample: false },
      ],
    },
    {
      title: "Longest Subarray With Sum K",
      description: `Given N positive integers and value K,  
find the length of the longest subarray whose sum equals K.

**Input Format:**
N K  
N integers (positive)

**Output Format:**
Print the longest length.

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ a[i] ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        { input: "5 7\n2 1 3 2 4", output: "3", isSample: true },
        { input: "3 5\n5 1 2", output: "1", isSample: true },
        { input: "4 100\n10 20 30 40", output: "0", isSample: false },
        { input: "3 3\n1 1 1", output: "3", isSample: false },
        { input: "5 9\n3 3 3 3 3", output: "3", isSample: false },
      ],
    },
    {
      title: "Minimum Insertions to Make Palindrome",
      description: `Given a string S, find the minimum number of insertions needed to make it a palindrome.

**Input Format:**
String S

**Output Format:**
Minimum insertions.

**Constraints:**
1 ≤ |S| ≤ 2000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        { input: "ab", output: "1", isSample: true },
        { input: "race", output: "3", isSample: true },
        { input: "a", output: "0", isSample: false },
        { input: "aa", output: "0", isSample: false },
        { input: "abcda", output: "2", isSample: false },
      ],
    },
    {
      title: "Minimum Window Substring Containing Pattern",
      description: `Given strings S and P,  
find the smallest substring of S that contains all characters of P (including duplicates).  
Print its length or -1 if no such substring exists.

**Input Format:**
S  
P

**Output Format:**
Length of minimum window.

**Constraints:**
1 ≤ |S|, |P| ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "ADOBECODEBANC\nABC", output: "4", isSample: true },
        { input: "a\nb", output: "-1", isSample: true },
        { input: "aa\naa", output: "2", isSample: false },
        { input: "aabbcc\nabc", output: "3", isSample: false },
        { input: "abcdebdde\nbde", output: "3", isSample: false },
      ],
    },
    {
      title: "Longest Subarray With At Most One Zero",
      description: `Given a binary array, find the length of the longest subarray containing at most one zero.

**Input Format:**
N  
N integers (0 or 1)

**Output Format:**
Length of longest valid subarray.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        { input: "6\n1 0 1 1 0 1", output: "4", isSample: true },
        { input: "4\n1 1 1 1", output: "4", isSample: true },
        { input: "3\n0 0 0", output: "1", isSample: false },
        { input: "5\n1 0 0 1 1", output: "2", isSample: false },
        { input: "7\n1 1 0 1 1 1 1", output: "6", isSample: false },
      ],
    },
    {
      title: "Count Distinct in Every Window of Size K",
      description: `Given N integers and a window size K,  
for each window, print how many distinct numbers are inside it.

**Input Format:**
N K  
N integers

**Output Format:**
For each window, print the distinct count.

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ K ≤ N`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "5 3\n1 2 1 3 4", output: "2 3 3", isSample: true },
        { input: "4 1\n5 5 5 5", output: "1 1 1 1", isSample: true },
        { input: "3 3\n1 2 3", output: "3", isSample: false },
        { input: "6 2\n1 2 1 3 2 2", output: "2 2 2 2 1", isSample: false },
        { input: "5 4\n10 20 20 10 30", output: "2 3", isSample: false },
      ],
    },
    {
      title: "Max Product of Two Numbers",
      description: `Given an array of N integers,  
find the maximum product of any two numbers.

**Input Format:**
N  
N integers

**Output Format:**
Maximum product.

**Constraints:**
2 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        { input: "4\n1 2 3 4", output: "12", isSample: true },
        { input: "3\n-10 -20 5", output: "200", isSample: true },
        { input: "2\n100 100", output: "10000", isSample: false },
        { input: "5\n-5 -4 -3 -2 -1", output: "20", isSample: false },
        { input: "6\n1 5 10 2 7 3", output: "70", isSample: false },
      ],
    },
    {
      title: "Minimum Index Sum of Two Arrays",
      description: `Given two arrays of strings A and B,  
find common strings with the minimum sum of their indices.

**Input Format:**
n m  
n strings  
m strings

**Output Format:**
Strings with minimum index sum, space-separated.

**Constraints:**
1 ≤ n, m ≤ 100000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "3 3\na b c\na c d", output: "a", isSample: true },
        { input: "3 3\nx y z\na b c", output: "", isSample: true },
        {
          input: "2 2\nhello world\nworld hello",
          output: "world hello",
          isSample: false,
        },
        { input: "1 1\napple\napple", output: "apple", isSample: false },
        { input: "3 3\np q r\nr p x", output: "p r", isSample: false },
      ],
    },
    {
      title: "Smallest Subsequence With All Distinct Characters",
      description: `Given string S,  
construct the lexicographically smallest subsequence that contains all distinct characters exactly once.

**Input Format:**
String S

**Output Format:**
Smallest subsequence.

**Constraints:**
1 ≤ |S| ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "bcabc", output: "abc", isSample: true },
        { input: "cbacdcbc", output: "acdb", isSample: true },
        { input: "aaaaa", output: "a", isSample: false },
        { input: "bac", output: "abc", isSample: false },
        { input: "edcba", output: "edcba", isSample: false },
      ],
    },
    {
      title: "Max Consecutive Ones With K Flips",
      description: `Given a binary array and integer K,  
you may flip at most K zeros to ones.  
Find the maximum consecutive ones possible.

**Input Format:**
N K  
N integers (0/1)

**Output Format:**
Maximum consecutive ones.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ K ≤ N`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "6 1\n1 0 1 1 0 1", output: "4", isSample: true },
        { input: "5 2\n0 0 0 0 0", output: "2", isSample: true },
        { input: "1 0\n1", output: "1", isSample: false },
        { input: "7 3\n1 1 1 0 0 0 1", output: "6", isSample: false },
        { input: "4 4\n1 1 1 1", output: "4", isSample: false },
      ],
    },
    {
      title: "Count Peaks in Array",
      description: `A peak is an index i where a[i] > a[i−1] and a[i] > a[i+1].  
Count the number of peaks in the array.

**Input Format:**
N  
N integers

**Output Format:**
Peak count.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        { input: "5\n1 3 2 5 4", output: "2", isSample: true },
        { input: "3\n1 2 3", output: "0", isSample: true },
        { input: "1\n10", output: "0", isSample: false },
        { input: "4\n5 4 3 2", output: "0", isSample: false },
        { input: "6\n1 4 2 6 3 2", output: "2", isSample: false },
      ],
    },
    {
      title: "Longest Repeating Character Replacement",
      description: `You may replace at most K characters in a string S  
to make the longest possible substring with all identical characters.

**Input Format:**
S  
K

**Output Format:**
Length of longest possible substring.

**Constraints:**
1 ≤ |S| ≤ 200000  
0 ≤ K ≤ |S|`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "ABAB\n2", output: "4", isSample: true },
        { input: "AABABBA\n1", output: "4", isSample: true },
        { input: "AAAAA\n0", output: "5", isSample: false },
        { input: "ABCDE\n2", output: "3", isSample: false },
        { input: "BAAAB\n2", output: "5", isSample: false },
      ],
    },
    {
      title: "Minimum Operations to Make Array Equal",
      description: `You are given an array A of N integers.  
In one operation, you may choose any i < j and set A[j] = A[i].  
Find the minimum number of operations required to make all elements equal.

Hint: You can propagate duplicates forward optimally.

**Input Format:**
N  
N integers

**Output Format:**
Minimum operations.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "5\n1 1 2 1 1", output: "1", isSample: true },
        { input: "4\n5 5 5 5", output: "0", isSample: true },
        { input: "3\n1 2 3", output: "2", isSample: false },
        { input: "6\n2 2 1 1 1 2", output: "2", isSample: false },
        { input: "7\n4 4 4 1 4 4 4", output: "1", isSample: false },
      ],
    },
    {
      title: "Kth Smallest Pair Distance",
      description: `Given an array A of N integers,  
consider all pairwise absolute differences |A[i] - A[j]|.  
Find the K-th smallest among them.

**Input Format:**
N K  
N integers

**Output Format:**
K-th smallest difference.

**Constraints:**
2 ≤ N ≤ 200000  
1 ≤ K ≤ N*(N-1)/2`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "4 3\n1 3 4 9", output: "2", isSample: true },
        { input: "3 1\n10 10 10", output: "0", isSample: true },
        { input: "5 7\n1 5 3 2 8", output: "2", isSample: false },
        { input: "4 6\n4 2 1 10", output: "8", isSample: false },
        { input: "6 4\n1 2 3 100 200 300", output: "1", isSample: false },
      ],
    },
    {
      title: "Minimum Deletions to Make String Balanced",
      description: `Given a string S with only 'a' and 'b',  
you want all 'a's to appear before all 'b's.  
Find the minimum number of deletions required.

**Input Format:**
S

**Output Format:**
Minimum deletions.

**Constraints:**
1 ≤ |S| ≤ 300000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        { input: "aababb", output: "2", isSample: true },
        { input: "bbbb", output: "0", isSample: true },
        { input: "aaaa", output: "0", isSample: false },
        { input: "baba", output: "2", isSample: false },
        { input: "abbabaaabb", output: "4", isSample: false },
      ],
    },
    {
      title: "Split Array into K Parts Minimizing Largest Sum",
      description: `Split the array into exactly K non-empty contiguous parts.  
Minimize the maximum sum among all parts.

**Input Format:**
N K  
N integers

**Output Format:**
Minimum possible largest part sum.

**Constraints:**
1 ≤ K ≤ N ≤ 200000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "5 2\n1 2 3 4 5", output: "9", isSample: true },
        { input: "3 3\n10 20 30", output: "30", isSample: true },
        { input: "4 2\n7 2 5 10", output: "12", isSample: false },
        { input: "6 3\n1 4 4 3 2 5", output: "7", isSample: false },
        { input: "5 1\n2 2 2 2 2", output: "10", isSample: false },
      ],
    },
    {
      title: "Longest Increasing Path in Grid",
      description: `Given an N×M grid of integers,  
you may move up/down/left/right to a cell with a strictly larger value.  
Find the maximum path length.

**Input Format:**
N M  
Grid of N rows

**Output Format:**
Length of longest increasing path.

**Constraints:**
1 ≤ N, M ≤ 1000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "3 3\n9 9 4\n6 6 8\n2 1 1", output: "4", isSample: true },
        { input: "1 1\n5", output: "1", isSample: true },
        { input: "2 2\n1 2\n3 4", output: "3", isSample: false },
        { input: "3 3\n1 2 3\n2 2 4\n3 2 5", output: "5", isSample: false },
        { input: "2 3\n5 4 3\n2 1 0", output: "1", isSample: false },
      ],
    },
    {
      title: "Tree Diameter After Adding One Edge",
      description: `You are given a tree with N nodes.  
You may add **one** extra edge between any two nodes.  
Find the minimum possible diameter after adding the edge.

**Input Format:**
N  
N-1 edges

**Output Format:**
Minimum diameter.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "3\n1 2\n2 3", output: "1", isSample: true },
        { input: "4\n1 2\n2 3\n3 4", output: "2", isSample: true },
        { input: "5\n1 2\n1 3\n3 4\n4 5", output: "2", isSample: false },
        { input: "6\n1 2\n2 3\n3 4\n4 5\n5 6", output: "3", isSample: false },
        { input: "5\n1 2\n2 3\n3 4\n2 5", output: "2", isSample: false },
      ],
    },
    {
      title: "Maximum XOR of Any Subarray",
      description: `Find the maximum XOR value among all subarrays of array A.

**Input Format:**
N  
N integers

**Output Format:**
Maximum XOR.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ A[i] < 2^31`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3\n1 2 3", output: "3", isSample: true },
        { input: "3\n5 1 7", output: "7", isSample: true },
        { input: "4\n8 1 2 12", output: "13", isSample: false },
        { input: "5\n4 6 7 2 9", output: "15", isSample: false },
        { input: "3\n0 0 0", output: "0", isSample: false },
      ],
    },
    {
      title: "Shortest Path With Edge Penalties",
      description: `You are given a weighted graph.  
Every time you use an edge of weight > X, you pay an additional penalty P.  
Find the shortest path from node 1 to node N.

**Input Format:**
N M X P  
M edges: u v w

**Output Format:**
Minimum cost.

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ M ≤ 300000  
1 ≤ w ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 1024,
      testCases: [
        {
          input: "3 3 5 10\n1 2 4\n2 3 6\n1 3 20",
          output: "20",
          isSample: true,
        },
        { input: "3 2 5 10\n1 2 10\n2 3 10", output: "40", isSample: true },
        {
          input: "4 4 3 5\n1 2 1\n2 3 10\n3 4 2\n1 4 20",
          output: "13",
          isSample: false,
        },
        { input: "2 1 1 100\n1 2 1", output: "1", isSample: false },
        {
          input: "5 5 10 3\n1 2 5\n2 3 15\n3 4 20\n4 5 5\n1 5 50",
          output: "28",
          isSample: false,
        },
      ],
    },
    {
      title: "Count Arrays With Exactly K Inversions",
      description: `Count permutations of size N that have exactly K inversions.  
Return the answer modulo 1e9+7.

**Input Format:**
N K

**Output Format:**
Count modulo 1e9+7.

**Constraints:**
1 ≤ N ≤ 2000  
0 ≤ K ≤ 2000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 1024,
      testCases: [
        { input: "3 0", output: "1", isSample: true },
        { input: "3 1", output: "2", isSample: true },
        { input: "4 2", output: "5", isSample: false },
        { input: "5 5", output: "22", isSample: false },
        { input: "6 3", output: "16", isSample: false },
      ],
    },
    {
      title: "Maximum Sum Increasing Subsequence (Large Constraints)",
      description: `Given N integers,  
find the maximum sum of a strictly increasing subsequence.

**Input Format:**
N  
N integers

**Output Format:**
Maximum sum.

**Constraints:**
1 ≤ N ≤ 200000  
-10^9 ≤ A[i] ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "5\n1 101 2 3 100", output: "106", isSample: true },
        { input: "4\n10 5 4 3", output: "10", isSample: true },
        { input: "6\n5 1 6 2 7 3", output: "18", isSample: false },
        { input: "3\n100 200 300", output: "600", isSample: false },
        { input: "5\n-1 -2 -3 -4 -5", output: "-1", isSample: false },
      ],
    },
    {
      title: "Max Sum of Two Non-Overlapping Subarrays",
      description: `You are given an array A and two integers L and M.  
Find the maximum total sum of two **non-overlapping** subarrays of lengths L and M (in any order).

**Input Format:**
N L M  
N integers

**Output Format:**
Maximum sum.

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ L, M ≤ N`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "5 1 2\n1 2 3 4 5", output: "12", isSample: true },
        { input: "7 2 2\n1 5 2 3 7 1 2", output: "17", isSample: true },
        { input: "4 1 1\n10 20 30 40", output: "70", isSample: false },
        { input: "6 3 1\n2 2 2 2 2 2", output: "10", isSample: false },
        { input: "8 2 3\n4 3 5 2 1 8 9 6", output: "25", isSample: false },
      ],
    },
    {
      title: "Maximum Score Path in DAG",
      description: `You are given a DAG with N nodes and M edges.  
Each node has a score.  
Find the maximum score reachable on any valid path starting from node 1.

**Input Format:**
N M  
Scores for N nodes  
M edges: u v (directed)

**Output Format:**
Maximum score.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ M ≤ 300000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 1024,
      testCases: [
        {
          input: "4 4\n1 2 3 4\n1 2\n2 3\n3 4\n1 4",
          output: "10",
          isSample: true,
        },
        { input: "3 1\n5 6 7\n1 3", output: "12", isSample: true },
        { input: "3 0\n1 2 3", output: "1", isSample: false },
        {
          input: "5 4\n3 2 5 10 7\n1 2\n2 4\n1 3\n3 5",
          output: "15",
          isSample: false,
        },
        {
          input: "6 5\n1 10 1 10 1 10\n1 2\n2 3\n3 4\n4 5\n5 6",
          output: "32",
          isSample: false,
        },
      ],
    },
    {
      title: "Max OR After Removing One Element",
      description: `Given an array of N integers,  
remove exactly one element to **maximize** the bitwise OR of the remaining array.

**Input Format:**
N  
N integers

**Output Format:**
Maximum OR possible.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ A[i] < 2^31`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        { input: "3\n1 2 4", output: "6", isSample: true },
        { input: "3\n7 7 7", output: "7", isSample: true },
        { input: "4\n1 3 5 7", output: "7", isSample: false },
        { input: "5\n8 1 1 1 8", output: "9", isSample: false },
        { input: "2\n0 0", output: "0", isSample: false },
      ],
    },
    {
      title: "Maximum Sum Rectangle in a Matrix",
      description: `You are given an N×M matrix of integers.  
Find the maximum sum of any rectangle (submatrix).

**Input Format:**
N M  
Matrix rows

**Output Format:**
Maximum sum.

**Constraints:**
1 ≤ N, M ≤ 1000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 3,
      memoryLimit: 1024,
      testCases: [
        { input: "2 3\n1 2 -1\n-3 4 5", output: "9", isSample: true },
        { input: "1 1\n-5", output: "-5", isSample: true },
        { input: "2 2\n1 1\n1 1", output: "4", isSample: false },
        {
          input: "3 3\n-1 -1 -1\n-1 10 -1\n-1 -1 -1",
          output: "10",
          isSample: false,
        },
        {
          input: "3 4\n1 -2 3 4\n-1 2 2 -3\n3 -1 -2 4",
          output: "8",
          isSample: false,
        },
      ],
    },
    {
      title: "Reachable Nodes With Cost Limit",
      description: `You are given an undirected weighted graph.  
You start at node 1.  
You may traverse edges as long as total cost ≤ K.  
Count how many nodes are reachable.

**Input Format:**
N M K  
Edges: u v w

**Output Format:**
Reachable node count.

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ M ≤ 300000  
1 ≤ w ≤ 10^9  
1 ≤ K ≤ 10^15`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 3,
      memoryLimit: 1024,
      testCases: [
        { input: "3 3 5\n1 2 3\n2 3 4\n1 3 10", output: "2", isSample: true },
        { input: "2 1 100\n1 2 50", output: "2", isSample: true },
        { input: "3 2 1\n1 2 5\n2 3 5", output: "1", isSample: false },
        {
          input: "4 4 10\n1 2 3\n2 3 3\n3 4 3\n1 4 20",
          output: "4",
          isSample: false,
        },
        {
          input: "5 4 3\n1 2 2\n2 3 2\n3 4 2\n4 5 2",
          output: "2",
          isSample: false,
        },
      ],
    },
    {
      title: "Minimum Cost to Make Graph Strongly Connected",
      description: `You are given a directed graph with N nodes and edges.  
Each missing edge u→v costs 1 to add.  
Find the minimum cost to make the graph strongly connected.

**Input Format:**
N M  
Edges: u v

**Output Format:**
Minimum added edges.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ M ≤ 300000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 1024,
      testCases: [
        { input: "3 3\n1 2\n2 3\n3 1", output: "0", isSample: true },
        { input: "3 2\n1 2\n2 3", output: "1", isSample: true },
        { input: "4 0", output: "4", isSample: false },
        { input: "5 4\n1 2\n2 1\n3 4\n4 5", output: "2", isSample: false },
        { input: "4 3\n1 2\n2 3\n3 4", output: "1", isSample: false },
      ],
    },
    {
      title: "Longest Path With ≤ K Turns",
      description: `Given a grid with obstacles (#) and free cells (.),  
start at any free cell and find the longest path you can travel while making at most K turns  
(a turn is a change in direction).

**Input Format:**
N M K  
Grid rows

**Output Format:**
Maximum path length.

**Constraints:**
1 ≤ N, M ≤ 1000  
0 ≤ K ≤ 10`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 3,
      memoryLimit: 1024,
      testCases: [
        { input: "3 3 1\n...\n...\n...", output: "5", isSample: true },
        { input: "3 3 0\n...\n...\n...", output: "2", isSample: true },
        { input: "3 3 2\n.#.\n...\n.#.", output: "7", isSample: false },
        { input: "2 2 1\n#.\n.#", output: "1", isSample: false },
        {
          input: "4 4 3\n....\n.##.\n....\n....",
          output: "11",
          isSample: false,
        },
      ],
    },
    {
      title: "Count Ways to Partition Array Into Increasing Segments",
      description: `You must partition the array into any number of **strictly increasing** contiguous segments.  
Count how many valid partitions exist.  
Return answer modulo 1e9+7.

**Input Format:**
N  
N integers

**Output Format:**
Number of partitions.

**Constraints:**
1 ≤ N ≤ 200000  
-10^9 ≤ A[i] ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 1024,
      testCases: [
        { input: "3\n1 2 3", output: "4", isSample: true },
        { input: "3\n3 2 1", output: "1", isSample: true },
        { input: "4\n1 2 1 2", output: "3", isSample: false },
        { input: "1\n5", output: "1", isSample: false },
        { input: "5\n1 3 5 4 6", output: "4", isSample: false },
      ],
    },
    {
      title: "Maximum Median After K Operations",
      description: `You may increment any element of array A by 1, using at most K increments.  
Find the maximum possible median of A.

**Input Format:**
N K  
N integers

**Output Format:**
Maximum median.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ K ≤ 10^18`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3 3\n1 2 3", output: "3", isSample: true },
        { input: "5 10\n1 1 1 1 1", output: "3", isSample: true },
        { input: "1 100\n5", output: "105", isSample: false },
        { input: "4 5\n4 4 4 4", output: "5", isSample: false },
        { input: "5 7\n2 5 3 1 7", output: "7", isSample: false },
      ],
    },
    {
      title: "Minimum Removals to Make Bitonic Sequence",
      description: `A bitonic sequence first strictly increases then strictly decreases.  
Find the minimum number of elements to remove to make the array bitonic.

**Input Format:**
N  
N integers

**Output Format:**
Minimum removals.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "5\n1 3 5 4 2", output: "0", isSample: true },
        { input: "4\n1 2 3 4", output: "3", isSample: true },
        { input: "5\n5 4 3 2 1", output: "4", isSample: false },
        { input: "6\n1 2 1 2 1 2", output: "3", isSample: false },
        { input: "7\n1 4 6 3 2 5 4", output: "2", isSample: false },
      ],
    },
    {
      title: "Longest Subsequence With Exactly K Peaks",
      description: `A peak is an index i where a[i] > a[i−1] and a[i] > a[i+1].  
Find the length of the **longest subsequence** (not necessarily contiguous) that has **exactly K peaks**.

**Input Format:**
N K  
N integers

**Output Format:**
Maximum subsequence length.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ K ≤ N`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 3,
      memoryLimit: 1024,
      testCases: [
        { input: "5 1\n1 3 2 5 4", output: "4", isSample: true },
        { input: "5 0\n1 2 3 4 5", output: "5", isSample: true },
        { input: "6 2\n2 1 4 3 6 5", output: "6", isSample: false },
        { input: "4 1\n4 3 2 1", output: "3", isSample: false },
        { input: "7 2\n1 5 2 6 3 7 4", output: "7", isSample: false },
      ],
    },
    {
      title: "Minimum Cost to Make Matrix Symmetric",
      description: `You are given a matrix A of size N×M.  
You can increment or decrement any element by 1 at cost 1.  
Make the matrix symmetric along both horizontal and vertical axes.  
Find the minimum cost.

**Input Format:**
N M  
Matrix

**Output Format:**
Minimum cost.

**Constraints:**
1 ≤ N, M ≤ 1000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 3,
      memoryLimit: 1024,
      testCases: [
        { input: "2 2\n1 2\n3 4", output: "4", isSample: true },
        { input: "1 3\n1 2 3", output: "2", isSample: true },
        { input: "3 3\n1 2 3\n4 5 6\n7 8 9", output: "12", isSample: false },
        { input: "2 3\n1 1 1\n1 1 1", output: "0", isSample: false },
        {
          input: "3 4\n1 4 3 2\n5 6 7 8\n9 10 11 12",
          output: "20",
          isSample: false,
        },
      ],
    },
    {
      title: "Maximum XOR Path in Tree",
      description: `You are given a tree with N nodes.  
Each node has a value.  
Find the maximum XOR obtainable on any path in the tree.

**Input Format:**
N  
Values (N integers)  
N-1 edges

**Output Format:**
Maximum XOR.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ value < 2^31`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "3\n1 2 3\n1 2\n2 3", output: "3", isSample: true },
        { input: "4\n5 1 7 3\n1 2\n2 3\n2 4", output: "6", isSample: true },
        { input: "2\n10 20\n1 2", output: "30", isSample: false },
        {
          input: "5\n8 3 5 1 12\n1 2\n1 3\n3 4\n4 5",
          output: "13",
          isSample: false,
        },
        { input: "3\n0 0 0\n1 2\n2 3", output: "0", isSample: false },
      ],
    },
    {
      title: "Smallest Range Covering K Lists",
      description: `You are given K sorted lists of integers.  
Find the smallest inclusive range [L, R] that contains **at least one element** from each list.

**Input Format:**
K  
For each list: length Li, then Li integers

**Output Format:**
L R

**Constraints:**
1 ≤ K ≤ 200000  
Total numbers ≤ 200000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 3,
      memoryLimit: 1024,
      testCases: [
        {
          input: "3\n3 4 10 15\n3 1 5 20\n3 6 9 12",
          output: "4 6",
          isSample: true,
        },
        { input: "2\n2 1 2\n2 3 4", output: "2 3", isSample: true },
        { input: "2\n1 100\n1 200", output: "100 200", isSample: false },
        { input: "3\n1 1\n1 2\n1 3", output: "1 3", isSample: false },
        { input: "3\n2 5 8\n2 4 9\n2 3 10", output: "4 5", isSample: false },
      ],
    },
    {
      title: "Minimum Deletions to Sort by Frequency",
      description: `Given a string S, let freq(c) be frequency of character c.  
You want freq values to be strictly decreasing (largest first).  
You may delete characters from S.  
Find minimum deletions required.

**Input Format:**
S

**Output Format:**
Minimum deletions.

**Constraints:**
1 ≤ |S| ≤ 200000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "aaabbbcc", output: "1", isSample: true },
        { input: "abc", output: "0", isSample: true },
        { input: "aaaa", output: "0", isSample: false },
        { input: "aab", output: "0", isSample: false },
        { input: "bbbbaaaa", output: "2", isSample: false },
      ],
    },
    {
      title: "Maximum Points on a Line (Large N)",
      description: `Given N points (xi, yi),  
find the maximum number of points that lie on the same straight line.

**Input Format:**
N  
N pairs of integers

**Output Format:**
Maximum count.

**Constraints:**
1 ≤ N ≤ 200000  
Coordinates ≤ 1e9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 3,
      memoryLimit: 1024,
      testCases: [
        { input: "3\n1 1\n2 2\n3 3", output: "3", isSample: true },
        { input: "3\n1 1\n2 2\n3 4", output: "2", isSample: true },
        { input: "1\n5 5", output: "1", isSample: false },
        { input: "4\n0 0\n1 1\n1 0\n2 1", output: "3", isSample: false },
        { input: "5\n1 2\n2 3\n3 5\n4 7\n5 9", output: "5", isSample: false },
      ],
    },
    {
      title: "Minimum Colors for Graph Coloring (Tree)",
      description: `You are given a tree of N nodes.  
You must color each node with an integer color such that  
no adjacent nodes differ by more than 1 in color value.  
Minimize the number of distinct colors used.

**Input Format:**
N  
Edges (N-1 lines)

**Output Format:**
Minimum number of colors.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        { input: "3\n1 2\n2 3", output: "2", isSample: true },
        { input: "1", output: "1", isSample: true },
        { input: "4\n1 2\n1 3\n1 4", output: "2", isSample: false },
        { input: "5\n1 2\n2 3\n3 4\n4 5", output: "3", isSample: false },
        { input: "6\n1 2\n1 3\n2 4\n2 5\n3 6", output: "3", isSample: false },
      ],
    },
    {
      title: "Shortest Path Visiting All Special Nodes",
      description: `You have a graph with N nodes and M edges.  
There are K special nodes.  
Find the shortest path length that **starts anywhere** and visits all special nodes at least once (order doesn't matter).

Think of it as multi-source multi-destination TSP on a graph.

**Input Format:**
N M K  
List of K special nodes  
Edges: u v w

**Output Format:**
Minimum distance or -1.

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ M ≤ 300000  
1 ≤ K ≤ 20`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 4,
      memoryLimit: 1024,
      testCases: [
        {
          input: "4 4 2\n1 4\n1 2 5\n2 3 5\n3 4 5\n1 4 20",
          output: "15",
          isSample: true,
        },
        { input: "3 2 1\n2\n1 2 3\n2 3 3", output: "0", isSample: true },
        {
          input: "5 4 2\n1 5\n1 2 1\n2 3 1\n3 4 1\n4 5 1",
          output: "4",
          isSample: false,
        },
        { input: "3 1 3\n1 2 3\n1 2 10", output: "-1", isSample: false },
        {
          input:
            "6 7 3\n1 3 6\n1 2 2\n2 3 2\n3 4 2\n4 5 2\n5 6 2\n1 6 10\n2 5 3",
          output: "7",
          isSample: false,
        },
      ],
    },
    {
      title: "Maximum Product of Path in Grid",
      description: `You are given an N×M grid containing positive and negative integers.  
You can move only right or down.  
Find the maximum product obtainable on any path from top-left to bottom-right.

**Input Format:**
N M  
Grid values

**Output Format:**
Maximum product.

**Constraints:**
1 ≤ N, M ≤ 1000  
Values in range [-9, 9]`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 3,
      memoryLimit: 1024,
      testCases: [
        { input: "2 2\n1 -1\n-1 1", output: "1", isSample: true },
        { input: "2 3\n1 2 3\n4 5 6", output: "720", isSample: true },
        { input: "1 1\n-5", output: "-5", isSample: false },
        {
          input: "3 3\n1 -2 3\n4 -5 6\n7 -8 9",
          output: "2016",
          isSample: false,
        },
        { input: "3 3\n1 1 1\n1 -1 1\n1 1 1", output: "1", isSample: false },
      ],
    },
    {
      title: "Count Good Subarrays (Sum % K == 0)",
      description: `Given an array A of N integers and integer K,  
count the number of subarrays whose sum is divisible by K.

**Input Format:**
N K  
N integers

**Output Format:**
Number of good subarrays.

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ K ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        { input: "5 5\n1 2 3 4 5", output: "4", isSample: true },
        { input: "3 3\n3 3 3", output: "6", isSample: true },
        { input: "4 2\n1 1 1 1", output: "4", isSample: false },
        { input: "1 7\n7", output: "1", isSample: false },
        { input: "6 4\n4 8 12 3 1 2", output: "6", isSample: false },
      ],
    },
    {
      title: "Minimum Edges to Add for Eulerian Path",
      description: `You are given an undirected graph with N nodes and M edges.  
You may add edges between any two nodes.  
Find the **minimum number of edges** required so that the resulting graph has an **Eulerian path**.

**Input Format:**
N M  
M lines: u v

**Output Format:**
Minimum edges needed.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ M ≤ 300000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 1024,
      testCases: [
        { input: "3 2\n1 2\n2 3", output: "0", isSample: true },
        { input: "3 0", output: "1", isSample: true },
        { input: "4 2\n1 2\n3 4", output: "1", isSample: false },
        { input: "5 1\n1 2", output: "2", isSample: false },
        { input: "2 1\n1 2", output: "0", isSample: false },
      ],
    },
    {
      title: "Maximum Length Chain of Pairs",
      description: `You are given N pairs (a, b).  
A pair (a, b) can follow another pair (c, d) if b < c.  
Find the maximum length of chain you can form.

**Input Format:**
N  
N lines: a b

**Output Format:**
Maximum chain length.

**Constraints:**
1 ≤ N ≤ 200000  
|a|, |b| ≤ 1e9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "3\n1 2\n3 4\n2 3", output: "2", isSample: true },
        { input: "3\n5 24\n39 60\n15 28", output: "2", isSample: true },
        { input: "1\n1 1", output: "1", isSample: false },
        { input: "4\n5 6\n1 2\n2 3\n3 4", output: "3", isSample: false },
        {
          input: "5\n1 10\n11 20\n2 3\n21 30\n31 40",
          output: "4",
          isSample: false,
        },
      ],
    },
    {
      title: "Minimum Swaps to Sort by Parity Blocks",
      description: `Given an array A of N integers,  
you want all even numbers first (in any order), then all odd numbers (any order).  
You may swap any two elements.  
Find minimum swaps required.

**Input Format:**
N  
N integers

**Output Format:**
Minimum swaps.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 2 3 4 5", output: "1", isSample: true },
        { input: "4\n2 4 6 8", output: "0", isSample: true },
        { input: "4\n1 3 5 7", output: "0", isSample: false },
        { input: "6\n2 1 4 3 6 5", output: "3", isSample: false },
        { input: "5\n1 2 1 2 1", output: "2", isSample: false },
      ],
    },
    {
      title: "Shortest Path With At Most K Edge Skips",
      description: `You may skip (ignore) the weight of up to K edges on a path from 1 to N.  
All skipped edges count as weight 0.  
Find the minimum possible distance.

**Input Format:**
N M K  
Edges: u v w

**Output Format:**
Shortest distance.

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ M ≤ 300000  
0 ≤ K ≤ 50  
1 ≤ w ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 3,
      memoryLimit: 1024,
      testCases: [
        { input: "3 3 1\n1 2 5\n2 3 5\n1 3 20", output: "5", isSample: true },
        { input: "3 2 0\n1 2 5\n2 3 5", output: "10", isSample: true },
        {
          input: "4 3 2\n1 2 10\n2 3 10\n3 4 10",
          output: "0",
          isSample: false,
        },
        { input: "2 1 1\n1 2 100", output: "0", isSample: false },
        {
          input: "4 4 1\n1 2 3\n2 4 10\n1 3 5\n3 4 2",
          output: "5",
          isSample: false,
        },
      ],
    },
    {
      title: "Count Good Partitions",
      description: `Partition array A into contiguous segments so that  
**no two adjacent segments have the same sum**.

Count valid partitions modulo 1e9+7.

**Input Format:**
N  
N integers

**Output Format:**
Number of partitions.

**Constraints:**
1 ≤ N ≤ 200000  
|A[i]| ≤ 1e9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 1024,
      testCases: [
        { input: "3\n1 2 3", output: "4", isSample: true },
        { input: "3\n1 1 1", output: "3", isSample: true },
        { input: "1\n5", output: "1", isSample: false },
        { input: "4\n2 2 2 2", output: "5", isSample: false },
        { input: "5\n1 2 1 2 1", output: "8", isSample: false },
      ],
    },
    {
      title: "Max Area Rectangle With Sum ≤ K",
      description: `Given an N×M integer matrix and integer K,  
find the rectangle with the **largest area** such that its sum ≤ K.

**Input Format:**
N M K  
Matrix rows

**Output Format:**
Maximum area.

**Constraints:**
1 ≤ N, M ≤ 300  
Sum values fit in 64-bit integer.`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 3,
      memoryLimit: 1024,
      testCases: [
        { input: "2 2 3\n1 1\n1 1", output: "4", isSample: true },
        { input: "2 3 4\n2 2 2\n2 2 2", output: "2", isSample: true },
        { input: "3 3 10\n1 2 3\n4 5 6\n7 8 9", output: "4", isSample: false },
        { input: "1 4 5\n1 2 3 4", output: "2", isSample: false },
        { input: "3 3 5\n1 1 1\n1 1 1\n3 3 3", output: "6", isSample: false },
      ],
    },
    {
      title: "Maximum Beauty After Up To K Removals",
      description: `Beauty of array = max(arr) − min(arr).  
You may remove **up to K elements** from anywhere.  
Find minimum possible beauty after removals.

**Input Format:**
N K  
N integers

**Output Format:**
Minimum beauty.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ K < N`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 256,
      testCases: [
        { input: "5 1\n1 5 6 14 15", output: "9", isSample: true },
        { input: "5 2\n1 5 6 14 15", output: "5", isSample: true },
        { input: "4 1\n10 10 10 10", output: "0", isSample: false },
        { input: "3 1\n1 100 200", output: "100", isSample: false },
        { input: "6 3\n1 2 3 100 200 300", output: "2", isSample: false },
      ],
    },
    {
      title: "Max Score Removing Intervals",
      description: `You are given N intervals.  
Removing an interval gives you points equal to its length.  
You cannot remove overlapping intervals.

Find the maximum score possible.

**Input Format:**
N  
N lines: L R

**Output Format:**
Maximum score.

**Constraints:**
1 ≤ N ≤ 200000  
|L|,|R| ≤ 1e9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3\n1 2\n2 5\n6 9", output: "7", isSample: true },
        { input: "3\n1 10\n2 3\n4 5", output: "9", isSample: true },
        { input: "1\n5 5", output: "0", isSample: false },
        { input: "4\n1 3\n2 4\n5 8\n6 7", output: "4", isSample: false },
        {
          input: "5\n1 4\n4 7\n7 10\n10 20\n1 100",
          output: "19",
          isSample: false,
        },
      ],
    },
    {
      title: "Distance to Farther Side on Tree",
      description: `Given a tree with N nodes,  
for each node, compute the maximum distance to any leaf **not in its own subtree**.

**Input Format:**
N  
Edges (N-1)

**Output Format:**
N integers — answer for each node.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "3\n1 2\n2 3", output: "2 1 2", isSample: true },
        { input: "1", output: "0", isSample: true },
        { input: "4\n1 2\n1 3\n1 4", output: "1 2 2 2", isSample: false },
        {
          input: "5\n1 2\n2 3\n3 4\n4 5",
          output: "4 3 2 3 4",
          isSample: false,
        },
        {
          input: "6\n1 2\n2 3\n2 4\n4 5\n4 6",
          output: "3 2 3 2 3 3",
          isSample: false,
        },
      ],
    },
    {
      title: "Kth Smallest Sum of Two Sorted Arrays",
      description: `You are given two sorted arrays A and B.  
Form all possible sums A[i] + B[j].  
Find the K-th smallest sum.

**Input Format:**
N M K  
A (N sorted ints)  
B (M sorted ints)

**Output Format:**
K-th smallest sum.

**Constraints:**
1 ≤ N, M ≤ 200000  
1 ≤ K ≤ N*M`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 3,
      memoryLimit: 1024,
      testCases: [
        { input: "3 3 4\n1 2 3\n2 3 4", output: "5", isSample: true },
        { input: "2 2 1\n5 6\n7 8", output: "12", isSample: true },
        { input: "1 3 2\n3\n4 5 6", output: "8", isSample: false },
        { input: "3 1 3\n1 10 20\n5", output: "25", isSample: false },
        { input: "3 3 9\n1 2 3\n1 2 3", output: "6", isSample: false },
      ],
    },
    {
      title: "Alternating Index Sum",
      description: `Given an array A of N integers, compute the value:
A[1] - A[2] + A[3] - A[4] + ... (1-indexed).

**Input Format:**
N  
N integers

**Output Format:**
Print the alternating sum.

**Constraints:**
1 ≤ N ≤ 200000  
|A[i]| ≤ 1e9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 2 3 4 5", output: "3", isSample: true },
        { input: "4\n10 1 10 1", output: "18", isSample: true },
        { input: "1\n7", output: "7", isSample: false },
        { input: "3\n5 5 5", output: "5", isSample: false },
        { input: "6\n2 4 6 8 10 12", output: "-18", isSample: false },
      ],
    },
    {
      title: "Count Distinct in Sliding Window",
      description: `Given an array of N integers and a window size K,  
for each window, count the number of distinct elements.

**Input Format:**
N K  
N integers

**Output Format:**
Print N-K+1 integers — distinct counts per window.

**Constraints:**
1 ≤ K ≤ N ≤ 200000  
|A[i]| ≤ 1e9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "5 3\n1 2 1 3 2", output: "2 3 3", isSample: true },
        { input: "4 2\n1 1 1 1", output: "1 1 1", isSample: true },
        { input: "3 1\n4 5 6", output: "1 1 1", isSample: false },
        { input: "6 3\n1 2 3 4 5 6", output: "3 3 3 3", isSample: false },
        { input: "7 4\n1 2 2 3 3 4 4", output: "3 3 2 2", isSample: false },
      ],
    },
    {
      title: "Maximum Consecutive Ones After One Flip",
      description: `You may flip **exactly one** zero to one in a binary array.  
Find the maximum number of consecutive ones after the flip.

**Input Format:**
N  
Binary array of N integers (0/1)

**Output Format:**
Maximum consecutive ones.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 0 1 1 0", output: "4", isSample: true },
        { input: "4\n1 1 1 1", output: "4", isSample: true },
        { input: "3\n0 0 0", output: "1", isSample: false },
        { input: "6\n1 1 0 1 1 1", output: "6", isSample: false },
        { input: "7\n1 0 1 0 1 0 1", output: "3", isSample: false },
      ],
    },
    {
      title: "String Compression Length",
      description: `Compress a string by replacing consecutive repeating characters  
with character + count.  
Return the length of the compressed string (not the string itself).

Example: "aaabb" → "a3b2" → length = 4.

**Input Format:**
S

**Output Format:**
Length of compressed form.

**Constraints:**
1 ≤ |S| ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "aaabb", output: "4", isSample: true },
        { input: "abcd", output: "4", isSample: true },
        { input: "aaaaaaaaaa", output: "3", isSample: false },
        { input: "aabbaa", output: "6", isSample: false },
        { input: "zzzzzy", output: "3", isSample: false },
      ],
    },
    {
      title: "Prefix With Maximum Average",
      description: `Given an array A, find the **prefix length** (1..N)  
whose average value is maximum.  
If multiple prefixes tie, choose the smallest length.

**Input Format:**
N  
N integers

**Output Format:**
Length of prefix with max average.

**Constraints:**
1 ≤ N ≤ 200000  
|A[i]| ≤ 1e9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 2 3 4 5", output: "5", isSample: true },
        { input: "3\n5 1 1", output: "1", isSample: true },
        { input: "4\n2 2 2 2", output: "1", isSample: false },
        { input: "5\n-1 -2 -3 -4 -5", output: "1", isSample: false },
        { input: "6\n1 100 2 3 4 5", output: "2", isSample: false },
      ],
    },
    {
      title: "Count Balanced Substrings",
      description: `A substring is balanced if it contains equal number of 'A' and 'B'.  
Count all balanced substrings.

**Input Format:**
S (only 'A' and 'B')

**Output Format:**
Count of balanced substrings.

**Constraints:**
1 ≤ |S| ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "AABB", output: "4", isSample: true },
        { input: "ABAB", output: "4", isSample: true },
        { input: "AAAA", output: "0", isSample: false },
        { input: "ABBA", output: "2", isSample: false },
        { input: "BABABA", output: "6", isSample: false },
      ],
    },
    {
      title: "Longest Subarray With Sum ≤ K",
      description: `Find the longest subarray whose sum is ≤ K.

**Input Format:**
N K  
N integers

**Output Format:**
Maximum length.

**Constraints:**
1 ≤ N ≤ 200000  
|A[i]| ≤ 1e9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "5 5\n1 2 -1 3 1", output: "5", isSample: true },
        { input: "5 3\n2 2 2 2 2", output: "1", isSample: true },
        { input: "1 10\n5", output: "1", isSample: false },
        { input: "4 0\n1 -1 1 -1", output: "4", isSample: false },
        { input: "6 7\n3 -2 4 -1 2 1", output: "6", isSample: false },
      ],
    },
    {
      title: "Minimum Adjacent Swaps to Sort",
      description: `You can only swap adjacent elements.  
Find minimum swaps to sort the array in ascending order.

**Input Format:**
N  
N integers

**Output Format:**
Minimum swaps.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3\n3 1 2", output: "2", isSample: true },
        { input: "4\n1 2 3 4", output: "0", isSample: true },
        { input: "5\n5 4 3 2 1", output: "10", isSample: false },
        { input: "3\n2 3 1", output: "2", isSample: false },
        { input: "6\n1 3 5 2 4 6", output: "3", isSample: false },
      ],
    },
    {
      title: "Restore Array From Prefix Max",
      description: `You are given an array P where P[i] = max(A[1..i]) for some array A.  
Find **one valid array A**.

**Input Format:**
N  
N integers P

**Output Format:**
A valid array A.

**Constraints:**
1 ≤ N ≤ 200000  
P is non-decreasing.`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 2 2 4 4", output: "1 2 1 4 1", isSample: true },
        { input: "3\n5 5 5", output: "5 1 1", isSample: true },
        { input: "1\n7", output: "7", isSample: false },
        { input: "4\n2 2 3 3", output: "2 1 3 1", isSample: false },
        { input: "6\n1 1 1 2 2 5", output: "1 1 1 2 1 5", isSample: false },
      ],
    },
    {
      title: "Number of Valid Splits",
      description: `Count how many indices i (1 ≤ i < N) satisfy:  
sum(A[1..i]) = sum(A[i+1..N]).

**Input Format:**
N  
N integers

**Output Format:**
Number of valid splits.

**Constraints:**
1 ≤ N ≤ 200000  
|A[i]| ≤ 1e9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "4\n1 2 3 0", output: "1", isSample: true },
        { input: "3\n1 1 2", output: "0", isSample: true },
        { input: "5\n2 2 2 2 2", output: "4", isSample: false },
        { input: "3\n0 0 0", output: "2", isSample: false },
        { input: "6\n1 -1 2 -2 3 -3", output: "3", isSample: false },
      ],
    },
    {
      title: "Longest Equal 0/1 Balanced Subarray",
      description: `You are given a binary array (only 0 and 1).  
Find the longest subarray where the number of zeros equals the number of ones.

**Input Format:**
N  
N integers (0/1)

**Output Format:**
Length of the longest balanced subarray.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "6\n0 1 0 1 1 0", output: "6", isSample: true },
        { input: "4\n0 0 0 0", output: "0", isSample: true },
        { input: "4\n1 0 1 0", output: "4", isSample: false },
        { input: "5\n1 1 1 1 0", output: "2", isSample: false },
        { input: "7\n0 1 1 0 0 1 1", output: "6", isSample: false },
      ],
    },
    {
      title: "Minimum Cost to Make Array Alternating",
      description: `You have an array A.  
You may increment or decrement any element by 1 at cost 1.  
Make the array alternating: A1 < A2 > A3 < A4 > ... or the opposite.  
Find the minimum cost.

**Input Format:**
N  
N integers

**Output Format:**
Minimum cost.

**Constraints:**
1 ≤ N ≤ 200000  
|A[i]| ≤ 1e9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3\n1 2 3", output: "1", isSample: true },
        { input: "4\n1 1 1 1", output: "2", isSample: true },
        { input: "1\n10", output: "0", isSample: false },
        { input: "5\n3 3 3 3 3", output: "4", isSample: false },
        { input: "6\n1 4 2 5 3 6", output: "0", isSample: false },
      ],
    },
    {
      title: "Kth Missing Positive in Sorted Array",
      description: `Given a strictly increasing sorted array A,  
find the K-th positive integer that is missing from the array.

**Input Format:**
N K  
A (N sorted integers)

**Output Format:**
The K-th missing positive number.

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ K ≤ 10^18`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5 3\n2 3 4 7 11", output: "6", isSample: true },
        { input: "3 1\n1 2 3", output: "4", isSample: true },
        { input: "1 5\n10", output: "5", isSample: false },
        { input: "4 10\n1 5 10 20", output: "14", isSample: false },
        { input: "3 100\n50 100 150", output: "103", isSample: false },
      ],
    },
    {
      title: "Minimum Operations to Make All Elements Equal",
      description: `You may choose any index i and replace A[i] with A[i] ± 1 at cost 1.  
Find the minimum cost needed so that all elements become equal.

**Input Format:**
N  
N integers

**Output Format:**
Minimum cost.

**Constraints:**
1 ≤ N ≤ 200000  
|A[i]| ≤ 1e9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "3\n1 2 3", output: "2", isSample: true },
        { input: "4\n5 5 5 5", output: "0", isSample: true },
        { input: "3\n10 1 1", output: "9", isSample: false },
        { input: "4\n2 2 1 1", output: "2", isSample: false },
        { input: "5\n10 20 30 40 50", output: "60", isSample: false },
      ],
    },
    {
      title: "Largest Contiguous Block of Equal Numbers",
      description: `Find the longest contiguous block of equal integers in the array.

**Input Format:**
N  
N integers

**Output Format:**
Length of longest block.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "6\n1 1 2 2 2 3", output: "3", isSample: true },
        { input: "4\n7 7 7 7", output: "4", isSample: true },
        { input: "5\n1 2 3 4 5", output: "1", isSample: false },
        { input: "7\n4 4 4 3 3 4 4", output: "3", isSample: false },
        { input: "6\n1 2 2 2 2 1", output: "4", isSample: false },
      ],
    },
    {
      title: "Sum of Distances Between Same Values",
      description: `For each integer value v appearing more than once,  
compute the sum of |i - j| over all pairs of indices with A[i] = A[j] = v.  
Output the total over all values.

**Input Format:**
N  
N integers

**Output Format:**
Total sum.

**Constraints:**
1 ≤ N ≤ 200000  
|A[i]| ≤ 1e9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "4\n1 2 1 2", output: "4", isSample: true },
        { input: "5\n1 1 1 1 1", output: "20", isSample: true },
        { input: "3\n5 6 7", output: "0", isSample: false },
        { input: "6\n3 3 3 3 3 3", output: "45", isSample: false },
        { input: "5\n1 2 3 2 1", output: "8", isSample: false },
      ],
    },
    {
      title: "Count Subarrays With Maximum at Ends",
      description: `A subarray is good if its maximum element appears at either  
the leftmost or rightmost position of that subarray.  
Count how many subarrays are good.

**Input Format:**
N  
N integers

**Output Format:**
Count of good subarrays.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3\n1 2 3", output: "5", isSample: true },
        { input: "3\n3 1 2", output: "4", isSample: true },
        { input: "1\n7", output: "1", isSample: false },
        { input: "4\n2 2 2 2", output: "10", isSample: false },
        { input: "5\n1 3 2 5 4", output: "9", isSample: false },
      ],
    },
    {
      title: "Find Kth Largest Frequency",
      description: `Given an array A, consider the frequencies of each distinct value.  
Find the K-th largest frequency.

**Input Format:**
N K  
N integers

**Output Format:**
The K-th largest frequency (or 0 if fewer than K distinct values).

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ K ≤ N`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5 2\n1 1 2 2 2", output: "2", isSample: true },
        { input: "3 3\n5 5 5", output: "0", isSample: true },
        { input: "4 1\n1 2 3 4", output: "1", isSample: false },
        { input: "7 3\n1 1 2 2 3 3 3", output: "2", isSample: false },
        { input: "6 2\n5 5 5 4 4 4", output: "3", isSample: false },
      ],
    },
    {
      title: "Shortest Subarray With Exactly K Distinct Values",
      description: `Find the shortest contiguous subarray that has exactly K distinct integers.

**Input Format:**
N K  
N integers

**Output Format:**
Length of shortest subarray, or -1 if none exist.

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ K ≤ N`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "5 2\n1 2 1 3 4", output: "2", isSample: true },
        { input: "5 3\n1 2 2 1 1", output: "-1", isSample: true },
        { input: "3 1\n5 6 7", output: "1", isSample: false },
        { input: "7 3\n1 2 3 2 1 2 3", output: "3", isSample: false },
        { input: "6 2\n2 2 2 2 2 2", output: "-1", isSample: false },
      ],
    },
    {
      title: "Maximum Pair Sum Less Than K",
      description: `Given N integers and integer K,  
find the maximum A[i] + A[j] < K.

If no such pair exists, print -1.

**Input Format:**
N K  
N integers

**Output Format:**
Maximum valid pair sum.

**Constraints:**
1 ≤ N ≤ 200000  
|A[i]| ≤ 1e9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "4 10\n3 7 2 8", output: "9", isSample: true },
        { input: "3 5\n4 4 4", output: "-1", isSample: true },
        { input: "5 20\n1 2 3 4 5", output: "9", isSample: false },
        { input: "5 0\n-1 -2 -3 -4 -5", output: "-3", isSample: false },
        { input: "6 100\n50 40 30 20 10 5", output: "90", isSample: false },
      ],
    },
    {
      title: "Split Into Strictly Increasing Segments",
      description: `Split the array into the minimum number of contiguous segments  
such that each segment is strictly increasing.

**Input Format:**
N  
N integers

**Output Format:**
Minimum number of segments.

**Constraints:**
1 ≤ N ≤ 200000  
|A[i]| ≤ 1e9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 2 3 2 3", output: "2", isSample: true },
        { input: "4\n1 2 3 4", output: "1", isSample: true },
        { input: "3\n3 2 1", output: "3", isSample: false },
        { input: "6\n1 3 5 4 6 8", output: "2", isSample: false },
        { input: "1\n10", output: "1", isSample: false },
      ],
    },
    {
      title: "Find Element With Left Smaller and Right Greater",
      description: `Find any element A[i] such that:  
all elements to its left are < A[i]  
AND  
all elements to its right are > A[i].  
If none exist, print -1.

**Input Format:**
N  
N integers

**Output Format:**
The valid element or -1.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "5\n1 2 3 4 5", output: "3", isSample: true },
        { input: "5\n5 4 3 2 1", output: "-1", isSample: true },
        { input: "4\n2 1 3 4", output: "3", isSample: false },
        { input: "3\n1 3 2", output: "-1", isSample: false },
        { input: "6\n1 2 4 3 5 6", output: "4", isSample: false },
      ],
    },
    {
      title: "Reduce to Zero With Min Operations",
      description: `Given an array A, you may pick any index i and replace A[i] with floor(A[i] / 2).  
Find the minimum operations to make **all elements become zero**.

**Input Format:**
N  
N integers

**Output Format:**
Minimum operations.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ A[i] ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "3\n1 2 3", output: "6", isSample: true },
        { input: "3\n0 0 0", output: "0", isSample: true },
        { input: "1\n100", output: "8", isSample: false },
        { input: "4\n1 1 1 1", output: "4", isSample: false },
        { input: "2\n7 8", output: "10", isSample: false },
      ],
    },
    {
      title: "Find Row With Maximum Ones",
      description: `You are given a binary matrix with R rows and C columns.  
Rows may be unsorted. Find the index of the row with the maximum number of 1s.  
If tie, choose smallest index.

**Input Format:**
R C  
Matrix

**Output Format:**
Row index (0-based).

**Constraints:**
1 ≤ R, C ≤ 2000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "3 3\n1 0 1\n0 1 1\n1 1 1", output: "2", isSample: true },
        { input: "2 2\n0 0\n1 1", output: "1", isSample: true },
        { input: "3 3\n0 0 0\n0 0 0\n0 0 0", output: "0", isSample: false },
        {
          input: "4 3\n1 1 0\n1 1 0\n0 0 1\n1 0 1",
          output: "0",
          isSample: false,
        },
        { input: "2 5\n1 1 1 1 0\n1 1 1 0 0", output: "0", isSample: false },
      ],
    },
    {
      title: "Count Divisible Pairs",
      description: `Count unordered pairs (i, j) such that i < j and A[i] % A[j] == 0  
or A[j] % A[i] == 0.

**Input Format:**
N  
N integers

**Output Format:**
Number of divisible pairs.

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ A[i] ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "4\n1 2 3 4", output: "4", isSample: true },
        { input: "3\n2 2 2", output: "3", isSample: true },
        { input: "3\n5 7 11", output: "0", isSample: false },
        { input: "5\n2 4 8 16 32", output: "10", isSample: false },
        { input: "4\n3 6 9 12", output: "5", isSample: false },
      ],
    },
    {
      title: "Longest Substring With At Most K Distinct",
      description: `Find length of the longest substring that contains  
at most K distinct characters.

**Input Format:**
S  
K

**Output Format:**
Length of longest substring.

**Constraints:**
1 ≤ |S| ≤ 200000  
1 ≤ K ≤ 26`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "eceba\n2", output: "3", isSample: true },
        { input: "aaaa\n1", output: "4", isSample: true },
        { input: "abc\n3", output: "3", isSample: false },
        { input: "abaccc\n2", output: "4", isSample: false },
        { input: "abcaabbcc\n2", output: "4", isSample: false },
      ],
    },
    {
      title: "Min Moves to Make Sum Even",
      description: `Each move, you may increment or decrement any element by 1.  
Find the minimum moves to make the **sum of the array even**.

**Input Format:**
N  
N integers

**Output Format:**
Minimum moves.

**Constraints:**
1 ≤ N ≤ 200000  
|A[i]| ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "3\n1 2 3", output: "0", isSample: true },
        { input: "2\n1 1", output: "1", isSample: true },
        { input: "1\n5", output: "1", isSample: false },
        { input: "4\n2 4 6 8", output: "0", isSample: false },
        { input: "5\n1 3 5 7 9", output: "1", isSample: false },
      ],
    },
    {
      title: "Sum of Absolute Differences to All Elements",
      description: `For each element A[i], compute the sum of absolute differences  
with all other elements:  
sum(|A[i] - A[j]| for all j ≠ i).

**Input Format:**
N  
N integers

**Output Format:**
N integers — the sums.

**Constraints:**
1 ≤ N ≤ 200000  
|A[i]| ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3\n1 2 3", output: "4 2 4", isSample: true },
        { input: "1\n10", output: "0", isSample: true },
        { input: "4\n5 5 5 5", output: "0 0 0 0", isSample: false },
        { input: "5\n1 3 6 10 15", output: "26 20 18 20 26", isSample: false },
        { input: "3\n100 1 50", output: "148 148 98", isSample: false },
      ],
    },
    {
      title: "Strictly Increasing After Removing One Element",
      description: `Check if the array can become strictly increasing  
after removing exactly one element.

**Input Format:**
N  
N integers

**Output Format:**
YES or NO.

**Constraints:**
1 ≤ N ≤ 200000  
|A[i]| ≤ 1e9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "4\n1 2 5 3", output: "YES", isSample: true },
        { input: "4\n5 4 3 2", output: "NO", isSample: true },
        { input: "3\n1 2 3", output: "YES", isSample: false },
        { input: "3\n3 2 1", output: "NO", isSample: false },
        { input: "5\n1 3 2 4 5", output: "YES", isSample: false },
      ],
    },
    {
      title: "Number of Peaks in Array",
      description: `A peak is an index i such that A[i] > A[i-1] and A[i] > A[i+1].  
Count number of peaks.

**Input Format:**
N  
N integers

**Output Format:**
Number of peaks.

**Constraints:**
3 ≤ N ≤ 200000  
|A[i]| ≤ 1e9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "5\n1 3 2 4 1", output: "2", isSample: true },
        { input: "3\n1 2 3", output: "0", isSample: true },
        { input: "4\n5 4 3 2", output: "0", isSample: false },
        { input: "6\n1 5 2 5 2 5", output: "3", isSample: false },
        { input: "7\n2 4 6 8 6 4 2", output: "1", isSample: false },
      ],
    },
    {
      title: "Sum of First N Numbers",
      description: `Given an integer N, compute the sum of the first N natural numbers.

**Input Format:**
N

**Output Format:**
Sum 1 + 2 + ... + N.

**Constraints:**
1 ≤ N ≤ 10^9`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 32,
      testCases: [
        { input: "5", output: "15", isSample: true },
        { input: "1", output: "1", isSample: true },
        { input: "10", output: "55", isSample: false },
        { input: "100", output: "5050", isSample: false },
        { input: "1000000000", output: "500000000500000000", isSample: false },
      ],
    },
    {
      title: "Check Vowel or Consonant",
      description: `Given a lowercase English letter, determine if it is a vowel or consonant.

**Input Format:**
Single character c

**Output Format:**
"Vowel" or "Consonant".`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "a", output: "Vowel", isSample: true },
        { input: "z", output: "Consonant", isSample: true },
        { input: "u", output: "Vowel", isSample: false },
        { input: "b", output: "Consonant", isSample: false },
        { input: "o", output: "Vowel", isSample: false },
      ],
    },
    {
      title: "Minimum of Two Numbers",
      description: `Given two integers A and B, print the smaller of the two.

**Input Format:**
A B

**Output Format:**
Minimum value.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "5 3", output: "3", isSample: true },
        { input: "10 10", output: "10", isSample: true },
        { input: "-5 2", output: "-5", isSample: false },
        { input: "0 100", output: "0", isSample: false },
        { input: "-10 -20", output: "-20", isSample: false },
      ],
    },
    {
      title: "Convert Celsius to Fahrenheit",
      description: `Given a temperature C in Celsius, convert it to Fahrenheit.
Formula: F = C × 9/5 + 32

**Input Format:**
C

**Output Format:**
Fahrenheit value.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "0", output: "32", isSample: true },
        { input: "100", output: "212", isSample: true },
        { input: "-40", output: "-40", isSample: false },
        { input: "37", output: "98.6", isSample: false },
        { input: "20", output: "68", isSample: false },
      ],
    },
    {
      title: "Count Positive Numbers",
      description: `Given N integers, count how many of them are positive.

**Input Format:**
N  
N integers

**Output Format:**
Count of positive numbers.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 32,
      testCases: [
        { input: "5\n1 -1 2 -2 3", output: "3", isSample: true },
        { input: "3\n-1 -2 -3", output: "0", isSample: true },
        { input: "4\n0 1 2 3", output: "3", isSample: false },
        { input: "1\n100", output: "1", isSample: false },
        { input: "6\n0 0 0 0 0 1", output: "1", isSample: false },
      ],
    },
    {
      title: "Last Digit of Sum",
      description: `Given two integers A and B, compute the last digit of their sum.

**Input Format:**
A B

**Output Format:**
(A + B) % 10.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "7 8", output: "5", isSample: true },
        { input: "10 5", output: "5", isSample: true },
        { input: "-3 4", output: "1", isSample: false },
        { input: "100 999", output: "9", isSample: false },
        { input: "0 0", output: "0", isSample: false },
      ],
    },
    {
      title: "Area of Rectangle",
      description: `Given width W and height H, compute the area W × H.

**Input Format:**
W H

**Output Format:**
Area.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "5 10", output: "50", isSample: true },
        { input: "1 1", output: "1", isSample: true },
        { input: "0 5", output: "0", isSample: false },
        { input: "3 7", output: "21", isSample: false },
        { input: "100 100", output: "10000", isSample: false },
      ],
    },
    {
      title: "Check Divisible by 3",
      description: `Given integer N, check if it is divisible by 3.

**Input Format:**
N

**Output Format:**
YES or NO.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "9", output: "YES", isSample: true },
        { input: "10", output: "NO", isSample: true },
        { input: "0", output: "YES", isSample: false },
        { input: "-3", output: "YES", isSample: false },
        { input: "8", output: "NO", isSample: false },
      ],
    },
    {
      title: "Print N Stars",
      description: `Given an integer N, print N asterisks (*) on a single line.

**Input Format:**
N

**Output Format:**
A string with N asterisks.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "5", output: "*****", isSample: true },
        { input: "1", output: "*", isSample: true },
        { input: "3", output: "***", isSample: false },
        { input: "0", output: "", isSample: false },
        { input: "10", output: "**********", isSample: false },
      ],
    },
    {
      title: "Multiply Two Floating Numbers",
      description: `Given two floating-point numbers A and B, output their product.

**Input Format:**
A B

**Output Format:**
A * B (exact).`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "2.5 4", output: "10", isSample: true },
        { input: "1.5 1.5", output: "2.25", isSample: true },
        { input: "0 10.5", output: "0", isSample: false },
        { input: "3.14 2", output: "6.28", isSample: false },
        { input: "10.5 10", output: "105", isSample: false },
      ],
    },
    {
      title: "Square of a Number",
      description: `Given an integer N, print N squared.

**Input Format:**
N

**Output Format:**
N × N.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "5", output: "25", isSample: true },
        { input: "0", output: "0", isSample: true },
        { input: "-4", output: "16", isSample: false },
        { input: "10", output: "100", isSample: false },
        { input: "1000", output: "1000000", isSample: false },
      ],
    },
    {
      title: "Is Number Even?",
      description: `Given an integer N, determine if it is even.

**Input Format:**
N

**Output Format:**
YES or NO.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "4", output: "YES", isSample: true },
        { input: "7", output: "NO", isSample: true },
        { input: "0", output: "YES", isSample: false },
        { input: "-2", output: "YES", isSample: false },
        { input: "9", output: "NO", isSample: false },
      ],
    },
    {
      title: "Absolute Difference",
      description: `Given two integers A and B, print |A − B|.

**Input Format:**
A B

**Output Format:**
Absolute difference.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "5 3", output: "2", isSample: true },
        { input: "3 5", output: "2", isSample: true },
        { input: "-1 4", output: "5", isSample: false },
        { input: "0 0", output: "0", isSample: false },
        { input: "100 -100", output: "200", isSample: false },
      ],
    },
    {
      title: "Sum of Digits",
      description: `Given a non-negative integer N, compute the sum of its digits.

**Input Format:**
N

**Output Format:**
Digit sum.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "123", output: "6", isSample: true },
        { input: "0", output: "0", isSample: true },
        { input: "999", output: "27", isSample: false },
        { input: "1001", output: "2", isSample: false },
        { input: "50005", output: "10", isSample: false },
      ],
    },
    {
      title: "Greater of Three Numbers",
      description: `Given three integers, print the greatest among them.

**Input Format:**
A B C

**Output Format:**
Maximum number.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "1 2 3", output: "3", isSample: true },
        { input: "10 10 10", output: "10", isSample: true },
        { input: "5 9 2", output: "9", isSample: false },
        { input: "-5 -2 -9", output: "-2", isSample: false },
        { input: "7 7 3", output: "7", isSample: false },
      ],
    },
    {
      title: "Check Leap Year",
      description: `Given an integer Y representing a year,  
determine if it is a leap year.

Leap year rules:
- divisible by 400 → leap  
- divisible by 100 → NOT leap  
- divisible by 4 → leap  
otherwise not leap.

**Input Format:**
Y

**Output Format:**
YES or NO.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 16,
      testCases: [
        { input: "2020", output: "YES", isSample: true },
        { input: "1900", output: "NO", isSample: true },
        { input: "2000", output: "YES", isSample: false },
        { input: "2023", output: "NO", isSample: false },
        { input: "2400", output: "YES", isSample: false },
      ],
    },
    {
      title: "Number of Words in a Sentence",
      description: `Given a sentence with words separated by spaces,  
count the number of words.

**Input Format:**
A single line string S

**Output Format:**
Number of words.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 32,
      testCases: [
        { input: "hello world", output: "2", isSample: true },
        { input: "a b c", output: "3", isSample: true },
        { input: "    hi", output: "1", isSample: false },
        { input: "open   ai   chatgpt", output: "3", isSample: false },
        { input: "one", output: "1", isSample: false },
      ],
    },
    {
      title: "Check Palindrome Number",
      description: `Given a non-negative integer N, check if it is a palindrome.

**Input Format:**
N

**Output Format:**
YES if palindrome, else NO.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 32,
      testCases: [
        { input: "121", output: "YES", isSample: true },
        { input: "10", output: "NO", isSample: true },
        { input: "0", output: "YES", isSample: false },
        { input: "4444", output: "YES", isSample: false },
        { input: "1231", output: "NO", isSample: false },
      ],
    },
    {
      title: "Count Even Numbers in Array",
      description: `Given N integers, count how many of them are even.

**Input Format:**
N  
N integers

**Output Format:**
Count of even numbers.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 32,
      testCases: [
        { input: "5\n1 2 3 4 5", output: "2", isSample: true },
        { input: "3\n2 4 6", output: "3", isSample: true },
        { input: "4\n1 3 5 7", output: "0", isSample: false },
        { input: "1\n10", output: "1", isSample: false },
        { input: "6\n0 1 0 1 0 1", output: "3", isSample: false },
      ],
    },
    {
      title: "Print First N Multiples of X",
      description: `Given two integers X and N, print the first N multiples of X  
on one line separated by spaces.

**Input Format:**
X N

**Output Format:**
X, 2X, 3X, ..., NX.`,
      difficulty: "EASY",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 32,
      testCases: [
        { input: "2 5", output: "2 4 6 8 10", isSample: true },
        { input: "3 3", output: "3 6 9", isSample: true },
        { input: "5 1", output: "5", isSample: false },
        { input: "10 4", output: "10 20 30 40", isSample: false },
        { input: "-2 4", output: "-2 -4 -6 -8", isSample: false },
      ],
    },
    {
      title: "Teleporting Network",
      description: `You are given a connected undirected graph with N nodes and M edges.  
Each edge has a weight. In addition, you are given K teleport portals — each portal connects two distinct nodes and allows instant travel.

You must compute the shortest distance between node 1 and node N using normal edges and teleport portals.

**Input Format:**
N M K  
M lines: u v w  
K lines: a b  
(all teleport edges have weight 0)

**Output Format:**
Shortest path length from 1 to N.

**Constraints:**
1 ≤ N ≤ 2×10^5  
1 ≤ M ≤ 3×10^5  
0 ≤ w ≤ 10^9  
0 ≤ K ≤ 2×10^5`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        {
          input: "4 4 1\n1 2 5\n2 3 5\n3 4 5\n1 4 100\n2 4",
          output: "10",
          isSample: true,
        },
        { input: "3 1 1\n1 2 7\n2 3\n", output: "7", isSample: true },
        {
          input: "5 4 1\n1 2 10\n2 3 10\n3 4 10\n4 5 10\n1 5",
          output: "0",
          isSample: false,
        },
        {
          input: "3 3 0\n1 2 1\n2 3 100\n1 3 50",
          output: "50",
          isSample: false,
        },
        {
          input: "6 5 2\n1 2 3\n2 3 3\n3 4 3\n4 5 3\n5 6 3\n1 6\n3 5",
          output: "0",
          isSample: false,
        },
      ],
    },
    {
      title: "Max XOR Path",
      description: `You are given a tree with N nodes. Each edge has a weight.  
Find the maximum possible XOR value along any path in the tree.

**Input Format:**
N  
N-1 lines: u v w

**Output Format:**
Maximum XOR of any path.

**Constraints:**
1 ≤ N ≤ 2×10^5  
0 ≤ w ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3\n1 2 5\n2 3 7", output: "2", isSample: true },
        { input: "4\n1 2 8\n2 3 1\n2 4 3", output: "11", isSample: true },
        { input: "2\n1 2 10", output: "10", isSample: false },
        {
          input: "5\n1 2 4\n1 3 12\n3 4 6\n3 5 2",
          output: "14",
          isSample: false,
        },
        { input: "4\n1 2 1\n2 3 1\n3 4 1", output: "1", isSample: false },
      ],
    },
    {
      title: "K Segments Maximum Sum",
      description: `Given an array of N integers, you must pick exactly K non-overlapping subarrays to maximize the sum of all chosen elements.

**Input Format:**
N K  
N integers

**Output Format:**
Maximum possible sum.

**Constraints:**
1 ≤ N ≤ 2×10^5  
1 ≤ K ≤ min(200, N)  
-10^9 ≤ array[i] ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "5 2\n1 2 -5 3 4", output: "10", isSample: true },
        { input: "6 1\n-1 -2 -3 -4 -5 -6", output: "-1", isSample: true },
        { input: "4 2\n5 -10 5 5", output: "15", isSample: false },
        { input: "5 3\n1 2 3 4 5", output: "12", isSample: false },
        { input: "5 2\n-1 100 -2 50 -3", output: "150", isSample: false },
      ],
    },
    {
      title: "Largest Rectangle on Grid",
      description: `You are given a grid of size N×M containing 0s and 1s.  
Find the largest rectangle consisting entirely of 1s.

**Input Format:**
N M  
Grid rows of 0/1

**Output Format:**
Area of largest all-1 rectangle.

**Constraints:**
1 ≤ N, M ≤ 2000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        {
          input: "3 4\n1 0 1 1\n1 1 1 1\n1 1 0 1",
          output: "6",
          isSample: true,
        },
        { input: "2 2\n1 1\n1 1", output: "4", isSample: true },
        { input: "3 3\n0 0 0\n0 0 0\n0 0 0", output: "0", isSample: false },
        { input: "1 5\n1 1 1 1 1", output: "5", isSample: false },
        {
          input: "4 4\n1 1 0 1\n1 1 0 1\n1 1 1 1\n0 1 1 1",
          output: "6",
          isSample: false,
        },
      ],
    },
    {
      title: "Minimum Cost to Equalize",
      description: `Given N integers, you may increase or decrease any value.  
The cost of changing a value by d is |d|.  
Find the minimum total cost to make all numbers **equal**.

**Input Format:**
N  
N integers

**Output Format:**
Minimum cost.`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "5\n1 2 3 4 5", output: "6", isSample: true },
        { input: "3\n10 10 10", output: "0", isSample: true },
        { input: "4\n1 100 50 75", output: "124", isSample: false },
        { input: "3\n-5 0 5", output: "10", isSample: false },
        { input: "5\n1 1 1 100 100", output: "198", isSample: false },
      ],
    },
    {
      title: "Longest Alternating Path",
      description: `You are given a tree with N nodes.  
Each node has a color: 0 or 1.  
Find the longest path where colors strictly alternate between adjacent nodes.

**Input Format:**
N  
colors (0/1)  
N-1 edges

**Output Format:**
Maximum alternating path length.`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3\n0 1 0\n1 2\n2 3", output: "3", isSample: true },
        { input: "4\n1 1 1 1\n1 2\n2 3\n3 4", output: "1", isSample: true },
        {
          input: "5\n0 1 1 0 1\n1 2\n2 3\n2 4\n4 5",
          output: "3",
          isSample: false,
        },
        { input: "2\n0 1\n1 2", output: "2", isSample: false },
        {
          input: "5\n0 0 0 1 1\n1 2\n2 3\n3 4\n4 5",
          output: "2",
          isSample: false,
        },
      ],
    },
    {
      title: "Minimum Edge Removals to Make Acyclic",
      description: `You are given a directed graph with N vertices and M edges.  
Find the minimum number of edges to remove so that the graph becomes acyclic.

**Input Format:**
N M  
M lines: u v

**Output Format:**
Minimum removals.

**Constraints:**
1 ≤ N ≤ 2×10^5  
1 ≤ M ≤ 3×10^5`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3 3\n1 2\n2 3\n3 1", output: "1", isSample: true },
        { input: "4 4\n1 2\n2 3\n3 4\n4 2", output: "1", isSample: true },
        { input: "5 4\n1 2\n2 3\n3 4\n4 5", output: "0", isSample: false },
        { input: "2 2\n1 2\n2 1", output: "1", isSample: false },
        {
          input: "4 6\n1 2\n2 3\n3 1\n3 4\n4 2\n4 1",
          output: "2",
          isSample: false,
        },
      ],
    },
    {
      title: "Kth Lexicographic Subsequence",
      description: `Given a string S and an integer K,  
find the K-th lexicographically smallest **non-empty subsequence**.

If no such subsequence exists, print -1.

**Input Format:**
S  
K

**Output Format:**
K-th subsequence or -1.

**Constraints:**
|S| ≤ 2000  
1 ≤ K ≤ 10^18`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "abc\n3", output: "ac", isSample: true },
        { input: "aaa\n2", output: "aa", isSample: true },
        { input: "abcd\n1", output: "a", isSample: false },
        { input: "abcd\n15", output: "cd", isSample: false },
        { input: "xyz\n100", output: "-1", isSample: false },
      ],
    },
    {
      title: "Maximum Subarray After One Deletion",
      description: `You are given an array of N integers.  
You may delete **exactly one** element.  
After deletion, compute the maximum subarray sum.

**Input Format:**
N  
N integers

**Output Format:**
Maximum subarray sum after deleting one element.

**Constraints:**
1 ≤ N ≤ 2×10^5  
-10^9 ≤ array[i] ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "5\n1 -2 3 4 -1", output: "7", isSample: true },
        { input: "3\n1 2 3", output: "5", isSample: true },
        { input: "4\n-1 -2 -3 -4", output: "-1", isSample: false },
        { input: "5\n5 -10 5 5 5", output: "15", isSample: false },
        { input: "6\n1 2 -100 3 4 5", output: "12", isSample: false },
      ],
    },
    {
      title: "Minimum K-Rotation Cost",
      description: `You are given an array A of size N.  
You may choose any integer k (0 ≤ k < N) and rotate the array right by k positions.

Cost of choosing k is the sum of |A[i] - B[i]| for all i,  
where B is A rotated right by k.

Find the minimum possible cost.

**Input Format:**
N  
N integers

**Output Format:**
Minimum rotation cost.`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "4\n1 2 3 4", output: "4", isSample: true },
        { input: "3\n5 5 5", output: "0", isSample: true },
        { input: "5\n1 100 1 100 1", output: "0", isSample: false },
        { input: "4\n10 20 30 40", output: "40", isSample: false },
        { input: "6\n3 1 4 1 5 9", output: "10", isSample: false },
      ],
    },
    {
      title: "Minimum Cycles to Visit All Cities",
      description: `You are given an undirected graph with N nodes and M edges.  
You must split all nodes into the minimum number of **simple cycles**  
(each node must belong to exactly one cycle).  
A cycle must have length ≥ 3.

If impossible, print -1.

**Input Format:**
N M  
M lines: u v

**Output Format:**
Minimum number of cycles.

**Constraints:**
1 ≤ N ≤ 20  
0 ≤ M ≤ N*(N-1)/2`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 128,
      testCases: [
        { input: "3 3\n1 2\n2 3\n3 1", output: "1", isSample: true },
        { input: "4 4\n1 2\n2 3\n3 4\n4 1", output: "1", isSample: true },
        { input: "4 3\n1 2\n2 3\n3 1", output: "-1", isSample: false },
        {
          input: "5 5\n1 2\n2 3\n3 1\n3 4\n4 5",
          output: "-1",
          isSample: false,
        },
        {
          input: "6 9\n1 2\n2 3\n3 1\n3 4\n4 5\n5 6\n6 4\n1 4\n2 5",
          output: "2",
          isSample: false,
        },
      ],
    },
    {
      title: "Minimize Max Segment Sum After K Cuts",
      description: `You are given an array A of N integers and an integer K.  
You may cut the array into K+1 contiguous segments.  
Your goal is to minimize the maximum segment sum.

**Input Format:**
N K  
N integers

**Output Format:**
Minimum possible max segment sum.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ K ≤ N-1  
-10^9 ≤ A[i] ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "5 1\n1 2 3 4 5", output: "9", isSample: true },
        { input: "5 2\n1 2 3 4 5", output: "6", isSample: true },
        { input: "3 0\n-1 -2 -3", output: "-6", isSample: false },
        { input: "6 2\n10 -5 10 -5 10 -5", output: "10", isSample: false },
        { input: "5 4\n5 4 3 2 1", output: "5", isSample: false },
      ],
    },
    {
      title: "Graph Edge Coloring With Minimum Colors",
      description: `You are given an undirected graph.  
Color all edges so that no two edges sharing a vertex have the same color.  
Find the minimum number of colors required.

**Input Format:**
N M  
M lines: u v

**Output Format:**
Minimum colors.

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ M ≤ 200000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "3 3\n1 2\n2 3\n3 1", output: "3", isSample: true },
        { input: "4 3\n1 2\n2 3\n3 4", output: "1", isSample: true },
        { input: "5 4\n1 2\n2 3\n3 4\n4 5", output: "1", isSample: false },
        {
          input: "4 6\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4",
          output: "3",
          isSample: false,
        },
        { input: "6 5\n1 2\n2 3\n2 4\n2 5\n2 6", output: "5", isSample: false },
      ],
    },
    {
      title: "Max Score After Removing Adjacent Pairs",
      description: `You are given a string where each character has a point value.  
You may repeatedly remove any adjacent pair of equal characters,  
earning points equal to the character's value.  
The removed parts collapse.

Compute the maximum total score.

**Input Format:**
S  
values for 'a' to 'z'

**Output Format:**
Maximum score.

**Constraints:**
1 ≤ |S| ≤ 200000  
0 ≤ value ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        {
          input:
            "abba\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26",
          output: "3",
          isSample: true,
        },
        {
          input: "aaaa\n1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1",
          output: "2",
          isSample: true,
        },
        {
          input: "abcabc\n1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1",
          output: "0",
          isSample: false,
        },
        {
          input:
            "zzzz\n10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10",
          output: "20",
          isSample: false,
        },
        {
          input:
            "abbaabba\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26",
          output: "6",
          isSample: false,
        },
      ],
    },
    {
      title: "Maximum Weighted Independent Set on Path",
      description: `You are given N nodes arranged in a path.  
Each node has weight W[i].  
Choose a subset of nodes such that no two chosen nodes are adjacent.  
Maximize the total weight.

**Input Format:**
N  
N weights

**Output Format:**
Maximum weighted sum.

**Constraints:**
1 ≤ N ≤ 2×10^5  
0 ≤ W[i] ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "5\n1 2 3 4 5", output: "9", isSample: true },
        { input: "3\n10 1 10", output: "20", isSample: true },
        { input: "1\n100", output: "100", isSample: false },
        { input: "4\n10 10 10 10", output: "20", isSample: false },
        { input: "6\n5 10 5 10 5 10", output: "30", isSample: false },
      ],
    },
    {
      title: "Minimum Inversions After Prefix Reverse",
      description: `Given an array A of N integers,  
you may choose exactly one prefix [1..k] and reverse it.  
Find the minimum possible number of inversions afterwards.

**Input Format:**
N  
N integers

**Output Format:**
Minimum inversions.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ A[i] ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3\n3 2 1", output: "1", isSample: true },
        { input: "4\n4 3 2 1", output: "2", isSample: true },
        { input: "5\n1 2 3 4 5", output: "0", isSample: false },
        { input: "5\n5 4 3 2 1", output: "4", isSample: false },
        { input: "6\n3 1 4 5 2 6", output: "3", isSample: false },
      ],
    },
    {
      title: "Longest Palindromic Path in Tree",
      description: `You are given a tree with N nodes.  
Each node has a lowercase letter.  
Find the length of the longest path whose string of letters is a palindrome.

**Input Format:**
N  
string of N chars  
N-1 edges

**Output Format:**
Longest palindromic path length.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 3,
      memoryLimit: 512,
      testCases: [
        { input: "3\naba\n1 2\n2 3", output: "3", isSample: true },
        { input: "3\naaa\n1 2\n2 3", output: "3", isSample: true },
        { input: "4\nabcd\n1 2\n2 3\n3 4", output: "1", isSample: false },
        { input: "5\nabcba\n1 2\n2 3\n3 4\n4 5", output: "5", isSample: false },
        { input: "5\naabbb\n1 2\n2 3\n2 4\n4 5", output: "3", isSample: false },
      ],
    },
    {
      title: "Minimize Sum After XOR Assignments",
      description: `You are given an array A of N integers.  
You must choose a single integer X and replace each A[i] with A[i] XOR X.  
Choose X such that the sum of resulting values is minimized.

**Input Format:**
N  
N integers

**Output Format:**
Minimum sum.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ A[i] ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "3\n1 2 3", output: "0", isSample: true },
        { input: "3\n5 5 5", output: "0", isSample: true },
        { input: "4\n1 10 100 1000", output: "111", isSample: false },
        { input: "2\n7 8", output: "1", isSample: false },
        { input: "5\n1 2 4 8 16", output: "0", isSample: false },
      ],
    },
    {
      title: "Maximum Points From Intervals With Cooldown",
      description: `You have N intervals, each with a start time, end time, and points.  
If you choose an interval, you cannot choose another interval that overlaps  
or starts within C units after finishing.

Maximize points.

**Input Format:**
N C  
Interval lines: L R P

**Output Format:**
Max points.

**Constraints:**
1 ≤ N ≤ 200000  
0 ≤ C ≤ 10^9`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 512,
      testCases: [
        { input: "3 0\n1 3 10\n3 5 20\n6 7 30", output: "60", isSample: true },
        { input: "3 2\n1 3 10\n4 6 20\n5 8 30", output: "40", isSample: true },
        { input: "2 10\n1 2 100\n3 4 200", output: "200", isSample: false },
        {
          input: "3 5\n1 10 100\n2 9 50\n11 12 10",
          output: "110",
          isSample: false,
        },
        {
          input: "4 1\n1 2 5\n2 3 6\n3 4 7\n4 5 8",
          output: "14",
          isSample: false,
        },
      ],
    },
    {
      title: "Maximum Flow With Node Capacities",
      description: `You are given a directed graph with capacities on both edges AND nodes.  
Each node v has a maximum flow capacity Cv — total incoming flow ≤ Cv.

Find the maximum possible flow from source S to sink T.

**Input Format:**
N M S T  
Node capacities: C1 C2 ... CN  
Then M edges: u v w

**Output Format:**
Maximum flow.

**Constraints:**
1 ≤ N ≤ 200000  
1 ≤ M ≤ 300000  
0 ≤ w ≤ 10^9  
1 ≤ S, T ≤ N`,
      difficulty: "HARD",
      isPublic: true,
      timeLimit: 3,
      memoryLimit: 512,
      testCases: [
        {
          input: "4 5 1 4\n10 10 10 10\n1 2 10\n2 4 10\n1 3 5\n3 4 5\n2 3 2",
          output: "15",
          isSample: true,
        },
        {
          input: "3 2 1 3\n5 5 5\n1 2 10\n2 3 10",
          output: "5",
          isSample: true,
        },
        {
          input: "3 3 1 3\n100 1 100\n1 2 50\n2 3 50\n1 3 100",
          output: "1",
          isSample: false,
        },
        { input: "2 1 1 2\n100 100\n1 2 1000", output: "100", isSample: false },
        {
          input: "4 4 1 4\n1 2 3 4\n1 2 10\n2 3 10\n3 4 10\n1 4 100",
          output: "1",
          isSample: false,
        },
      ],
    },
    {
      title: "Count Subarrays With Sum ≤ K",
      description: `Given an array A and a number K, count how many subarrays have sum ≤ K.

**Input Format:**
N K  
N integers

**Output Format:**
Number of valid subarrays.

**Constraints:**
1 ≤ N ≤ 200000  
-10^9 ≤ A[i] ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "3 5\n1 2 3", output: "5", isSample: true },
        { input: "3 3\n2 2 2", output: "2", isSample: true },
        { input: "4 10\n5 -2 4 3", output: "9", isSample: false },
        { input: "5 0\n-1 -2 -3 1 2", output: "8", isSample: false },
        { input: "2 100\n50 60", output: "2", isSample: false },
      ],
    },
    {
      title: "First Missing Positive Integer",
      description: `Given an unsorted array, find the smallest positive integer that is missing.

**Input Format:**
N  
N integers

**Output Format:**
Smallest missing positive integer.

**Constraints:**
1 ≤ N ≤ 200000  
-10^9 ≤ A[i] ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "5\n1 2 0 3 5", output: "4", isSample: true },
        { input: "3\n3 4 -1", output: "1", isSample: true },
        { input: "3\n1 2 3", output: "4", isSample: false },
        { input: "4\n7 8 9 10", output: "1", isSample: false },
        { input: "6\n2 2 2 2 2 2", output: "1", isSample: false },
      ],
    },
    {
      title: "Longest Consecutive Increasing Sequence",
      description: `Find the longest subsequence of consecutive integers (order in array doesn't matter).

**Input Format:**
N  
N integers

**Output Format:**
Length of the longest consecutive set.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 128,
      testCases: [
        { input: "6\n100 4 200 1 3 2", output: "4", isSample: true },
        { input: "5\n1 9 3 10 4", output: "2", isSample: true },
        { input: "3\n5 6 7", output: "3", isSample: false },
        { input: "4\n8 8 8 8", output: "1", isSample: false },
        { input: "7\n1 2 4 5 6 9 10", output: "3", isSample: false },
      ],
    },
    {
      title: "Smallest Window Containing All Characters",
      description: `Given strings S and T, find the minimum window in S which contains all characters of T.

**Input Format:**
S  
T

**Output Format:**
Length of smallest valid window, or -1.

**Constraints:**
1 ≤ |S|, |T| ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 2,
      memoryLimit: 256,
      testCases: [
        { input: "ADOBECODEBANC\nABC", output: "4", isSample: true },
        { input: "a\nb", output: "-1", isSample: true },
        { input: "aaabbbc\nabc", output: "3", isSample: false },
        { input: "xyzyzyz\nzy", output: "2", isSample: false },
        { input: "aaaaa\na", output: "1", isSample: false },
      ],
    },
    {
      title: "Split Array Into Equal Sum Halves",
      description: `Check if the array can be split into two contiguous parts with equal sum.

**Input Format:**
N  
N integers

**Output Format:**
YES or NO.`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "4\n1 2 3 3", output: "YES", isSample: true },
        { input: "3\n1 1 1", output: "NO", isSample: true },
        { input: "2\n5 5", output: "YES", isSample: false },
        { input: "5\n1 2 3 4 10", output: "NO", isSample: false },
        { input: "3\n0 0 0", output: "YES", isSample: false },
      ],
    },
    {
      title: "Number of Ways to Climb Stairs With Jumps",
      description: `You can climb 1, 2, or 3 steps at once.  
Find number of ways to reach N (mod 1e9+7).

**Input Format:**
N

**Output Format:**
Number of ways modulo 1e9+7.

**Constraints:**
1 ≤ N ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 32,
      testCases: [
        { input: "3", output: "4", isSample: true },
        { input: "1", output: "1", isSample: true },
        { input: "4", output: "7", isSample: false },
        { input: "5", output: "13", isSample: false },
        { input: "10", output: "274", isSample: false },
      ],
    },
    {
      title: "Longest Substring With Distinct Adjacent Characters",
      description: `Find the longest substring where no two adjacent characters are equal.

**Input Format:**
S

**Output Format:**
Length of longest valid substring.

**Constraints:**
1 ≤ |S| ≤ 200000`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "abcddcba", output: "4", isSample: true },
        { input: "aaaa", output: "1", isSample: true },
        { input: "abababab", output: "8", isSample: false },
        { input: "aabbaa", output: "2", isSample: false },
        { input: "xyz", output: "3", isSample: false },
      ],
    },
    {
      title: "Count Good Pairs",
      description: `Count pairs (i, j), i < j, such that A[i] + A[j] = K.

**Input Format:**
N K  
N integers

**Output Format:**
Number of valid pairs.

**Constraints:**
1 ≤ N ≤ 200000  
-10^9 ≤ A[i] ≤ 10^9`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "4 5\n1 2 3 4", output: "2", isSample: true },
        { input: "3 10\n5 5 5", output: "3", isSample: true },
        { input: "5 0\n-1 1 -1 1 0", output: "2", isSample: false },
        { input: "4 8\n6 2 4 4", output: "2", isSample: false },
        { input: "3 100\n1 2 3", output: "0", isSample: false },
      ],
    },
    {
      title: "Minimum Operations to Make Array Increasing",
      description: `You may increment any element by 1 per operation.  
Find the minimum operations to make the array strictly increasing.

**Input Format:**
N  
N integers

**Output Format:**
Minimum operations.`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "4\n1 1 1 1", output: "6", isSample: true },
        { input: "3\n1 2 3", output: "0", isSample: true },
        { input: "5\n5 4 3 2 1", output: "20", isSample: false },
        { input: "3\n10 10 5", output: "7", isSample: false },
        { input: "6\n1 2 2 3 3 4", output: "3", isSample: false },
      ],
    },
    {
      title: "Find Element Appearing More Than N/3 Times",
      description: `Find any element that appears strictly more than ⌊N/3⌋ times.  
If none exist, print -1.

**Input Format:**
N  
N integers

**Output Format:**
The element or -1.`,
      difficulty: "MEDIUM",
      isPublic: true,
      timeLimit: 1,
      memoryLimit: 64,
      testCases: [
        { input: "6\n1 2 3 1 1 2", output: "1", isSample: true },
        { input: "4\n1 2 3 4", output: "-1", isSample: true },
        { input: "3\n5 5 5", output: "5", isSample: false },
        { input: "7\n2 2 1 1 1 2 2", output: "2", isSample: false },
        { input: "5\n100 200 100 300 100", output: "100", isSample: false },
      ],
    },
  ];

  for (const problemData of problems) {
    const { testCases, ...problemInfo } = problemData;

    const problem = await prisma.problem.create({
      data: {
        ...problemInfo,
        authorId: adminUser.id,
        testCases: {
          create: testCases,
        },
      },
      include: {
        testCases: true,
      },
    });

    console.log(
      `Created problem: ${problem.title} (${problem.difficulty}) with ${problem.testCases.length} test cases`
    );
  }

  console.log("\\nSeed completed successfully!");
  console.log(`Total problems created: ${problems.length}`);
  console.log("Admin credentials:");
  console.log("  Username: admin");
  console.log("  Password: admin123");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
