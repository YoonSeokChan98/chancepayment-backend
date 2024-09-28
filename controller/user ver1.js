import bcrypt from 'bcrypt';
import db from '../models/index.js';
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
            // 비밀번호 복호화
            const decryption = await bcrypt.compare(password, find.password);
            if (decryption) {
                const response = {
                    id: find.id,
                    email: find.email,
                };
                // 세션에 사용자 정보 저장
                req.session.user = response;
                console.log('response', response);
                // console.log('req.session.user', req.session.user);

                res.json({ result: true, response, message: '로그인 성공' });
            } else {
                res.json({ result: false, code: 2001, response: null, message: '비밀번호가 틀렸습니다' }); // password가 다른경우
            }
        } else {
            res.json({ result: false, code: 2002, response: null, message: '회원이 아닙니다.' }); // email 없는 경우
        }
    } catch (error) {
        console.log('로그인 오류: ', error);
        res.status(500).json({ result: false, message: '서버오류' });
    }
};

// 로그아웃
export const logout = async (req, res) => {
    try {
        if (req.session.user) {
            req.session.destroy((err) => {
                if (err) {
                    console.log('세션 종료 중 오류: ', err);
                    res.status(500).json({ result: false, message: '서버오류' });
                }
                console.log('세션쿠키 삭제완료 / 세션쿠키: ', req.session);
            });
        } else {
            console.log('로그인 정보가 없습니다. / 로그인을 해주세요');
        }
    } catch (error) {
        console.log('로그아웃 오류: ', error);
        res.status(500).json({ result: false, message: '서버오류' });
    }
};
