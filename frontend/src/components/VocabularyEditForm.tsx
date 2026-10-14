import { useState } from 'react';
import type { SubmitEvent } from 'react';
// import type { RormEvent } from 'react'; は、非推奨。なので、上記のように{SubmitEvent}として処理する
// 反映のさせ方は31行目のようにする。

import type { Vocabulary } from '../types/vocabulary';
import { updateVocabulary } from '../services/vocabulary.service';

type VocabularyEditFormProps = {
    vocabulary: Vocabulary;
    onUpdated:  () => void;
    onCancel:   () => void;
};

const VocabularyEditForm = ({
    vocabulary,
    onUpdated,
    onCancel,
}: VocabularyEditFormProps) => {
    const [word, setWord] = useState(vocabulary.word);
    const [meaning, setMeaning] = useState(vocabulary.meaning);
    const [exampleSentence, setExampleSentence] = useState(
        vocabulary.exampleSentence ?? ''
    );
    const [partOfSpeech, setPartOfSpeech] = useState(
        vocabulary.partOfSpeech
    );
    const [examLevel, setExamLevel] = useState(
        vocabulary.examLevel ?? ''
    );
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            setSaving(true);

            await updateVocabulary(vocabulary.id, {
                word: word.trim(),
                meaning: meaning.trim(),
                exampleSentence: exampleSentence.trim() || null,
                partOfSpeech,
                examLevel: examLevel || null,
            });

            onUpdated();
        } catch {
            setError('単語の更新に失敗しました。');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>単語を編集</h3>

            <div>
                <label htmlFor="edit-word">英単語</label>
                <input
                    id="edit-word"
                    value={word}
                    onChange={(event) => setWord(event.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="edit-meaning">日本語訳</label>
                <input
                    id="edit-meaning"
                    value={meaning}
                    onChange={(event) => setMeaning(event.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="edit-example">例文</label>
                <input
                    id="edit-example"
                    value={exampleSentence}
                    onChange={(event) => setExampleSentence(event.target.value)}
                />
            </div>

            <div>
                <label htmlFor="edit-part-of-speech">品詞</label>
                <select
                    id="edit-part-of-speech"
                    value={partOfSpeech}
                    onChange={(event) => setPartOfSpeech(event.target.value)}
                    required
                >
                    <option value="noun">名詞</option>
                    <option value="verb">動詞</option>
                    <option value="abjective">形容詞</option>
                    <option value="adverb">副詞</option>
                    <option value="preposition">前置詞</option>
                    <option value="pronoun">代名詞</option>
                    <option value="conjunction">接続詞</option>
                    <option value="interjection">間投詞</option>
                </select>
            </div>

            <div>
                <label htmlFor="edit-exam-level">英語のレベル</label>
                <select
                    id="edit-exam-level"
                    value={examLevel}
                    onChange={(event) => setExamLevel(event.target.value)}
                >
                    <option value="">未設定</option>
                    <option value="Eiken-5">英検５級</option>
                    <option value="Eiken-4">英検４級</option>
                    <option value="Eiken-3">英検３級</option>
                    <option value="Eiken-Pre2">英検準２級</option>
                    <option value="Eiken-2">英検２級</option>
                    <option value="Eiken-Pre1">英検準１級</option>
                    <option value="Eiken-1">英検１級</option>
                </select>
            </div>

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={saving}>
                {saving ? '保存中・・・' : '変更を保存'}
            </button>

            <button type="button" onClick={onCancel} disabled={saving}>
                キャンセル
            </button>
        </form>
    );
};

export default VocabularyEditForm;