import prisma from '../prisma/prisma';

export const getAllVocabularyService = async () => {
    return prisma.vocabulary.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
};

export const createVocabularyService = async (
    data: {
        word:             string;
        meaning:          string;
        exampleSentence?: string;
        partOfSpeech:     string;
        examLevel?:       string;
    }
) => {
    return prisma.vocabulary.create({
        data
    });
};