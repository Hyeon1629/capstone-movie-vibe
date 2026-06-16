// .env를 가장 먼저 로드해야 config/key가 process.env를 읽을 수 있다.
require('dotenv').config();

const path       = require('path');
const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { mongoURI } = require('./config/key');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Database ──────────────────────────────────────────────────────────────────
require('dns').setServers(['8.8.8.8', '8.8.4.4']);
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/users',    require('./routes/users'));
app.use('/api/favorite', require('./routes/favorite'));
app.use('/api/reaction', require('./routes/reaction'));
app.use('/api/comment',  require('./routes/comment'));

// ── Static (production) ───────────────────────────────────────────────────────
// 빌드된 React 앱을 서빙하고, API 외 모든 경로는 SPA 진입점으로 폴백한다.
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', 'client', 'build');
  app.use(express.static(buildPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// ── Server ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
