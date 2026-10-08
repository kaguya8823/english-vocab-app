// Express サーバーのセットアップ

import express from 'express';
import cors from 'cors';

import vocabularyRoutes from './routes/vocabulary.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/vocabularies', vocabularyRoutes);

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});