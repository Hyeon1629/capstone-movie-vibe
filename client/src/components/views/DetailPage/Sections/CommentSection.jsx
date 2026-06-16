import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, List, Typography, Space } from 'antd';
import { useSelector } from 'react-redux';
import api from '../../../../utils/api';

const { Title } = Typography;
const MAX_CONTENT = 500;

/**
 * 영화별 댓글 목록 + 입력 폼.
 * - 조회: 비로그인 허용 (getComments는 auth 미들웨어 제외)
 * - 작성/삭제: 로그인 필요, 삭제는 서버단에서 소유권 검증
 *
 * @param {number} movieId
 */
const CommentSection = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [content,  setContent]  = useState('');
  const isAuth  = useSelector((state) => state.user.isAuth);
  const userId  = useSelector((state) => state.user.userData?._id);

  const fetchComments = useCallback(() => {
    api.get(`/comment/list?movieId=${movieId}`).then((res) => {
      if (res.data.success) setComments(res.data.data);
    });
  }, [movieId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    const res = await api.post('/comment/save', { movieId, content });
    if (res.data.success) {
      setContent('');
      fetchComments();
    }
  };

  const handleDelete = async (commentId) => {
    const res = await api.delete('/comment/delete', { data: { commentId } });
    if (res.data.success) fetchComments();
  };

  return (
    <div>
      <Title level={4}>댓글 ({comments.length})</Title>

      {isAuth && (
        <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
          <Input.TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_CONTENT}
            rows={2}
            placeholder={`댓글을 입력하세요 (최대 ${MAX_CONTENT}자)`}
            style={{ resize: 'none' }}
          />
          <Button type="primary" onClick={handleSubmit} style={{ height: '100%' }}>
            등록
          </Button>
        </Space.Compact>
      )}

      <List
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item
            actions={
              comment.userId?._id === userId
                ? [
                    <Button
                      key="delete"
                      size="small"
                      danger
                      onClick={() => handleDelete(comment._id)}
                    >
                      삭제
                    </Button>,
                  ]
                : []
            }
          >
            <List.Item.Meta
              title={comment.userId?.name || '알 수 없음'}
              description={comment.content}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default CommentSection;
