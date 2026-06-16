import React from 'react';
import { Button } from 'antd';

/**
 * 페이지네이션 "더 보기" 버튼.
 * @param {Function} onClick  - 클릭 핸들러 (fetchMore 등)
 * @param {boolean}  loading  - 로딩 중 여부
 */
const LoadMoreBtn = ({ onClick, loading }) => (
  <div style={{ textAlign: 'center', margin: '32px 0' }}>
    <Button type="primary" size="large" onClick={onClick} loading={loading}>
      더 보기
    </Button>
  </div>
);

export default LoadMoreBtn;
