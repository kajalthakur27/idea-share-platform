import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createIdea, updateIdea, getIdeaById } from '../utils/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import './AddEditIdea.css';

const AddEditIdea = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    category: 'General',
  });
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // URL se idea ID milegi (edit mode ke liye)

  // Agar edit mode hai to idea ka data load karo
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      loadIdea();
    }
  }, [id]);

  const loadIdea = async () => {
    try {
      const data = await getIdeaById(id);
      setFormData({
        title: data.title,
        description: data.description,
        tags: data.tags.join(', '), // Array ko comma separated string me convert karo
        category: data.category,
      });
    } catch (error) {
      toast.error('Failed to load idea');
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      // Tags ko array me convert karo (comma se split karke)
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

      const ideaData = {
        title: formData.title,
        description: formData.description,
        tags: tagsArray,
        category: formData.category,
      };

      // Edit mode ya create mode
      if (isEditMode) {
        await updateIdea(id, ideaData);
        toast.success('Idea updated successfully!');
      } else {
        await createIdea(ideaData);
        toast.success('Idea created successfully!');
      }

      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-edit-idea">
      <Navbar />
      
      <div className="form-container">
        <div className="form-card">
          <h1>{isEditMode ? 'Edit Your Idea' : 'Add New Idea'}</h1>
          <p className="form-subtitle">
            {isEditMode ? 'Update your idea details' : 'Share your innovative idea with the community'}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Idea Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Enter your idea title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                placeholder="Describe your idea in detail..."
                value={formData.description}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
                name="tags"
                placeholder="e.g., AI, Education, Technology (comma separated)"
                value={formData.tags}
                onChange={handleChange}
              />
              <small>Separate tags with commas</small>
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="General">General</option>
                <option value="Technology">Technology</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Business">Business</option>
                <option value="Environment">Environment</option>
                <option value="Social">Social</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Idea' : 'Create Idea'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditIdea;
