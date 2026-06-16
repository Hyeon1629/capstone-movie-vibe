const Favorite = require('../models/Favorite');

// MongoDB duplicate key 에러 코드
const MONGO_DUPLICATE_KEY = 11000;

/**
 * POST /api/favorite/add  [auth 필요]
 * 즐겨찾기를 추가한다.
 * Compound Unique Index 위반 시 친절한 메시지로 변환하여 반환한다.
 */
const addFavorite = async (req, res) => {
  try {
    const { movieId, movieTitle, moviePoster } = req.body;
    const favorite = await Favorite.create({
      userId: req.user._id,
      movieId,
      movieTitle,
      moviePoster,
    });
    return res.status(201).json({ success: true, data: favorite });
  } catch (err) {
    if (err.code === MONGO_DUPLICATE_KEY) {
      return res.status(409).json({ success: false, message: '이미 즐겨찾기에 추가된 영화입니다.' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/favorite/remove  [auth 필요]
 * 즐겨찾기를 제거한다.
 */
const removeFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const result = await Favorite.deleteOne({ userId: req.user._id, movieId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: '즐겨찾기 항목을 찾을 수 없습니다.' });
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/favorite/list  [auth 필요]
 * 로그인한 사용자의 즐겨찾기 목록을 반환한다.
 */
const getFavoritedMovie = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, data: favorites });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addFavorite, removeFavorite, getFavoritedMovie };
