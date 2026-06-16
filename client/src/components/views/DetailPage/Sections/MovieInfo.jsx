import React from 'react';
import { Tag, Rate, Typography, Space } from 'antd';

const { Title, Paragraph, Text } = Typography;

/**
 * 영화 장르, 평점, 런타임, 줄거리 등 메타 정보를 렌더링한다.
 * @param {{ genres, vote_average, runtime, release_date, overview }} movie
 */
const MovieInfo = ({ movie }) => {
  if (!movie) return null;

  // TMDB는 10점 만점, Ant Design Rate는 5점 만점
  const rating = (movie.vote_average || 0) / 2;

  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={2}>{movie.title}</Title>

      <Space wrap style={{ marginBottom: 12 }}>
        {movie.genres?.map((g) => (
          <Tag key={g.id} color="blue">{g.name}</Tag>
        ))}
      </Space>

      <div style={{ marginBottom: 12 }}>
        <Rate disabled allowHalf value={rating} />
        <Text type="secondary" style={{ marginLeft: 8 }}>
          {movie.vote_average?.toFixed(1)} / 10
        </Text>
      </div>

      <Space split="|" style={{ marginBottom: 16 }}>
        {movie.runtime && <Text type="secondary">{movie.runtime}분</Text>}
        {movie.release_date && <Text type="secondary">개봉일: {movie.release_date}</Text>}
      </Space>

      <Paragraph>{movie.overview}</Paragraph>
    </div>
  );
};

export default MovieInfo;
