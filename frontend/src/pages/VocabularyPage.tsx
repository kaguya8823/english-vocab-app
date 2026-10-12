import { useEffect, useState } from 'react';
import { fetchVocabularies } from '../services/vocabulary.service';
// 型だけに使われる場合は、import type を使うと良い
import type { Vocabulary } from '../types/vocabulary';
import VocabularyForm from '../components/VocabularyForm';

const VocabularyPage = () => {
    const [vocabularies, setVocabularies] =
    useState<Vocabulary[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [keyword, setKeyword] = useState('');

    const [sortOrder, setSortOrder] = useState('word-asc');

    useEffect(() => {
        // 連鎖レンダリング警告を回避するために、初期化 state は必要な時だけ呼ぶ
        // もしくは、非同期処理の直前に配置
        let isMounted = true;

        const loadData = async () => {
            try {
                // 初期化が必要な場合、ここで実行
                if (isMounted) setError('');
            
                const data = await fetchVocabularies();
            
                // コンポーネントがまだ存在している(アンマウントされていない)場合のみ更新
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

        void loadData();

        // クリーンアップ関数：通信中にユーザーが画面を切り替えた場合のバグ（メモリリーク）を防ぐ
        return () => {
            isMounted = false;
        };
    },[]) // 最初の一回だけ実行するために、依存配列は空にする

    // 以下の const は、onCreate を呼び出すために必要
    const reloadVocabularies = async () => {
    try {
        setError('');
        setLoading(true);
        const data = await fetchVocabularies();
        setVocabularies(data);
    } catch {
        setError('単語一覧を取得できませんでした。');
    } finally {
        setLoading(false);
    }

    // 検索機能
    const filterdVocabularies = vocabularies.filter((vocabulary) => {
        const searchText = keyword.trim().toLowerCase();

        return (
            vocabulary.word.toLowerCase().includes(searchText) ||
            vocabulary.meaning.toLowerCase().includes(searchText) ||
            (vocabulary.exampleSentence ?? '')
                .toLowerCase()
                .includes(searchText)
        );
    });

    // ソート機能
    const sortedVocabularies = [...filterdVocabularies].sort((a, b) => {
        switch (sortOrder) {
            case 'word-desc':
                return b.word.localeCompare(a.word);
            
            case 'newest':
                return new Date(b.createdAt).getTime()
                - new Date(a.createdAt).getTime();
            
            case 'oldest':
                return new Date(a.createdAt).getTime()
                - new Date(b.createdAt).getTime();
            
            case 'word-asc':
            default:
                return a.word.localeCompare(b.word);
        }
    });
};

    return (
        <main>
            <h1>英単語長</h1>
            <VocabularyForm onCreated={reloadVocabularies}  />

            <h2>登録済みの単語</h2>
            {loading && <p>読み込み中・・・</p>}
            {error && <p role='alert'>{error}</p>}

            {!loading && !error && vocabularies.length === 0 && (
                <p>まだ単語が登録されていません。</p>
            )}

            {vocabularies.map((vocabulary) => (
                <article key={vocabulary.id}>
                    <h3>{vocabulary.word}</h3>
                    <p>{vocabulary.meaning}</p>
                    {vocabulary.exampleSentence && (
                        <p>{vocabulary.exampleSentence}</p>
                    )}
                    <p>品詞：{vocabulary.partOfSpeech}</p>
                    <p>レベル：{vocabulary.examLevel ?? '未設定'}</p>
                    <input 
                        type="serch"
                        placeholder='英単語・日本語訳・例文で検索'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="word-asc">英単語 A -&gt; Z</option>
                        <option value="word-desc">英単語 Z -&gt; A</option>
                        <option value="newest">登録日が新しい順</option>
                        <option value="oldest">登録日が古い順</option>

                    </select>
                </article>
            ))}
        </main>
    );
};

export default VocabularyPage;