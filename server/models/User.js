/**
 * @module User
 *
 * 애플리케이션 사용자 계정을 저장한다.
 *
 * 설계 결정:
 * - password는 저장 전 bcrypt로 해싱하여 평문을 DB에 남기지 않는다.
 * - token 필드는 발급된 JWT를 DB에 저장해, 서버 측에서 무효화(로그아웃)를 가능하게 한다.
 * - role은 Number로 관리하여 권한 단계 확장 시 Enum 변경 없이 처리한다(0: 일반, 1: 관리자 등).
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');

const { jwtSecret: JWT_SECRET } = require('../config/key');

const SALT_ROUNDS    = 10;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const userSchema = new mongoose.Schema({
  email: {
    type:     String,
    unique:   true,
    required: true,
    trim:     true,
  },
  password: {
    type:      String,
    minlength: 5,
  },
  name: {
    type: String,
  },
  role: {
    type:    Number,
    default: 0,
  },
  token: {
    type: String,
  },
});

/**
 * password가 변경된 경우에만 bcrypt로 해싱한다.
 * isModified 체크를 생략하면 save() 호출마다 이미 해싱된 값을 다시 해싱하는 버그가 발생한다.
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * 평문 비밀번호와 저장된 해시를 비교한다.
 * @param {string} plainPassword - 로그인 폼에서 전달된 평문 비밀번호
 * @param {Function} callback - (err, isMatch) 형태의 Node.js 스타일 콜백
 */
userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, callback);
};

/**
 * JWT를 생성하고 user.token에 저장한 뒤 user 인스턴스를 반환한다.
 * @returns {Promise<User>} token이 저장된 user 도큐먼트
 */
userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  this.token = token;
  return this.save();
};

/**
 * 쿠키/헤더에서 추출한 token을 검증하고 해당 user를 반환한다.
 * @param {string} token - 클라이언트가 전달한 JWT
 * @returns {Promise<User>} 검증된 user 도큐먼트
 */
userSchema.statics.findByToken = async function (token) {
  const decoded = jwt.verify(token, JWT_SECRET);
  return this.findOne({ _id: decoded._id, token });
};

module.exports = mongoose.model('User', userSchema);
