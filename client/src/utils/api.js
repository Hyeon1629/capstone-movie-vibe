import axios from 'axios';
import { LOGOUT_USER } from '../_actions/types';

/**
 * 백엔드 전용 Axios 인스턴스.
 * - baseURL '/api' 고정으로 TMDB 호출과 분리한다.
 * - withCredentials: true 로 x_auth 쿠키를 자동 전송한다.
 * - 401 응답 시 store.dispatch를 통해 클라이언트 상태를 즉시 초기화한다.
 *   store를 lazy require 하는 이유: api → store → reducers → api 순환 참조 방지.
 */
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // lazy require로 순환 의존성 차단
      const store = require('../store').default;
      store.dispatch({ type: LOGOUT_USER });
      
      // 401은 "비로그인 상태"라는 정상 신호이므로 에러로 전파하지 않음
      // 컴포넌트에는 isAuth: false 형태로 응답한 것처럼 처리
      return Promise.resolve({ 
        data: { isAuth: false, error: true } 
      });
    }
    return Promise.reject(error);
  }
);

export default api;
