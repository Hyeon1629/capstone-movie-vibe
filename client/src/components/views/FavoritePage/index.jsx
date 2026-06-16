import React, { useEffect, useState } from 'react';
import { Typography, Empty } from 'antd';
import { useSelector } from 'react-redux';
import api from '../../../utils/api';
import MovieCard from '../../common/MovieCard';
import GridContainer from '../../common/GridContainer';

const { Title } = Typography;

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const userId = useSelector((state) => state.user.userData?._id);

  useEffect(() => {
    if (!userId) return;
    api.get('/favorite/list').then((res) => {
      if (res.data.success) setFavorites(res.data.data);
    });
  }, [userId]);

  return (
    <div style={{ padding: '0 24px' }}>
      <Title level={2}>즐겨찾기</Title>
      {favorites.length === 0 ? (
        <Empty description="즐겨찾기한 영화가 없습니다." />
      ) : (
        <GridContainer>
          {/* MovieCard 재사용: image는 비정규화로 저장된 moviePoster 사용 */}
          {favorites.map((fav) => (
            <MovieCard
              key={fav._id}
              movieId={fav.movieId}
              movieName={fav.movieTitle}
              image={fav.moviePoster}
            />
          ))}
        </GridContainer>
      )}
    </div>
  );
};

export default FavoritePage;
