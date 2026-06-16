import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Spin, Typography } from 'antd';
import useTMDB from '../../../hooks/useTMDB';
import { getDetailURL, getCreditsURL, getSimilarURL } from '../../../utils/tmdbConfig';
import MainImage    from './Sections/MainImage';
import MovieInfo    from './Sections/MovieInfo';
import GridCards    from './Sections/GridCards';
import Favorite     from './Sections/Favorite';
import LikeDislikes from './Sections/LikeDislikes';
import CommentSection from './Sections/CommentSection';

const { Title } = Typography;

const DetailPage = () => {
  const { movieId } = useParams();
  const id = Number(movieId);

  // useTMDB의 paginated:false → data는 API 응답 원본
  const getDetailUrl  = useCallback(() => getDetailURL(id),  [id]);
  const getCreditsUrl = useCallback(() => getCreditsURL(id), [id]);
  const getSimilarUrl = useCallback(() => getSimilarURL(id), [id]);

  const { data: movie,   loading } = useTMDB(getDetailUrl);
  const { data: credits }          = useTMDB(getCreditsUrl);
  const { data: similar }          = useTMDB(getSimilarUrl);

  if (loading || !movie) {
    return <Spin size="large" style={{ display: 'block', margin: '120px auto' }} />;
  }

  const movieInfo = {
    movieId:    id,
    movieTitle: movie.title,
    moviePoster: movie.poster_path,
  };

  const cast = credits?.cast?.slice(0, 12).map((c) => ({
    id:           c.id,
    title:        c.name,
    poster_path:  c.profile_path,
  })) || [];

  const similarMovies = similar?.results?.slice(0, 12) || [];

  return (
    <div>
      <MainImage image={movie.backdrop_path} title={movie.title} text={movie.tagline} />

      <div style={{ padding: '0 32px' }}>
        <MovieInfo movie={movie} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Favorite     movieInfo={movieInfo} />
          <LikeDislikes movieId={id} />
        </div>

        {cast.length > 0 && (
          <>
            <Divider />
            <Title level={4}>출연진</Title>
            {/* GridCards가 MovieCard를 재사용 — onClick override로 인물 ID 클릭 시 라우팅 없음 */}
            <GridCards movies={cast} onCardClick={() => {}} />
          </>
        )}

        {similarMovies.length > 0 && (
          <>
            <Divider />
            <Title level={4}>유사 영화</Title>
            {/* GridCards + MovieCard 재사용 — 클릭 시 /movie/:id 기본 라우팅 */}
            <GridCards movies={similarMovies} />
          </>
        )}

        <Divider />
        <CommentSection movieId={id} />
      </div>
    </div>
  );
};

export default DetailPage;
