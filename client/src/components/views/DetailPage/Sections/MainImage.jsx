import React from 'react';
import { IMAGE_BASE_URL, IMAGE_SIZE } from '../../../../utils/tmdbConfig';

const OVERLAY_STYLE = {
  position:   'absolute',
  inset:      0,
  background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 60%)',
  display:    'flex',
  alignItems: 'flex-end',
  padding:    40,
};

/**
 * 영화 배경 이미지와 제목/태그라인을 표시한다.
 * @param {string} image   - TMDB backdrop_path
 * @param {string} title   - 영화 제목
 * @param {string} text    - 태그라인
 */
const MainImage = ({ image, title, text }) => (
  <div
    style={{
      position:           'relative',
      height:             480,
      backgroundImage:    image ? `url(${IMAGE_BASE_URL}${IMAGE_SIZE.original}${image})` : 'none',
      backgroundColor:    '#1a1a2e',
      backgroundSize:     'cover',
      backgroundPosition: 'center',
    }}
  >
    <div style={OVERLAY_STYLE}>
      <div>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 32 }}>{title}</h1>
        {text && <p style={{ color: '#ccc', margin: '8px 0 0' }}>{text}</p>}
      </div>
    </div>
  </div>
);

export default MainImage;
