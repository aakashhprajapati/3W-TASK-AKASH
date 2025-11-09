const express = require('express');
const {
  createPost,
  getAllPosts,
  getPost,
  likePost,
  addComment,
  deletePost
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const { upload, handleUploadErrors } = require('../middleware/upload');

const router = express.Router();

router.post('/', auth, upload.single('image'), handleUploadErrors, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPost);
router.patch('/:id/like', auth, likePost);
router.post('/:id/comment', auth, addComment);
router.delete('/:id', auth, deletePost);

module.exports = router;