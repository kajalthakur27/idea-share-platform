import { useState } from 'react';
import { likeIdea, unlikeIdea } from '../utils/api';
import { toast } from 'react-toastify';
import CommentSection from './CommentSection';
import './IdeaCard.css';

const IdeaCard = ({ idea, onDelete, onEdit, currentUserId }) => {
  const [likes, setLikes] = useState(idea.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Check karo ki ye idea current user ka hai ya nahi
  const isOwner = currentUserId === idea.user;

  // Like/Unlike handler
  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeIdea(idea._id);
        setLikes(likes - 1);
        setIsLiked(false);
        toast.success('Unliked!');
      } else {
        await likeIdea(idea._id);
        setLikes(likes + 1);
        setIsLiked(true);
        toast.success('Liked!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="idea-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="user-info">
          <div className="user-avatar">
            {idea.userName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4>{idea.userName}</h4>
            <p className="post-time">{new Date(idea.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Edit/Delete buttons (sirf owner ke liye) */}
        {isOwner && (
          <div className="card-actions">
            <button
              className="btn-icon btn-edit"
              onClick={() => onEdit(idea._id)}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="btn-icon btn-delete"
              onClick={() => onDelete(idea._id)}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3>{idea.title}</h3>
        <p className="description">{idea.description}</p>

        {/* Tags */}
        {idea.tags && idea.tags.length > 0 && (
          <div className="tags">
            {idea.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Category */}
        <div className="category-badge">{idea.category}</div>
      </div>

      {/* Card Footer - Like & Comment buttons */}
      <div className="card-footer">
        <button
          className={`btn-action ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {isLiked ? '❤️' : '🤍'} {likes}
        </button>

        <button
          className="btn-action"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {idea.commentsCount || 0}
        </button>
      </div>

      {/* Comment Section */}
      {showComments && <CommentSection ideaId={idea._id} />}
    </div>
  );
};

export default IdeaCard;
