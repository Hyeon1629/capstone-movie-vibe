import React, { useState, useCallback } from 'react';
import { Input } from 'antd';
import useTMDB from '../../../hooks/useTMDB';
import useDebounce from '../../../hooks/useDebounce';
import MovieCard from '../../common/MovieCard';
import GridContainer from '../../common/GridContainer';
import LoadMoreBtn from '../../common/LoadMoreBtn';
import { getPopularURL, getSearchURL } from '../../../utils/tmdbConfig';

const { Search } = Input;

const LandingPage = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery    = useDebounce(query); // 300ms 지연 → 불필요한 TMDB 호출 방지

  // debouncedQuery가 바뀔 때만 getUrl 참조가 교체 → useTMDB가 재요청
  const getUrl = useCallback(
    (page) =>
      debouncedQuery
        ? getSearchURL(debouncedQuery, page)
        : getPopularURL(page),
    [debouncedQuery]
  );

  const { data: movies, loading, fetchMore } = useTMDB(getUrl, { paginated: true });

  return (
    <div style={{ padding: '0 24px' }}>
      <Search
        placeholder="영화 제목을 검색하세요..."
        onChange={(e) => setQuery(e.target.value)}
        style={{ maxWidth: 420, marginBottom: 24 }}
        size="large"
        allowClear
      />

      <GridContainer>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movieId={movie.id}
            movieName={movie.title}
            image={movie.poster_path}
          />
        ))}
      </GridContainer>

      <LoadMoreBtn onClick={fetchMore} loading={loading} />
    </div>
  );
};

export default LandingPage;
