import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Avatar
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Comment as CommentIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function PostCard({ post, onUpdate }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const isLiked = post.likes.includes(user?.id);

  const handleLike = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/posts/${post._id}/like`);
      onUpdate();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`http://localhost:5000/api/posts/${post._id}/comment`, {
        text: newComment
      });
      setNewComment('');
      onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ mr: 2 }}>
            {post.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h6">{post.username}</Typography>
        </Box>

        {post.text && (
          <Typography variant="body1" paragraph>
            {post.text}
          </Typography>
        )}

        {post.image && (
          <CardMedia
            component="img"
            height="300"
            image={`http://localhost:5000/uploads/${post.image}`}
            alt="Post image"
            sx={{ mb: 2 }}
          />
        )}

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <IconButton onClick={handleLike}>
              {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {post.likes.length} likes
            </Typography>

            <IconButton onClick={() => setShowComments(!showComments)}>
              <CommentIcon />
            </IconButton>
            <Typography variant="body2">
              {post.comments.length} comments
            </Typography>
          </Box>
        </Box>

        {showComments && (
          <Box mt={2}>
            <Box display="flex" mb={2}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mr: 1 }}
              />
              <Button variant="contained" onClick={handleComment}>
                Post
              </Button>
            </Box>

            {post.comments.map((comment, index) => (
              <Box key={index} mb={1} p={1} bgcolor="grey.100" borderRadius={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {comment.username}
                </Typography>
                <Typography variant="body2">
                  {comment.text}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default PostCard;