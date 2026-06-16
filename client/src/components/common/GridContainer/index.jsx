import React from 'react';
import { Row, Col } from 'antd';

const GUTTER = [16, 16];

/**
 * 영화 카드 목록을 반응형 그리드로 배치하는 레이아웃 래퍼.
 * children은 각 그리드 셀에 들어갈 컴포넌트(주로 MovieCard)로 구성된다.
 */
const GridContainer = ({ children }) => (
  <Row gutter={GUTTER}>
    {React.Children.map(children, (child, i) => (
      <Col key={i} xs={12} sm={8} md={6} lg={4}>
        {child}
      </Col>
    ))}
  </Row>
);

export default GridContainer;
