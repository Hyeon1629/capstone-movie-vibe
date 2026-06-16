/**
 * @module Reaction
 *
 * 사용자의 영화에 대한 반응(like / dislike)을 저장한다.
 *
 * 설계 결정:
 * - like와 dislike를 별도 컬렉션으로 분리하지 않고 type 필드로 구분한다.
 *   두 상태는 상호 배타적이고, 하나의 도큐먼트로 upsert 패턴을 적용하기
 *   가장 자연스럽기 때문이다.
 * - 중복 방지 전략은 2단계로 구성된다:
 *   1차 방어선: { userId, movieId } Compound Unique Index — DB 레벨에서 한
 *              유저가 같은 영화에 두 개의 Reaction 도큐먼트를 갖지 못하게 한다.
 *   2차 방어선: Controller의 upsert 로직 — 이미 Reaction이 존재하면 type만
 *              업데이트(like ↔ dislike 전환)하거나 삭제(토글)한다.
 *   인덱스만으로는 "type 변경" 시나리오를 처리할 수 없으므로 두 레이어가 모두 필요하다.
 */

const mongoose = require('mongoose');

const REACTION_TYPES = ['like', 'dislike'];

const reactionSchema = new mongoose.Schema({
  userId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  movieId: {
    type:     Number,
    required: true,
  },
  type: {
    type:     String,
    enum:     REACTION_TYPES,
    required: true,
  },
});

/**
 * Compound Unique Index
 * 한 사용자가 같은 영화에 like와 dislike를 동시에 보유하는 것을 DB 레벨에서 차단한다.
 * (중복 방지의 1차 방어선)
 */
reactionSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);
