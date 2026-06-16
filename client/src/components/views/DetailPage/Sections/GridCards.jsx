import React from 'react';
import MovieCard from '../../../common/MovieCard';
import GridContainer from '../../../common/GridContainer';

/**
 * 영화 배열을 GridContainer + MovieCard 조합으로 렌더링한다.
 * DetailPage에서 유사 영화, 출연진(인물 카드) 등 다양한 목록에 재사용한다.
 *
 * @param {Array}    movies       - 표시할 항목 배열
 * @param {Function} [onCardClick] - 카드 클릭 override (기본: /movie/:id 라우팅)
 */
const GridCards = ({ movies = [], onCardClick }) => (
  <GridContainer>
    {movies.map((item) => (
      <MovieCard
        key={item.id}
        movieId={item.id}
        movieName={item.title || item.name}
        image={item.poster_path || item.profile_path}
        onClick={onCardClick}
      />
    ))}
  </GridContainer>
);

export default GridCards;
