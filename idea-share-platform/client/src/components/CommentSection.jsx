import { useState, useEffect, useContext } from 'react';
import { getCommentsForIdea, addComment, deleteComment } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './CommentSection.css';

const CommentSection = ({ ideaId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useContext(AuthContext);

  // Comments load karo
  useEffect(() => {
    loadComments();
  }, [ideaId]);

  const loadComments = async () => {
    try {
      const data = await getCommentsForIdea(ideaId);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments');
    }
  };

  // Naya comment add karo
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await addComment(ideaId, { text: newComment });
      setNewComment('');
      toast.success('Comment added!');
      loadComments(); // Comments refresh karo
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  // Comment delete karo
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await deleteComment(commentId);
        toast.success('Comment deleted');
        loadComments();
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments ({comments.length})</h4>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="comment-form">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? '...' : '➤'}
        </button>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <div className="comment-user">
                  <div className="comment-avatar">
                    {comment.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong>{comment.userName}</strong>
                    <span className="comment-time">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {/* Delete button (sirf apne comment ke liye) */}
                {user?._id === comment.user && (
                  <button
                    className="btn-delete-comment"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    🗑️
                  </button>
                )}
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
