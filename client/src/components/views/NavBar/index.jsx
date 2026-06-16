import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../_actions/user_actions';

const NavBar = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const isAuth    = useSelector((state) => state.user.isAuth);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => navigate('/login'));
  };

  const items = isAuth
    ? [
        { key: 'home',      label: <Link to="/">홈</Link> },
        { key: 'favorite',  label: <Link to="/favorite">즐겨찾기</Link> },
        { key: 'logout',    label: <span onClick={handleLogout}>로그아웃</span> },
      ]
    : [
        { key: 'home',      label: <Link to="/">홈</Link> },
        { key: 'login',     label: <Link to="/login">로그인</Link> },
        { key: 'register',  label: <Link to="/register">회원가입</Link> },
      ];

  return <Menu mode="horizontal" items={items} style={{ marginBottom: 16 }} />;
};

export default NavBar;
