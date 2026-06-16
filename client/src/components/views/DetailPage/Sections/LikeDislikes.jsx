import React, { useState, useEffect } from 'react';
import { Button, Space, message } from 'antd';
import { LikeFilled, LikeOutlined, DislikeFilled, DislikeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import api from '../../../../utils/api';

/**
 * like / dislike 버튼과 집계 카운트를 표시한다.
 * - 비로그인: 집계 조회만 가능 (getReactionCount는 auth 불필요)
 * - 로그인:   클릭 시 toggle API 호출, 응답에서 최신 집계를 반영한다.
 *
 * @param {number} movieId
 */
const LikeDislikes = ({ movieId }) => {
  const [counts,       setCounts]       = useState({ likes: 0, dislikes: 0 });
  const [userReaction, setUserReaction] = useState(null); // 'like' | 'dislike' | null
  const isAuth = useSelector((state) => state.user.isAuth);

  useEffect(() => {
    api.get(`/reaction/count?movieId=${movieId}`).then((res) => {
      if (res.data.success) setCounts(res.data.data);
    });
  }, [movieId]);

  const handleReaction = async (type) => {
    if (!isAuth) {
      message.warning('로그인이 필요합니다.');
      return;
    }
    const res = await api.post('/reaction/toggle', { movieId, type });
    if (res.data.success) {
      setCounts(res.data.data);
      setUserReaction((prev) => (prev === type ? null : type));
    }
  };

  return (
    <Space style={{ marginLeft: 16 }}>
      <Button
        icon={userReaction === 'like' ? <LikeFilled /> : <LikeOutlined />}
        onClick={() => handleReaction('like')}
      >
        {counts.likes}
      </Button>
      <Button
        icon={userReaction === 'dislike' ? <DislikeFilled /> : <DislikeOutlined />}
        onClick={() => handleReaction('dislike')}
      >
        {counts.dislikes}
      </Button>
    </Space>
  );
};

export default LikeDislikes;
