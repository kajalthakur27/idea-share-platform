import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAllIdeas, deleteIdea, getMyIdeas } from '../utils/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import IdeaCard from '../components/IdeaCard';
import './Dashboard.css';

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' ya 'my'
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Ideas load karo
  const loadIdeas = async () => {
    setLoading(true);
    try {
      const data = filter === 'my' ? await getMyIdeas() : await getAllIdeas();
      setIdeas(data);
    } catch (error) {
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  // Component load hote hi ideas fetch karo
  useEffect(() => {
    loadIdeas();
  }, [filter]);

  // Idea delete karne ke liye
  const handleDelete = async (ideaId) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await deleteIdea(ideaId);
        toast.success('Idea deleted successfully');
        loadIdeas(); // Ideas refresh karo
      } catch (error) {
        toast.error('Failed to delete idea');
      }
    }
  };

  // Idea edit karne ke liye
  const handleEdit = (ideaId) => {
    navigate(`/edit-idea/${ideaId}`);
  };

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        {/* Left Sidebar */}
        <div className="sidebar">
          <h3>Menu</h3>
          <ul className="sidebar-menu">
            <li 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
               All Ideas
            </li>
            <li 
              className={filter === 'my' ? 'active' : ''}
              onClick={() => setFilter('my')}
            >
               My Ideas
            </li>
            <li onClick={() => navigate('/add-idea')}>
               Add New Idea
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="content-header">
            <h1>{filter === 'my' ? 'My Ideas' : 'All Ideas'}</h1>
            <p>Share your innovative ideas with the world</p>
          </div>

          {loading ? (
            <div className="loader">Loading ideas...</div>
          ) : ideas.length === 0 ? (
            <div className="empty-state">
              <h2>No ideas yet</h2>
              <p>Be the first one to add an idea!</p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/add-idea')}
              >
                Add Your First Idea
              </button>
            </div>
          ) : (
            <div className="ideas-grid">
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea._id}
                  idea={idea}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  currentUserId={user?._id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-card">
            <h3> Trending</h3>
            <p>Top ideas coming soon...</p>
          </div>
          
          <div className="sidebar-card">
            <h3>Top Contributors</h3>
            <p>Leaderboard coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
