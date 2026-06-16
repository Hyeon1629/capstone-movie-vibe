/**
 * @module Favorite
 *
 * 사용자가 즐겨찾기(북마크)한 영화 목록을 저장한다.
 *
 * 설계 결정:
 * - movieId(Number)만 저장하고 영화 상세 정보는 TMDB에 위임한다.
 * - movieTitle / moviePoster는 의도적 비정규화(Denormalization)다.
 *   즐겨찾기 목록을 렌더링할 때마다 TMDB API를 N번 호출하면 레이트 리밋과
 *   응답 지연이 발생하므로, 목록 표시에 필요한 최소 필드만 여기에 저장한다.
 *   영화 원본 데이터가 변경될 가능성은 낮고, 변경되더라도 UX 영향이 미미하므로
 *   정합성보다 조회 성능을 우선한다.
 * - Compound Unique Index { userId, movieId }로 같은 영화를 중복 즐겨찾기하는
 *   것을 DB 레벨에서 차단한다.
 */

const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  movieId: {
    type:     Number,
    required: true,
  },
  // 비정규화 필드: 목록 조회 시 TMDB 재요청을 방지하기 위해 저장한다.
  movieTitle: {
    type: String,
  },
  moviePoster: {
    type: String,
  },
  createdAt: {
    type:    Date,
    default: Date.now,
  },
});

/**
 * Compound Unique Index
 * 동일 사용자가 같은 영화를 두 번 즐겨찾기 추가하는 것을 DB 레벨에서 방지한다.
 */
favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
