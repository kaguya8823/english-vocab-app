import { useState } from 'react';
import type { Vocabulary } from '../types/vocabulary';

type VocabularyStudyProps = {
    vocabularies: Vocabulary[];
    onClose: () => void;
};

const VocabularyStudy = ({
    vocabularies,
    onClose,
}: VocabularyStudyProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    if (vocabularies.length === 0) {
        return (
            <section>
                <h2>学習モード</h2>
                <p>学習できる単語がありません。</p>
                <button type="button" onClick={onClose}>
                    一覧に戻る
                </button>
            </section>
        );
    }

    const vocabulary =
        vocabularies[currentIndex % vocabularies.length];
    
    const moveTo = (nextIndex: number) => {
        const length = vocabularies.length;
        setCurrentIndex((nextIndex + length) % length);
        setShowAnswer(false);
    };

    return (
        <section>
            <h2>英単語 学習モード</h2>

            <p>
                {currentIndex % vocabularies.length + 1}
                {' / '}
                {vocabularies.length} 単語
            </p>

            <article>
                <h3>{vocabulary.word}</h3>

                {showAnswer ? (
                    <>
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
                    </>
                ) : (
                    <p>意味を考えてから答えを確認しよう。</p>
                )}
            </article>

            <button
                type='button'
                onClick={() => setShowAnswer((previous) => !previous)}
            >
                {showAnswer ? '答えを隠す' : '答えを見る'}
            </button>

            <div>
                <button
                    type='button'
                    onClick={() => moveTo(currentIndex - 1)}
                >
                    前の単語
                </button>

                <button
                    type='button'
                    onClick={() => moveTo(currentIndex + 1)}
                >
                    次の単語
                </button>
            </div>

            <button type='button' onClick={onClose}>
                学習を終了して一覧に戻る
            </button>
        </section>
    );
};

export default VocabularyStudy;