import express from 'express';
import { signupUser, loginUser } from '../controller/user-controller.js';
import { uploadImage, getImage } from '../controller/image-controller.js';
import { createPost, getAllPosts, getPost, updatePost, deletePost } from '../controller/post-controller.js';
import { authenticateToken } from '../controller/jwt-controller.js';
import { getComments, newComment, deleteComment } from '../controller/comment-controller.js';

import upload from '../utils/upload.js';

const router = express.Router();

// Error handling middleware
router.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Something went wrong!');
});

// Routes
router.post('/signup', signupUser);
router.post('/login', loginUser);

// File upload routes
router.post('/file/upload', upload.single('file'), uploadImage);
router.get('/file/:filename', getImage);

// Protected route (requires authentication token)
router.post('/create', authenticateToken, createPost);
router.get('/posts', authenticateToken, getAllPosts);
router.get('/post/:id', authenticateToken, getPost);
router.put('/update/:id', authenticateToken, updatePost);
router.delete('/delete/:id', authenticateToken, deletePost);
router.post('/comment/new', authenticateToken, newComment);
router.get('/comments/:id', authenticateToken, getComments);
router.delete('/comment/delete/:id', authenticateToken, deleteComment);

export default router;