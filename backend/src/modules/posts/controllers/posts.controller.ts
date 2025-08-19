import { Request, Response } from 'express';
import { PostService } from '../services/posts.service';
import { AuthenticatedRequest } from '../../../middleware/auth';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  // Crear un nuevo post
  createPost = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }

      const postData = {
        ...req.body,
        userId
      };

      const post = await this.postService.createPost(postData);
      res.status(201).json({
        success: true,
        data: post,
        message: 'Post creado exitosamente'
      });
    } catch (error) {
      console.error('Error creando post:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  // Obtener feed de posts
  getFeed = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }

      const { page = 1, limit = 10, type } = req.query;
      
      const posts = await this.postService.getFeed({
        userId,
        page: Number(page),
        limit: Number(limit),
        type: type as string
      });

      res.json({
        success: true,
        data: posts
      });
    } catch (error) {
      console.error('Error obteniendo feed:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  // Obtener posts del usuario
  getUserPosts = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const requesterId = req.user?.id;

      if (!requesterId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }

      const { page = 1, limit = 10 } = req.query;

      const posts = await this.postService.getUserPosts({
        userId: userId || requesterId,
        requesterId,
        page: Number(page),
        limit: Number(limit)
      });

      res.json({
        success: true,
        data: posts
      });
    } catch (error) {
      console.error('Error obteniendo posts del usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  // Obtener un post específico
  getPost = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { postId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }

      const post = await this.postService.getPostById(postId, userId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post no encontrado'
        });
      }

      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Error obteniendo post:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  // Actualizar un post
  updatePost = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { postId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }

      const post = await this.postService.updatePost(postId, req.body, userId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post no encontrado o sin permisos'
        });
      }

      res.json({
        success: true,
        data: post,
        message: 'Post actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error actualizando post:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  // Eliminar un post
  deletePost = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { postId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }

      const success = await this.postService.deletePost(postId, userId);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Post no encontrado o sin permisos'
        });
      }

      res.json({
        success: true,
        message: 'Post eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando post:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  // Like/Unlike post
  toggleLike = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { postId } = req.params;
      const { emoji = '👍' } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }

      const result = await this.postService.toggleLike(postId, userId, emoji);

      res.json({
        success: true,
        data: result,
        message: result.liked ? 'Like agregado' : 'Like eliminado'
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  // Crear comentario
  createComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { postId } = req.params;
      const { content, parentId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }

      if (!content?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El contenido del comentario es obligatorio'
        });
      }

      const comment = await this.postService.createComment({
        postId,
        userId,
        content: content.trim(),
        parentId: parentId || undefined
      });

      res.status(201).json({
        success: true,
        data: comment,
        message: 'Comentario creado exitosamente'
      });
    } catch (error) {
      console.error('Error creando comentario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  // Obtener comentarios de un post
  getComments = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { postId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }

      const comments = await this.postService.getComments({
        postId,
        page: Number(page),
        limit: Number(limit)
      });

      res.json({
        success: true,
        data: comments
      });
    } catch (error) {
      console.error('Error obteniendo comentarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  // Incrementar vistas
  incrementViews = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { postId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }

      await this.postService.incrementViews(postId, userId);

      res.json({
        success: true,
        message: 'Vista registrada'
      });
    } catch (error) {
      console.error('Error incrementando vistas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
}