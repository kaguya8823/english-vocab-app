import { Request, Response } from 'express';

import {
    getAllVocabularyService
} from '../services/vocabulary.service';

import {
    createVocabularyService
} from '../services/vocabulary.service';

export const getAllVocabularies = async (
    req: Request,
    res: Response
) => {
    try {
        const vocabularies = 
            await getAllVocabularyService();
        
        res.json(vocabularies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vocabularies' });
    }
};

export const createVocabulary = async (
    req: Request,
    res: Response
) => {
    try {
        const vocabulary =
            await createVocabularyService(req.body);
        res.status(201).json(vocabulary);
    
    } catch(error) {
        res.status(500).json({
            message: "Failed to create vocabulary",
        })
    }
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