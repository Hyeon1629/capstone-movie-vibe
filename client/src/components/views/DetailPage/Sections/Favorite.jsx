import React from 'react';
import { Button } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import useFavoriteToggle from '../../../../hooks/useFavoriteToggle';

/**
 * 즐겨찾기 토글 버튼.
 * 로직은 useFavoriteToggle Hook에 위임하므로 이 컴포넌트는 UI만 담당한다.
 *
 * @param {{ movieId: number, movieTitle: string, moviePoster: string }} movieInfo
 */
const Favorite = ({ movieInfo }) => {
  const { isFavorited, toggle, loading } = useFavoriteToggle(movieInfo);

  return (
    <Button
      icon={isFavorited ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
      onClick={toggle}
      loading={loading}
      size="large"
    >
      {isFavorited ? '즐겨찾기 제거' : '즐겨찾기 추가'}
    </Button>
  );
};

export default Favorite;
