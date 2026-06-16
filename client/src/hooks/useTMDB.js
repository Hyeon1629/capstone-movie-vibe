import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * TMDB API 호출을 추상화한다.
 *
 * paginated: true  → getUrl(page) 형태, data는 results 배열, fetchMore로 페이지 추가
 * paginated: false → getUrl() 형태, data는 API 응답 원본 객체 (detail, credits 등)
 *
 * @param {(page?: number) => string} getUrl - URL 반환 함수. 참조 안정성을 위해 useCallback으로 감싸야 한다.
 * @param {{ paginated?: boolean }} options
 * @returns {{ data: any, loading: boolean, error: Error|null, fetchMore: Function }}
 */
const useTMDB = (getUrl, options = {}) => {
  const { paginated = false } = options;

  const [data,    setData]    = useState(paginated ? [] : null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [page,    setPage]    = useState(1);

  const load = useCallback(async (pageToLoad, replace) => {
    if (!getUrl) return;
    setLoading(true);
    try {
      const { data: res } = await axios.get(getUrl(pageToLoad));
      if (paginated) {
        setData((prev) => (replace ? res.results : [...prev, ...res.results]));
      } else {
        setData(res);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [getUrl, paginated]);

  useEffect(() => {
    setPage(1);
    load(1, true);
  }, [load]);

  const fetchMore = useCallback(() => {
    if (!paginated) return;
    setPage((prev) => {
      const next = prev + 1;
      load(next, false);
      return next;
    });
  }, [paginated, load]);

  return { data, loading, error, fetchMore };
};

export default useTMDB;
