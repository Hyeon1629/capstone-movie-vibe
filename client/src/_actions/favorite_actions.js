import api from '../utils/api';
import { ADD_FAVORITE, REMOVE_FAVORITE, GET_FAVORITES } from './types';

export const addFavorite = (movieInfo) => async (dispatch) => {
  const response = await api.post('/favorite/add', movieInfo);
  dispatch({ type: ADD_FAVORITE, payload: response.data });
  return response.data;
};

export const removeFavorite = (movieId) => async (dispatch) => {
  const response = await api.delete('/favorite/remove', { data: { movieId } });
  dispatch({ type: REMOVE_FAVORITE, payload: movieId });
  return response.data;
};

export const getFavorites = () => async (dispatch) => {
  const response = await api.get('/favorite/list');
  dispatch({ type: GET_FAVORITES, payload: response.data.data });
  return response.data;
};
