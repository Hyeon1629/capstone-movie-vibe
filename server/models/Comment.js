/**
 * @module Comment
 *
 * 특정 영화에 달린 사용자 댓글을 저장한다.
 *
 * 설계 결정:
 * - Comment는 Favorite/Reaction과 달리 한 사용자가 같은 영화에 여러 개를 작성할 수
 *   있으므로 Compound Unique Index를 두지 않는다.
 * - { movieId, createdAt: -1 } 복합 인덱스를 통해 "특정 영화의 댓글을 최신순으로
 *   페이지네이션"하는 가장 빈번한 쿼리를 커버 인덱스로 최적화한다.
 * - content 최대 길이는 500자로 제한하여 스팸성 장문 댓글을 DB 레벨에서 차단한다.
 */

const mongoose = require('mongoose');

const MAX_CONTENT_LENGTH = 500;

const commentSchema = new mongoose.Schema({
  userId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  movieId: {
    type:     Number,
    required: true,
  },
  content: {
    type:      String,
    maxlength: MAX_CONTENT_LENGTH,
    required:  true,
  },
  createdAt: {
    type:    Date,
    default: Date.now,
  },
});

/**
 * 영화별 최신순 댓글 조회를 최적화하는 복합 인덱스.
 * `db.comments.find({ movieId }).sort({ createdAt: -1 })` 패턴을 커버한다.
 */
commentSchema.index({ movieId: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
