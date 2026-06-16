import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import NavBar      from './components/views/NavBar';
import LandingPage  from './components/views/LandingPage';
import LoginPage    from './components/views/LoginPage';
import RegisterPage from './components/views/RegisterPage';
import DetailPage   from './components/views/DetailPage';
import FavoritePage from './components/views/FavoritePage';
import Auth from './hoc/auth';

// Auth HOC 래핑
// option: null = 공개, true = 로그인 필수, false = 비로그인 전용
const LandingPageAuth  = Auth(LandingPage,  null);
const LoginPageAuth    = Auth(LoginPage,    false);
const RegisterPageAuth = Auth(RegisterPage, false);
const DetailPageAuth   = Auth(DetailPage,   null);
const FavoritePageAuth = Auth(FavoritePage, true);

const { Header, Content } = Layout;

const App = () => (
  <BrowserRouter>
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: '0 24px', background: '#fff' }}>
        <NavBar />
      </Header>
      <Content style={{ maxWidth: 1200, margin: '24px auto', width: '100%', padding: '0 16px' }}>
        <Routes>
          <Route path="/"              element={<LandingPageAuth />} />
          <Route path="/login"         element={<LoginPageAuth />} />
          <Route path="/register"      element={<RegisterPageAuth />} />
          <Route path="/movie/:movieId" element={<DetailPageAuth />} />
          <Route path="/favorite"      element={<FavoritePageAuth />} />
        </Routes>
      </Content>
    </Layout>
  </BrowserRouter>
);

export default App;
