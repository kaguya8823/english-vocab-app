import { Router } from 'express';
import {
    getAllVocabularies,
    createVocabulary,
    getVocabularyById,
    updateVocabulary,
    deleteVocabulary,
} from '../controllers/vocabulary.controller';

const router = Router();

// get 取得
router.get('/', getAllVocabularies);
// post 作成
router.post('/', createVocabulary);
// getById 取得
router.get('/:id', getVocabularyById);
// put 更新
router.put("/:id", updateVocabulary);
// delete 削除
router.delete('/:id', deleteVocabulary);

export default router;