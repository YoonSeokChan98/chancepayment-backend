import express from 'express';
import db from './models/index.js';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './router/user.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// console.log(process.env.PORT);

app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:3000', // 프론트엔드의 주소
        credentials: true, // 인증 정보를 포함할지 여부
    })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 간단한 테스트 라우트
app.get('/ping', (req, res) => {
    res.send('pong');
});

// api 라우트
app.use('/api/user', userRouter);

// DB 연결 및 서버 시작
db.sequelize
    .sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
