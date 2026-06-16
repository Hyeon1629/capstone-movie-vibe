import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../../_actions/user_actions';

const RegisterPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      return message.error('비밀번호가 일치하지 않습니다.');
    }
    try {
      const data = await dispatch(registerUser({
        email:    values.email,
        password: values.password,
        name:     values.name,
      }));
      if (data.success) {
        message.success('회원가입이 완료되었습니다.');
        navigate('/login');
      } else {
        message.error(data.message || '회원가입에 실패했습니다.');
      }
    } catch {
      message.error('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
      <Card title="회원가입" style={{ width: 400 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="name" label="이름" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="이메일" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="비밀번호" rules={[{ required: true, min: 5 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="confirmPassword" label="비밀번호 확인" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              회원가입
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
