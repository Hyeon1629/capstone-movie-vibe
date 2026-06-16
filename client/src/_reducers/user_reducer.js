import { LOGIN_USER, REGISTER_USER, AUTH_USER, LOGOUT_USER } from '../_actions/types';

const initialState = {
  userData: {},
  isAuth:   false,
  isAdmin:  false,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
    case REGISTER_USER:
      return { ...state, ...action.payload };

    case AUTH_USER:
      return {
        ...state,
        userData: action.payload.data  || {},
        isAuth:   action.payload.success === true,
        isAdmin:  action.payload.data?.role === 1,
      };

    case LOGOUT_USER:
      return { ...initialState };

    default:
      return state;
  }
}
