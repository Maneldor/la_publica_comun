import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { PostController } from '../modules/posts/controllers/posts.controller';

const router = Router();
const postController = new PostController();

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// Rutas de posts
router.post('/', postController.createPost);
router.get('/feed', postController.getFeed);
router.get('/user/:userId?', postController.getUserPosts);
router.get('/:postId', postController.getPost);
router.put('/:postId', postController.updatePost);
router.delete('/:postId', postController.deletePost);

// Rutas de interacciones
router.post('/:postId/like', postController.toggleLike);
router.post('/:postId/view', postController.incrementViews);

// Rutas de comentarios
router.post('/:postId/comments', postController.createComment);
router.get('/:postId/comments', postController.getComments);

export default router;