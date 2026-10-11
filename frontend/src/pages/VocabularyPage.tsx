import { useEffect, useState } from 'react';
import { fetchVocabularies } from '../services/vocabulary.service';
// 型だけに使われる場合は、import type を使うと良い
import type { Vocabulary } from '../types/vocabulary';

const VocabularyPage = () => {
    const [vocabularies, setVocabularies] =
    useState<Vocabulary[]>([]);

    useEffect(() => {
        const loadVocabularies = async () => {
            try {
                const data = await fetchVocabularies();
                setVocabularies(data);
            } catch (error) {
                console.error("Error fetching vocabularies:", error);
            }
        };
        loadVocabularies();
    
    },[]);

    return (
        <div>
            <h1>Vocabulary List</h1>
            {vocabularies.map((vocabulary) => (
                <div key=
                {vocabulary.id}>
                    <h3>{vocabulary.word}</h3>

                    <p>{vocabulary.meaning}</p>
                </div>
            ))}
        </div>
    );
};

export default VocabularyPage;