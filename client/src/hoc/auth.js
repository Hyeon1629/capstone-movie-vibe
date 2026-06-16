import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../_actions/user_actions';

/**
 * 인증 가드 HOC.
 *
 * @param {React.Component} SpecificComponent - 래핑할 컴포넌트
 * @param {null|true|false} option
 *   - null  : 인증 여부 무관 (Landing, Detail 등 공개 페이지)
 *   - true  : 로그인 필수 → 미인증 시 /login 리다이렉트
 *   - false : 비로그인 전용 → 인증된 경우 / 리다이렉트 (Login, Register)
 * @param {boolean} adminRoute - true면 관리자(role=1)만 접근 가능
 */
function AuthHoc(SpecificComponent, option, adminRoute = false) {
  return function AuthCheck(props) {
    const dispatch  = useDispatch();
    const navigate  = useNavigate();
    const isAuth    = useSelector((state) => state.user.isAuth);
    const isAdmin   = useSelector((state) => state.user.isAdmin);

    useEffect(() => {
      dispatch(auth()).then((data) => {
        const authenticated = data?.success === true;

        if (!authenticated) {
          if (option === true) navigate('/login');
        } else {
          if (adminRoute && !isAdmin) navigate('/');
          else if (option === false) navigate('/');
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <SpecificComponent {...props} />;
  };
}

export default AuthHoc;
