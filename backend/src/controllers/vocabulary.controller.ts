import { Request, Response } from 'express';

import {
    getAllVocabularyService,
    createVocabularyService,
    getVocabularyByIdService,
    updateVocabularyService,
    deleteVocabularyService,
} from '../services/vocabulary.service';

const getId = (value: string | string[]) => {
    if (typeof value !== 'string') {
        return null;
    }
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

export const getAllVocabularies = async (
    req: Request,
    res: Response
) => {
    try {
        const vocabularies =
            await getAllVocabularyService();
        
        res.json(vocabularies);
    } catch (error) {
        res.status(500).json({ message: 'Server error'});
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
        res.status(500).json({ message: 'Server Error'});
    }
};

export const getVocabularyById = async (
    req: Request,
    res: Response
) => {
    const id = getId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: 'Invalid vocabulary ID' });
        return;
    }

    try {
        const vocabulary = await getVocabularyByIdService(id);
        if (!vocabulary) {
            res.status(404).json({ message: 'Vocabulary not found' });
            return;
        }
        res.json(vocabulary);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateVocabulary = async (
    req: Request,
    res: Response
) => {
    const id = getId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: 'Invalid vocabulary ID' });
        return;
    }

    if (!isRecord(req.body)) {
        res.status(400).json({ message: 'Invalid vocabulary data' });
        return;
    }

    const { word, meaning, exampleSentence, partOfSpeech, examLevel } =
        req.body;
    if (
        typeof word !== 'string' || !word.trim() ||
        typeof meaning !== 'string' || !meaning.trim() ||
        typeof partOfSpeech !== 'string' || !partOfSpeech.trim() ||
        (typeof exampleSentence !== 'string' && exampleSentence !== null) ||
        (typeof examLevel !== 'string' && examLevel !== null)
    ) {
        res.status(400).json({ message: 'Invalid vocabulary data' });
        return;
    }

    try {
        const vocabulary = await updateVocabularyService(id, {
            word: word.trim(),
            meaning: meaning.trim(),
            exampleSentence: typeof exampleSentence === 'string'
                ? exampleSentence.trim()
                : null,
            partOfSpeech: partOfSpeech.trim(),
            examLevel: typeof examLevel === 'string'
                ? examLevel.trim() || null
                : null,
        });
        if (!vocabulary) {
            res.status(404).json({ message: 'Vocabulary not found' });
            return;
        }
        res.json(vocabulary);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteVocabulary = async (
    req: Request,
    res: Response
) => {
    const id = getId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: 'Invalid vocabulary ID' });
        return;
    }

    try {
        const deleted = await deleteVocabularyService(id);
        if (!deleted) {
            res.status(404).json({ message: 'Vocabulary not found' });
            return;
        }
        res.status(204).send();
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
};