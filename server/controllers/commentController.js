const Comment = require('../models/Comment');

/**
 * POST /api/comment/save  [auth 필요]
 * 댓글을 저장한다.
 */
const saveComment = async (req, res) => {
  try {
    const { movieId, content } = req.body;
    const comment = await Comment.create({ userId: req.user._id, movieId, content });
    return res.status(201).json({ success: true, data: comment });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/comment/list  [비로그인 허용]
 * Query: movieId
 * 특정 영화의 댓글을 최신순으로 반환한다.
 * populate로 작성자 이름을 조인하여 클라이언트의 추가 요청을 줄인다.
 */
const getComments = async (req, res) => {
  try {
    const { movieId } = req.query;
    const comments = await Comment.find({ movieId: Number(movieId) })
      .sort({ createdAt: -1 })
      .populate('userId', 'name');
    return res.json({ success: true, data: comments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/comment/delete  [auth 필요]
 * Body: { commentId }
 * 댓글 소유자만 삭제 가능하도록 서버 단에서 userId 일치 여부를 검증한다.
 */
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: '댓글을 찾을 수 없습니다.' });
    }

    // 소유자 검증: ObjectId는 toString()으로 비교
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: '삭제 권한이 없습니다.' });
    }

    await Comment.deleteOne({ _id: commentId });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { saveComment, getComments, deleteComment };
