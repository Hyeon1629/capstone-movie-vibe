// 개발 환경 설정. 값은 .env에서 주입되며, 미설정 시 dev 기본값으로 폴백한다.
module.exports = {
  mongoURI:  process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
};
