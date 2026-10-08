import { Request, Response } from 'express';

export const getAllVocabularies = async (
    req: Request,
    res: Response
) => {
    res.json({ message: "Get all vocabularies"});
};

export const createVocabulary = async (
    req: Request,
    res: Response
) => {
    res.json({ message: "Create a new vocabulary" });
};

export const getVocabularyById = async (
    req: Request,
    res: Response
) => {
    res.json({ message: "Get vocabulary by ID" });
};

export const updateVocabulary = async (
    req: Request,
    res: Response
) => {
    res.json({ message: "Update vocabulary" });
};

export const deleteVocabulary = async (
    req: Request,
    res: Response
) => {
    res.json({ message: "Delete vocabulary" });
};