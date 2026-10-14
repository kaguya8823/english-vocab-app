import { useState, useEffect, useCallback } from 'react';
import type { Vocabulary } from '../types/vocabulary';
import {
    deleteVocabulary,
    fetchVocabularies,
} from '../services/vocabulary.service';
import VocabularyForm from '../components/VocabularyForm';
import VocabularyEditForm from '../components/VocabularyEditForm';
import VocabularyStudy from '../components/VocabularyStudy';

type SortOrder = 'word-asc' | 'word-desc' | 'newest' | 'oldest';

const VocabularyPage = () => {
    // 単語一覧の状態
    const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);

    // 読み込み・エラーの状態
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 検索キーワードの状態
    const [keyword, setKeyword] = useState('');

    // ソート条件の状態
    const [sortOrder, setSortOrder] = useState<SortOrder>('word-asc');

    // APIから単語一覧を取得
    const loadVocabularies = useCallback(async () => {
        try {
            setError('');

            const data = await fetchVocabularies();

            setVocabularies(data);
        } catch {
            setError('単語一覧を取得できませんでした。');
        } finally {
            setLoading(false);
        }
    },[]);

    // ページ表示時に一覧を取得
    // ★useEffect の中に setState を入れる処理は推奨されない。そのための対策処理
    useEffect(() => {
        let isMounted = true;

        const initLoad = async () => {
            try {
                setError('');
                const data = await fetchVocabularies();

                if (isMounted) {
                    setVocabularies(data);
                }
            } catch {
                if (isMounted) {
                    setError('単語一覧を取得できませんでした。');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void initLoad();

        return () => {
            isMounted = false;
        };
    },[])

        // 編集管理のstate
    const [editingVocabulary, setEditingVocabulary] =
        useState<Vocabulary | null>(null);
    const [deletingVocabularyId, setDeletingVocabularyId] =
        useState<number | null>(null);
    const [actionError, setActionError] = useState('');

    // 品詞の絞り込みのstate
    const [selectedPartOfSpeech, setSelectedPartOfSpeech] =
        useState('all');
    
    // レベルの絞り込みのstate
    const [selectedExamLevel, setSelectedExamLevel] =
        useState('all');

    // 検索機能
    const searchText = keyword.trim().toLowerCase();

    // 検索機能＆絞り込み処理＆レベル絞り込み
    const filteredVocabularies = vocabularies.filter(
        (vocabulary) => {
            const matchesKeyword =
                vocabulary.word.toLowerCase().includes(searchText) ||
                vocabulary.meaning.toLowerCase().includes(searchText) ||
                (vocabulary.exampleSentence ?? '')
                    .toLowerCase()
                    .includes(searchText);
            const matchesPartOfSpeech =
                selectedPartOfSpeech === 'all' ||
                vocabulary.partOfSpeech === selectedPartOfSpeech;
            const matchesExamLevel =
                selectedExamLevel === 'all' ||
                vocabulary.examLevel === selectedExamLevel;
                
            return matchesKeyword &&
                matchesPartOfSpeech &&
                matchesExamLevel;
        }
    );

    // ソート機能
    const sortedVocabularies = [...filteredVocabularies].sort((a, b) => {
        switch(sortOrder) {
            case 'word-desc':
                return b.word.localeCompare(a.word);
            
            case 'newest':
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            
            case 'oldest':
                return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                );

            case 'word-asc':
            default:
                return a.word.localeCompare(b.word);
        }
    });

    // 学習モード
    const [isStudyMode, setIsStudyMode] = useState(false);


    
    // 画面表示
    return (
        <main>
            <h1>英単語長</h1>
            {/* 単語登録フォーム */}
            <section>
                <VocabularyForm 
                onCreated={loadVocabularies} />
            </section>

            <hr />

            {/* 検索・ソートエリア */}
            <section>
                <h2>登録済みの単語</h2>

                {/* 検索フォーム */}
                <div>
                    <label htmlFor="vocabulary-search">
                        単語・日本語訳・例文で検索
                    </label>

                    <input
                        id="vocabulary-search"
                        type="search"
                        placeholder="例：apple, りんご, I eat..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />

                    {keyword && (
                        <button
                            type='button'
                            onClick={() => setKeyword('')}
                        >
                            検索をクリア
                        </button>
                    )}    
                </div>

                {/* ソートフォーム */}
                <div>
                    <label htmlFor="vocabulary-sort">
                        並び変え
                    </label>

                    <select
                        id='vocabulary-sort'
                        value={sortOrder}
                        onChange={(e) =>
                            setSortOrder(e.target.value as SortOrder)
                        }
                    >
                        <option value="word-asc">英単語 A -&gt; Z</option>
                        <option value="word-desc">英単語 Z -&gt; A</option>
                        <option value="newest">登録日の新しい順</option>
                        <option value="oldest">登録日の古い順</option>
                    </select>
                </div>

                {/* 品詞の絞り込み */}
                <label htmlFor='part-of-speech-filter'>
                    品詞で絞り込む
                </label>

                <select
                    id="part-of-speech-filter"
                    value={selectedPartOfSpeech}
                    onChange={(e) =>
                        setSelectedPartOfSpeech(e.target.value)
                    }
                >
                    <option value='all'>すべて</option>
                    <option value='noun'>名詞</option>
                    <option value='verb'>動詞</option>
                    <option value='adjective'>形容詞</option>
                    <option value='adverb'>副詞</option>
                    <option value='other'>その他</option>
                </select>

                {/* レベルの絞り込み */}
                <label htmlFor='part-of-speech-filter'>
                    レベルで絞り込む
                </label>

                <select
                    id="part-of-examlevel-filter"
                    value={selectedExamLevel}
                    onChange={(e) =>
                        setSelectedExamLevel(e.target.value)
                    }
                >
                    <option value='all'>すべて</option>
                    <option value="Eiken-5">英検５級</option>
                    <option value="Eiken-4">英検４級</option>
                    <option value="Eiken-3">英検３級</option>
                    <option value="Eiken-Pre2">英検準２級</option>
                    <option value="Eiken-2">英検２級</option>
                    <option value="Eiken-Pre1">英検準１級</option>
                    <option value="Eiken-1">英検１級</option>
                </select>

                <p>
                    表示件数：{sortedVocabularies.length} 件
                </p>
            </section>

            <hr />

            {/* 単語一覧 */}
            <section>
                {loading && <p>単語を読み込み中...</p>}

                {!loading && error && (
                    <div>
                        <p role='alert'>{error}</p>
                        <button type="button" onClick={() => void loadVocabularies()}>
                            再読み込み
                        </button>
                    </div>
                )}

                {!loading && !error && sortedVocabularies.length === 0 && (
                    <p>
                        {keyword.trim()
                        ? '検索条件に一致する単語はありません。'
                        : 'まだ単語が登録されていません。'}
                    </p>
                )}

                {actionError && <p role="alert">{actionError}</p>}

                {!loading &&
                    !error &&
                    sortedVocabularies.map((vocabulary) => (
                        <article key={vocabulary.id}>
                            {editingVocabulary?.id === vocabulary.id ? (
                                <VocabularyEditForm
                                    vocabulary={vocabulary}
                                    onUpdated={async () => {
                                        setEditingVocabulary(null);
                                        await loadVocabularies();
                                    }}
                                    onCancel={() => setEditingVocabulary(null)}
                                />
                            ) : (
                                <>
                                    <h3>{vocabulary.word}</h3>

                                    <p>
                                        <strong>日本語訳：</strong>
                                        {vocabulary.meaning}
                                    </p>

                                    {vocabulary.exampleSentence && (
                                        <p>
                                            <strong>例文：</strong>
                                            {vocabulary.exampleSentence}
                                        </p>
                                    )}

                                    <p>
                                        <strong>品詞：</strong>
                                        {vocabulary.partOfSpeech}
                                    </p>

                                    <p>
                                        <strong>英語のレベル：</strong>
                                        {vocabulary.examLevel || '未設定'}
                                    </p>

                                    <hr />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActionError('');
                                            setEditingVocabulary(vocabulary);
                                        }}
                                    >
                                        編集
                                    </button>

                                    <button
                                        type="button"
                                        disabled={deletingVocabularyId === vocabulary.id}
                                        onClick={async () => {
                                            if (!window.confirm(`「${vocabulary.word}」を削除しますか？`)) {
                                                return;
                                            }

                                            setActionError('');
                                            setDeletingVocabularyId(vocabulary.id);
                                            try {
                                                await deleteVocabulary(vocabulary.id);
                                                if (editingVocabulary?.id === vocabulary.id) {
                                                    setEditingVocabulary(null);
                                                }
                                                await loadVocabularies();
                                            } catch {
                                                setActionError('単語の削除に失敗しました。');
                                            } finally {
                                                setDeletingVocabularyId(null);
                                            }
                                        }}
                                    >
                                        {deletingVocabularyId === vocabulary.id
                                            ? '削除中...'
                                            : '削除'}
                                    </button>
                                </>
                            )}
                        </article>
                    ))}
            </section>
            
        </main>
    );
};

export default VocabularyPage;