import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../../_actions/user_actions';

const LoginPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const onFinish = async (values) => {
    try {
      const data = await dispatch(loginUser(values));
      if (data.success) {
        navigate('/');
      } else {
        message.error(data.message || '로그인에 실패했습니다.');
      }
    } catch {
      message.error('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
      <Card title="로그인" style={{ width: 400 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="email" label="이메일" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="비밀번호" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              로그인
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          계정이 없으신가요? <Link to="/register">회원가입</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
