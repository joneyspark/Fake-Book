import express from 'express';
import { createNewPost, getPost, getPosts, getPostsBySearch, updatePost, deletePost, likePost, CommentPost } from '../controllers/postController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPosts)
router.get('/:id', getPost)
router.post('/search', getPostsBySearch)
router.post('/', auth, createNewPost)
router.patch('/:id', auth, updatePost)
router.delete('/:id', auth, deletePost)

router.patch('/:id/likePost', auth, likePost)
router.post('/:id/CommentPost', auth, CommentPost)
export default router;