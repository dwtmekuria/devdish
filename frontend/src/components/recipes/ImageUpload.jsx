import React, { useState } from 'react';
import { uploadAPI } from '../../services/uploadAPI';
import { getImageUrl } from '../../services/api';

const ImageUpload = ({ onImageUpload, currentImage = '', recipeId = null }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await uploadAPI.uploadImage(formData, recipeId);
      
      if (recipeId) {
        // If we have a recipe ID, the image was saved to the recipe
        onImageUpload(recipeId); // Pass recipeId to indicate image is saved
      } else {
        // For new recipes, we'll handle the image in the form submission
        onImageUpload(file); // Pass the file object for form submission
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
      setPreviewUrl(currentImage);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl('');
    onImageUpload(null);
  };

  // Generate image URL for display
  const displayUrl = currentImage && currentImage.startsWith?.('http') 
    ? currentImage 
    : previewUrl;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Recipe Image
      </label>
      
      {/* Image Preview */}
      {displayUrl && (
        <div className="relative">
          <img 
            src={displayUrl} 
            alt="Recipe preview" 
            className="h-48 w-full object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {uploading ? (
          <div className="text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            Uploading...
          </div>
        ) : (
          <>
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex text-sm text-gray-600 justify-center">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                <span>Upload an image</span>
                <input 
                  id="file-upload" 
                  name="file-upload" 
                  type="file" 
                  className="sr-only" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 5MB
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;