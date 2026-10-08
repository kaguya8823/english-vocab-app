-- CreateTable
CREATE TABLE `Vocabulary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `word` VARCHAR(191) NOT NULL,
    `meaning` VARCHAR(191) NOT NULL,
    `exampleSentence` VARCHAR(191) NULL,
    `postOfSpeech` VARCHAR(191) NOT NULL,
    `examLevel` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
