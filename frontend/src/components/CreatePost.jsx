import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, Image as ImageIcon } from '@mui/icons-material';
import axios from 'axios';

function CreatePost({ onPostCreated, onClose }) {
  const [newPost, setNewPost] = useState({
    text: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.text && !newPost.image) return;

    setLoading(true);

    const formData = new FormData();
    if (newPost.text) formData.append('text', newPost.text);
    if (newPost.image) formData.append('image', newPost.image);

    try {
      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setNewPost({ text: '', image: null });
      setImagePreview(null);
      onPostCreated();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    }

    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({
        ...newPost,
        image: file
      });

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewPost({
      ...newPost,
      image: null
    });
    setImagePreview(null);
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Create New Post
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      <Box component="form" onSubmit={handleCreatePost}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={newPost.text}
          onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
          sx={{ mb: 2 }}
        />
        
        {imagePreview && (
          <Box position="relative" mb={2}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '300px', 
                borderRadius: '8px' 
              }} 
            />
            <IconButton
              onClick={removeImage}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            component="label"
            startIcon={<ImageIcon />}
            variant="outlined"
          >
            Add Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>

          <Box>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || (!newPost.text && !newPost.image)}
              sx={{ mr: 1 }}
            >
              {loading ? 'Posting...' : 'Post'}
            </Button>
            {onClose && (
              <Button onClick={onClose}>
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default CreatePost;