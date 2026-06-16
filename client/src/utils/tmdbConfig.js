/**
 * TMDB API 관련 상수 및 URL 헬퍼.
 * 엔드포인트 문자열을 컴포넌트에 직접 작성하지 않고 여기서 중앙 관리한다.
 * API_KEY는 반드시 .env.local에 REACT_APP_TMDB_API_KEY로 설정한다.
 */

export const API_KEY       = process.env.REACT_APP_TMDB_API_KEY || '';
export const API_URL       = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const IMAGE_SIZE = {
  original: 'original',
  w500:     'w500',
};

export const getPopularURL  = (page = 1) =>
  `${API_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=${page}`;

export const getSearchURL   = (query, page = 1) =>
  `${API_URL}/search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}&page=${page}`;

export const getDetailURL   = (id) =>
  `${API_URL}/movie/${id}?api_key=${API_KEY}&language=ko-KR`;

export const getCreditsURL  = (id) =>
  `${API_URL}/movie/${id}/credits?api_key=${API_KEY}&language=ko-KR`;

export const getSimilarURL  = (id) =>
  `${API_URL}/movie/${id}/similar?api_key=${API_KEY}&language=ko-KR`;
