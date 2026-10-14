import axios from 'axios';

const API_URL =
    'http://localhost:3002/api/vocabularies';

export const fetchVocabularies = async () => {
    const response =
        await axios.get(API_URL);

    return response.data;
};

export const createVocabulary = async (
    data: {
        word:             string;
        meaning:          string;
        exampleSentence?: string;
        partOfSpeech:     string;
        examLevel?:       string;
    }
) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

// 更新と削除の関数
export const updateVocabulary = async (
    id: number,
        data: {
            word:             string;
            meaning:          string;
            exampleSentence?: string;
            partOfSpeech:     string;
            examLevel?:       string;
        }
) => {
    const response = await axios.put(
        `${API_URL}/${id}`,
        data
    );

    return response.data;
};

export const deleteVocabulary = async (id: number) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
}