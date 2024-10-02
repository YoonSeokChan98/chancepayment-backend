import bcrypt from 'bcrypt';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
const User = db.User;

// 회원가입
export const signup = async (req, res) => {
    try {
        console.log('회원가입 - req.body', req.body);
        const { email, password } = req.body;

        const find = await User.findOne({ where: { email } });
        if (find) {
            res.status(400).json({ result: false, message: '이미 존재하는 회원입니다.' });
        } else {
            // 암호화
            const encryption = await bcrypt.hash(password, 10);
            const result = await User.create({
                email,
                password: encryption,
            });
            console.log('회원가입 - result', result);
            res.json({ result: true, message: '회원가입 성공' });
        }
    } catch (error) {
        console.log('회원가입 오류: ', error);
        res.status(500).json({ result: false, message: '서버오류' });
    }
};

// 로그인
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const find = await User.findOne({ where: { email } });
        // console.log('find', find); // 유저정보

        if (find) {
            const decryption = await bcrypt.compare(password, find.password);
            // console.log('decryption', decryption); // true

            if (decryption) {
                const response = {
                    id: find.id,
                    email: find.email,
                };

                // Access Token 발급
                const accessToken = jwt.sign({ user: response }, process.env.JWT_ACCESS_SECRET, {
                    expiresIn: process.env.JWT_ACCESS_LIFETIME, // 일반적으로 짧게 (15분 정도)
                });

                // Refresh Token 발급
                const refreshToken = jwt.sign({ user: response }, process.env.JWT_REFRESH_SECRET, {
                    expiresIn: process.env.JWT_REFRESH_LIFETIME, // 일반적으로 길게 (7일 또는 30일)
                });

                // 쿠키에 액세스 토큰 설정
                res.cookie('accessToken', accessToken, {
                    httpOnly: true, // JavaScript에서 접근 불가
                    secure: true, // HTTPS에서만 전송
                    sameSite: 'Strict', // CSRF 공격 방지
                    maxAge: 15 * 60 * 1000, // 쿠키 만료 시간 (15분)
                });

                // Refresh Token을 DB에 저장
                await User.update({ refreshToken }, { where: { id: find.id } });

                res.status(200).json({
                    code: 200,
                    message: '로그인 성공. 토큰이 발급되었습니다.',
                    // accessToken: accessToken, // Access Token
                    // refreshToken, // Refresh Token
                    response: response, // 사용자 정보
                });
            } else {
                res.status(401).json({ result: false, code: 401, response: null, message: '비밀번호가 틀렸습니다' }); // password가 다른경우
            }
        } else {
            res.status(404).json({ result: false, code: 404, response: null, message: '회원이 아닙니다.' });
        }
    } catch (error) {
        console.log('로그인 오류: ', error);
        res.status(500).json({ result: false, message: '서버오류' });
    }
};

// 로그아웃
export const logout = async (req, res) => {
    try {
        const { userId } = req; // 로그인한 사용자 ID

        // 데이터베이스에서 리프레시 토큰 삭제
        await User.update({ refreshToken: null }, { where: { id: userId } });

        // 쿠키에서 액세스 토큰 삭제
        res.cookie('accessToken', '', {
            maxAge: 0, // 쿠키 삭제
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        });

        res.status(200).json({ result: true, message: '로그아웃 성공' });
    } catch (error) {
        console.log('로그아웃 오류: ', error);
        res.status(500).json({ result: false, message: '서버오류' });
    }
};
