import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import PostCard from '../components/PostCard';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    text: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setFetching(true);
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setFetching(false);
    }
  };

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
      setShowCreatePost(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }

    setLoading(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewPost({
        ...newPost,
        image: e.target.files[0]
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Social Feed
        </Typography>

        <Box display="flex" justifyContent="center" mb={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreatePost(!showCreatePost)}
            sx={{ mb: 2 }}
          >
            Create Post
          </Button>
        </Box>

        {showCreatePost && (
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Create New Post
            </Typography>
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
              
              <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{ marginBottom: '16px' }}
              />

              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || (!newPost.text && !newPost.image)}
                  sx={{ mr: 1 }}
                >
                  {loading ? 'Posting...' : 'Post'}
                </Button>
                <Button onClick={() => setShowCreatePost(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Paper>
        )}

        {fetching ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {posts.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  No posts yet. Be the first to create a post!
                </Typography>
              </Paper>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onUpdate={fetchPosts}
                />
              ))
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default Feed;