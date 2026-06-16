const User = require('../models/User');

/**
 * JWT 쿠키(x_auth)를 검증하고 req.user / req.token을 주입한다.
 * 실패 시 401과 함께 에러 Envelope을 반환하여 이후 미들웨어 실행을 차단한다.
 */
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.x_auth;
    const user  = await User.findByToken(token);

    if (!user) {
      return res.status(401).json({ success: false, isAuth: false, error: true });
    }

    req.user  = user;
    req.token = token;
    next();
  } catch {
    return res.status(401).json({ success: false, isAuth: false, error: true });
  }
};

module.exports = auth;
