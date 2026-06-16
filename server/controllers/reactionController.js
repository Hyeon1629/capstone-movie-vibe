const Reaction = require('../models/Reaction');

/**
 * 주어진 movieId의 like/dislike 집계를 반환하는 내부 헬퍼.
 * toggleReaction과 getReactionCount가 공유한다.
 */
const aggregateCounts = (movieId) =>
  Promise.all([
    Reaction.countDocuments({ movieId, type: 'like' }),
    Reaction.countDocuments({ movieId, type: 'dislike' }),
  ]);

/**
 * POST /api/reaction/toggle  [auth 필요]
 *
 * 반응 토글 로직 (2차 방어선 — 1차는 Compound Unique Index):
 *   1. 기존 Reaction 조회
 *   2. 없으면 → create
 *   3. 있고 type이 같으면 → deleteOne (재클릭 = 취소)
 *   4. 있고 type이 다르면 → updateOne (like ↔ dislike 전환)
 *   5. Promise.all로 최신 집계 카운트를 응답에 포함
 */
const toggleReaction = async (req, res) => {
  try {
    const { movieId, type } = req.body;
    const userId = req.user._id;

    const existing = await Reaction.findOne({ userId, movieId });

    if (!existing) {
      await Reaction.create({ userId, movieId, type });
    } else if (existing.type === type) {
      await Reaction.deleteOne({ _id: existing._id });
    } else {
      await Reaction.updateOne({ _id: existing._id }, { type });
    }

    const [likes, dislikes] = await aggregateCounts(movieId);
    return res.json({ success: true, data: { likes, dislikes } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/reaction/count  [비로그인 허용]
 * Query: movieId
 * 특정 영화의 like/dislike 집계를 반환한다.
 */
const getReactionCount = async (req, res) => {
  try {
    const { movieId } = req.query;
    const [likes, dislikes] = await aggregateCounts(Number(movieId));
    return res.json({ success: true, data: { likes, dislikes } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { toggleReaction, getReactionCount };
