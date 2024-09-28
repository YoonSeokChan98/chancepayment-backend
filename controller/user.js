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
        if (find) {
            const decryption = await bcrypt.compare(password, find.password);
            if (decryption) {
                const response = {
                    id: find.id,
                    email: find.email,
                };

                const token = jwt.sign({ user: response }, process.env.JWT_ACCESS_SECRET, {
                    expiresIn: process.env.JWT_ACCESS_LIFETIME,
                });
                console.log('token', token);

                res.status(200).json({
                    code: 200,
                    message: '로그인 성공. 토큰이 발급되었습니다.',
                    token: token, // 토큰
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
    } catch (error) {
        console.log('로그아웃 오류: ', error);
        res.status(500).json({ result: false, message: '서버오류' });
    }
};
