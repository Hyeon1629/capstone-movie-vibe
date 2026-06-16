const User = require('../models/User');

/**
 * POST /api/users/register
 * 신규 사용자를 생성한다. password 해싱은 User pre('save') 훅이 담당한다.
 */
const register = async (req, res) => {
  try {
    const user = await new User(req.body).save();
    return res.status(201).json({ success: true, data: { _id: user._id } });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/users/login
 * 이메일/비밀번호 검증 후 JWT를 httpOnly 쿠키로 발급한다.
 */
const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    user.comparePassword(req.body.password, async (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      try {
        const savedUser = await user.generateToken();
        return res
          .cookie('x_auth', savedUser.token, { httpOnly: true })
          .json({ success: true, data: { _id: savedUser._id } });
      } catch (tokenErr) {
        return res.status(500).json({ success: false, message: tokenErr.message });
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/users/auth  [auth 필요]
 * 쿠키 토큰으로 세션을 복원하고 클라이언트에 사용자 정보를 반환한다.
 */
const auth = (req, res) => {
  return res.json({
    success: true,
    data: {
      _id:   req.user._id,
      email: req.user.email,
      name:  req.user.name,
      role:  req.user.role,
    },
  });
};

/**
 * GET /api/users/logout  [auth 필요]
 * DB의 token 필드를 비워 서버 측에서 JWT를 무효화한다.
 */
const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: '' });
    return res.clearCookie('x_auth').json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, auth, logout };
