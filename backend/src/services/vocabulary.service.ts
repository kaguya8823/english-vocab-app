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

export const getVocabularyByIdService = async (id: number) => {
    return prisma.vocabulary.findUnique({
        where: { id },
    });
};

export const updateVocabularyService = async (
    id: number,
    data: {
        word: string;
        meaning: string;
        exampleSentence: string | null;
        partOfSpeech: string;
        examLevel: string | null;
    }
) => {
    const result = await prisma.vocabulary.updateMany({
        where: { id },
        data,
    });

    if (result.count === 0) {
        return null;
    }

    return getVocabularyByIdService(id);
};

export const deleteVocabularyService = async (id: number) => {
    const result = await prisma.vocabulary.deleteMany({
        where: { id },
    });

    return result.count > 0;
};