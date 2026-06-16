import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import { IMAGE_BASE_URL, IMAGE_SIZE } from '../../../utils/tmdbConfig';

const { Meta } = Card;

const FALLBACK_IMAGE = 'https://placehold.co/500x750?text=No+Image';

/**
 * 프로젝트 전역 재사용 카드 컴포넌트.
 *
 * 재사용 지점:
 *  - LandingPage  : 인기/검색 결과 목록
 *  - DetailPage   : 유사 영화(GridCards), 출연진 섹션
 *  - FavoritePage : 즐겨찾기 목록
 *
 * @param {string}   image     - TMDB poster_path (앞 슬래시 포함)
 * @param {number}   movieId   - TMDB 영화 ID
 * @param {string}   movieName - 표시할 영화 제목
 * @param {Function} [onClick] - 제공 시 기본 라우팅을 override
 */
const MovieCard = ({ image, movieId, movieName, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(movieId);
    } else {
      navigate(`/movie/${movieId}`);
    }
  };

  const imageUrl = image
    ? `${IMAGE_BASE_URL}${IMAGE_SIZE.w500}${image}`
    : FALLBACK_IMAGE;

  return (
    <Card
      hoverable
      onClick={handleClick}
      cover={
        <img
          alt={movieName}
          src={imageUrl}
          style={{ height: 300, objectFit: 'cover' }}
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
        />
      }
    >
      <Meta title={movieName} />
    </Card>
  );
};

export default MovieCard;
