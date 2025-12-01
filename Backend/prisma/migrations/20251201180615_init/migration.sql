-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `bio` TEXT NULL,
    `avatar` VARCHAR(191) NULL,
    `dualsCrowns` INTEGER NOT NULL DEFAULT 1000,
    `havocCrowns` INTEGER NOT NULL DEFAULT 1000,
    `totalBattles` INTEGER NOT NULL DEFAULT 0,
    `wins` INTEGER NOT NULL DEFAULT 0,
    `losses` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    INDEX `User_email_idx`(`email`),
    INDEX `User_username_idx`(`username`),
    INDEX `User_dualsCrowns_idx`(`dualsCrowns` DESC),
    INDEX `User_havocCrowns_idx`(`havocCrowns` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `senderId` INTEGER NOT NULL,
    `receiverId` INTEGER NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Message_senderId_idx`(`senderId`),
    INDEX `Message_receiverId_idx`(`receiverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Problem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `difficulty` ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    `timeLimit` INTEGER NOT NULL DEFAULT 2000,
    `memoryLimit` INTEGER NOT NULL DEFAULT 256000,
    `codeTemplates` TEXT NULL,
    `authorId` INTEGER NOT NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT true,
    `tags` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Problem_difficulty_idx`(`difficulty`),
    INDEX `Problem_authorId_idx`(`authorId`),
    INDEX `Problem_isPublic_idx`(`isPublic`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TestCase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `problemId` INTEGER NOT NULL,
    `input` TEXT NOT NULL,
    `output` TEXT NOT NULL,
    `isSample` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TestCase_problemId_idx`(`problemId`),
    INDEX `TestCase_isSample_idx`(`isSample`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Battle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('DUALS', 'HAVOC') NOT NULL,
    `mode` ENUM('RANKED', 'FRIEND') NOT NULL,
    `status` ENUM('WAITING', 'ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'WAITING',
    `problemId` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `startTime` DATETIME(3) NULL,
    `endTime` DATETIME(3) NULL,
    `maxPlayers` INTEGER NOT NULL DEFAULT 2,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Battle_status_idx`(`status`),
    INDEX `Battle_type_idx`(`type`),
    INDEX `Battle_mode_idx`(`mode`),
    INDEX `Battle_startTime_idx`(`startTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BattleParticipant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `battleId` INTEGER NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `rank` INTEGER NULL,
    `crownChange` INTEGER NOT NULL DEFAULT 0,
    `hasCompleted` BOOLEAN NOT NULL DEFAULT false,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BattleParticipant_userId_idx`(`userId`),
    INDEX `BattleParticipant_battleId_idx`(`battleId`),
    UNIQUE INDEX `BattleParticipant_userId_battleId_key`(`userId`, `battleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Submission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `problemId` INTEGER NOT NULL,
    `battleId` INTEGER NULL,
    `code` TEXT NOT NULL,
    `languageId` INTEGER NOT NULL,
    `judge0Token` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR', 'INTERNAL_ERROR') NOT NULL DEFAULT 'PENDING',
    `score` INTEGER NOT NULL DEFAULT 0,
    `totalTestCases` INTEGER NOT NULL DEFAULT 0,
    `passedTestCases` INTEGER NOT NULL DEFAULT 0,
    `executionTime` DOUBLE NULL,
    `memoryUsed` INTEGER NULL,
    `testResults` TEXT NULL,
    `errorMessage` TEXT NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Submission_userId_idx`(`userId`),
    INDEX `Submission_problemId_idx`(`problemId`),
    INDEX `Submission_battleId_idx`(`battleId`),
    INDEX `Submission_status_idx`(`status`),
    INDEX `Submission_submittedAt_idx`(`submittedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Friendship` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `requesterId` INTEGER NOT NULL,
    `addresseeId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Friendship_requesterId_idx`(`requesterId`),
    INDEX `Friendship_addresseeId_idx`(`addresseeId`),
    INDEX `Friendship_status_idx`(`status`),
    UNIQUE INDEX `Friendship_requesterId_addresseeId_key`(`requesterId`, `addresseeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Problem` ADD CONSTRAINT `Problem_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestCase` ADD CONSTRAINT `TestCase_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Battle` ADD CONSTRAINT `Battle_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BattleParticipant` ADD CONSTRAINT `BattleParticipant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BattleParticipant` ADD CONSTRAINT `BattleParticipant_battleId_fkey` FOREIGN KEY (`battleId`) REFERENCES `Battle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_battleId_fkey` FOREIGN KEY (`battleId`) REFERENCES `Battle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friendship` ADD CONSTRAINT `Friendship_requesterId_fkey` FOREIGN KEY (`requesterId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friendship` ADD CONSTRAINT `Friendship_addresseeId_fkey` FOREIGN KEY (`addresseeId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
