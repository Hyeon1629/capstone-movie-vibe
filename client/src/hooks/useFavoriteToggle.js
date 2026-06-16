import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api';

/**
 * 즐겨찾기 토글 로직을 캡슐화한다.
 * DetailPage(Favorite.jsx)와 FavoritePage에서 동일하게 재사용한다.
 *
 * @param {{ movieId: number, movieTitle: string, moviePoster: string }} movieInfo
 * @returns {{ isFavorited: boolean, toggle: Function, loading: boolean }}
 */
const useFavoriteToggle = (movieInfo) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const userId = useSelector((state) => state.user.userData?._id);

  useEffect(() => {
    if (!userId || !movieInfo?.movieId) return;
    api.get('/favorite/list').then((res) => {
      if (res.data.success) {
        setIsFavorited(res.data.data.some((f) => f.movieId === movieInfo.movieId));
      }
    });
  }, [userId, movieInfo?.movieId]);

  const toggle = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      if (isFavorited) {
        await api.delete('/favorite/remove', { data: { movieId: movieInfo.movieId } });
        setIsFavorited(false);
      } else {
        await api.post('/favorite/add', movieInfo);
        setIsFavorited(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return { isFavorited, toggle, loading };
};

export default useFavoriteToggle;
