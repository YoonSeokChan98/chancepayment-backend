import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.sendStatus(401); // 인증 실패
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // 유효하지 않은 토큰
        }
        req.userId = user.user.id; // 사용자 ID 설정
        next(); // 다음 미들웨어 또는 핸들러로 이동
    });
};