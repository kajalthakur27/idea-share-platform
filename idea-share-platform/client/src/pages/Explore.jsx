import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAllIdeas, deleteIdea } from '../utils/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import IdeaCard from '../components/IdeaCard';
import './Explore.css';

const Explore = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const categories = [
    'all',
    'Technology',
    'Education',
    'Business',
    'Health',
    'Entertainment',
    'Science',
    'Art',
    'Sports',
    'General'
  ];

  // Load all ideas
  const loadIdeas = async () => {
    setLoading(true);
    try {
      const data = await getAllIdeas();
      setIdeas(data);
    } catch (error) {
      toast.error('Failed to load ideas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  // Filter ideas based on category and search
  const filteredIdeas = ideas.filter((idea) => {
    const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
    const matchesSearch = 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Delete idea handler
  const handleDelete = async (ideaId) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await deleteIdea(ideaId);
        toast.success('Idea deleted successfully');
        loadIdeas();
      } catch (error) {
        toast.error('Failed to delete idea');
      }
    }
  };

  // Edit idea handler
  const handleEdit = (ideaId) => {
    navigate(`/edit-idea/${ideaId}`);
  };

  return (
    <div className="explore-page">
      <Navbar />
      
      <div className="explore-container">
        {/* Header Section */}
        <div className="explore-header">
          <h1>Explore Ideas</h1>
          <p>Discover innovative ideas from the community</p>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search ideas, titles, or creators..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <h3>Categories</h3>
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="explore-content">
          {loading ? (
            <div className="loader">Loading ideas...</div>
          ) : filteredIdeas.length === 0 ? (
            <div className="empty-state">
              <h2>No ideas found</h2>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="results-info">
              <p>Found {filteredIdeas.length} idea{filteredIdeas.length !== 1 ? 's' : ''}</p>
              
              <div className="ideas-grid">
                {filteredIdeas.map((idea) => (
                  <IdeaCard
                    key={idea._id}
                    idea={idea}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    currentUserId={user?._id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
