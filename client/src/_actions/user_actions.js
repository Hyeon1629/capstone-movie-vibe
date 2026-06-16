import api from '../utils/api';
import { LOGIN_USER, REGISTER_USER, AUTH_USER, LOGOUT_USER } from './types';

export const loginUser = (dataToSubmit) => async (dispatch) => {
  const response = await api.post('/users/login', dataToSubmit);
  dispatch({ type: LOGIN_USER, payload: response.data });
  return response.data;
};

export const registerUser = (dataToSubmit) => async (dispatch) => {
  const response = await api.post('/users/register', dataToSubmit);
  dispatch({ type: REGISTER_USER, payload: response.data });
  return response.data;
};

export const auth = () => async (dispatch) => {
  const response = await api.get('/users/auth');
  dispatch({ type: AUTH_USER, payload: response.data });
  return response.data;
};

export const logoutUser = () => async (dispatch) => {
  await api.get('/users/logout');
  dispatch({ type: LOGOUT_USER });
};
