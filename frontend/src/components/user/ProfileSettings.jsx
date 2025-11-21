import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userAPI } from '../../services/userAPI';
import { loadUser } from '../../store/slices/authSlice';

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    website: '',
    socialMedia: {
      twitter: '',
      instagram: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        socialMedia: {
          twitter: user.socialMedia?.twitter || '',
          instagram: user.socialMedia?.instagram || ''
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialMedia.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await userAPI.updateUserProfile(formData);
      setMessage('Profile updated successfully!');
      
      // Reload user data to update the store
      dispatch(loadUser());
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      await userAPI.uploadAvatar(formData);
      setMessage('Avatar updated successfully!');
      
      // Reload user data
      dispatch(loadUser());
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        {/* Avatar Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Profile Picture
          </label>
          
          <div className="flex items-center space-x-6">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="btn-secondary cursor-pointer"
              >
                Change Avatar
              </label>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG up to 2MB
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="input-field"
              required
              minLength="3"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
              className="input-field"
              placeholder="Tell us about yourself..."
              maxLength="500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Where are you from?"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="input-field"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Username
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  @
                </span>
                <input
                  type="text"
                  id="twitter"
                  name="socialMedia.twitter"
                  value={formData.socialMedia.twitter}
                  onChange={handleInputChange}
                  className="input-field rounded-l-none"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Username
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  @
                </span>
                <input
                  type="text"
                  id="instagram"
                  name="socialMedia.instagram"
                  value={formData.socialMedia.instagram}
                  onChange={handleInputChange}
                  className="input-field rounded-l-none"
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;