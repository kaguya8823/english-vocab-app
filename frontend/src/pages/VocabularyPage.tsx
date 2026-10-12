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
                </article>
            ))}
        </main>
    );
};

export default VocabularyPage;