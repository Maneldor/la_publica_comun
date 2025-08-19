import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePostData {
  userId: string;
  content: string;
  images?: string[];
  type: 'texto' | 'imagen' | 'evento' | 'oferta' | 'demanda';
  visibility?: 'publico' | 'amigos' | 'solo-yo';
  offerData?: any;
  eventData?: any;
  demandData?: any;
}

export interface FeedOptions {
  userId: string;
  page: number;
  limit: number;
  type?: string;
}

export interface UserPostsOptions {
  userId: string;
  requesterId: string;
  page: number;
  limit: number;
}

export interface CreateCommentData {
  postId: string;
  userId: string;
  content: string;
  parentId?: string;
}

export interface CommentsOptions {
  postId: string;
  page: number;
  limit: number;
}

export class PostService {
  // Crear un nuevo post
  async createPost(data: CreatePostData) {
    const {
      userId,
      content,
      images = [],
      type = 'texto',
      visibility = 'publico',
      offerData,
      eventData,
      demandData
    } = data;

    try {
      const post = await prisma.post.create({
        data: {
          userId,
          content,
          images: images.length > 0 ? JSON.stringify(images) : null,
          type,
          visibility,
          offerData: offerData ? JSON.stringify(offerData) : null,
          eventData: eventData ? JSON.stringify(eventData) : null,
          demandData: demandData ? JSON.stringify(demandData) : null,
        },
        include: {
          user: {
            include: {
              employee: true,
              company: true
            }
          },
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  employee: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true
                    }
                  },
                  company: {
                    select: {
                      name: true,
                      logo: true
                    }
                  }
                }
              }
            }
          },
          comments: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  employee: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true
                    }
                  },
                  company: {
                    select: {
                      name: true,
                      logo: true
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        }
      });

      return this.formatPost(post);
    } catch (error) {
      console.error('Error creando post:', error);
      throw error;
    }
  }

  // Obtener feed de posts
  async getFeed({ userId, page = 1, limit = 10, type }: FeedOptions) {
    try {
      const skip = (page - 1) * limit;
      
      const where: any = {
        OR: [
          { visibility: 'publico' },
          { userId: userId } // Los posts del propio usuario
        ]
      };

      if (type && type !== 'todos') {
        where.type = type;
      }

      const posts = await prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          user: {
            include: {
              employee: true,
              company: true
            }
          },
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  employee: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true
                    }
                  },
                  company: {
                    select: {
                      name: true,
                      logo: true
                    }
                  }
                }
              }
            }
          },
          comments: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  employee: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true
                    }
                  },
                  company: {
                    select: {
                      name: true,
                      logo: true
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        }
      });

      const total = await prisma.post.count({ where });

      return {
        posts: posts.map(post => this.formatPost(post)),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error obteniendo feed:', error);
      throw error;
    }
  }

  // Obtener posts de un usuario específico
  async getUserPosts({ userId, requesterId, page = 1, limit = 10 }: UserPostsOptions) {
    try {
      const skip = (page - 1) * limit;
      
      const where: any = { userId };

      // Si no es el propio usuario, solo mostrar posts públicos o de amigos
      if (userId !== requesterId) {
        where.visibility = { in: ['publico'] };
      }

      const posts = await prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          user: {
            include: {
              employee: true,
              company: true
            }
          },
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  employee: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true
                    }
                  },
                  company: {
                    select: {
                      name: true,
                      logo: true
                    }
                  }
                }
              }
            }
          },
          comments: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  employee: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true
                    }
                  },
                  company: {
                    select: {
                      name: true,
                      logo: true
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        }
      });

      const total = await prisma.post.count({ where });

      return {
        posts: posts.map(post => this.formatPost(post)),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error obteniendo posts del usuario:', error);
      throw error;
    }
  }

  // Obtener un post por ID
  async getPostById(postId: string, requesterId: string) {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          user: {
            include: {
              employee: true,
              company: true
            }
          },
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  employee: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true
                    }
                  },
                  company: {
                    select: {
                      name: true,
                      logo: true
                    }
                  }
                }
              }
            }
          },
          comments: {
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  employee: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true
                    }
                  },
                  company: {
                    select: {
                      name: true,
                      logo: true
                    }
                  }
                }
              },
              replies: {
                include: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      employee: {
                        select: {
                          firstName: true,
                          lastName: true,
                          avatar: true
                        }
                      },
                      company: {
                        select: {
                          name: true,
                          logo: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        }
      });

      if (!post) {
        return null;
      }

      // Verificar permisos de visibilidad
      if (post.visibility === 'solo-yo' && post.userId !== requesterId) {
        return null;
      }

      return this.formatPost(post);
    } catch (error) {
      console.error('Error obteniendo post:', error);
      throw error;
    }
  }

  // Actualizar un post
  async updatePost(postId: string, data: Partial<CreatePostData>, userId: string) {
    try {
      // Verificar que el usuario sea el propietario
      const existingPost = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!existingPost || existingPost.userId !== userId) {
        return null;
      }

      const updateData: any = {};
      
      if (data.content !== undefined) updateData.content = data.content;
      if (data.images !== undefined) updateData.images = data.images.length > 0 ? JSON.stringify(data.images) : null;
      if (data.visibility !== undefined) updateData.visibility = data.visibility;
      if (data.offerData !== undefined) updateData.offerData = data.offerData ? JSON.stringify(data.offerData) : null;
      if (data.eventData !== undefined) updateData.eventData = data.eventData ? JSON.stringify(data.eventData) : null;
      if (data.demandData !== undefined) updateData.demandData = data.demandData ? JSON.stringify(data.demandData) : null;

      updateData.updatedAt = new Date();

      const post = await prisma.post.update({
        where: { id: postId },
        data: updateData,
        include: {
          user: {
            include: {
              employee: true,
              company: true
            }
          },
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  employee: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true
                    }
                  },
                  company: {
                    select: {
                      name: true,
                      logo: true
                    }
                  }
                }
              }
            }
          },
          comments: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  employee: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true
                    }
                  },
                  company: {
                    select: {
                      name: true,
                      logo: true
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        }
      });

      return this.formatPost(post);
    } catch (error) {
      console.error('Error actualizando post:', error);
      throw error;
    }
  }

  // Eliminar un post
  async deletePost(postId: string, userId: string) {
    try {
      // Verificar que el usuario sea el propietario o admin
      const existingPost = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!existingPost || existingPost.userId !== userId) {
        return false;
      }

      await prisma.post.delete({
        where: { id: postId }
      });

      return true;
    } catch (error) {
      console.error('Error eliminando post:', error);
      throw error;
    }
  }

  // Toggle like en post
  async toggleLike(postId: string, userId: string, emoji: string = '👍') {
    try {
      const existingLike = await prisma.postLike.findUnique({
        where: {
          postId_userId: { postId, userId }
        }
      });

      if (existingLike) {
        // Si ya existe, eliminar like
        await prisma.postLike.delete({
          where: { id: existingLike.id }
        });
        return { liked: false, emoji };
      } else {
        // Si no existe, crear like
        await prisma.postLike.create({
          data: { postId, userId, emoji }
        });
        return { liked: true, emoji };
      }
    } catch (error) {
      console.error('Error toggle like:', error);
      throw error;
    }
  }

  // Crear comentario
  async createComment(data: CreateCommentData) {
    try {
      const comment = await prisma.postComment.create({
        data: {
          postId: data.postId,
          userId: data.userId,
          content: data.content,
          parentId: data.parentId
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              employee: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true
                }
              },
              company: {
                select: {
                  name: true,
                  logo: true
                }
              }
            }
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  employee: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true
                    }
                  },
                  company: {
                    select: {
                      name: true,
                      logo: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      return this.formatComment(comment);
    } catch (error) {
      console.error('Error creando comentario:', error);
      throw error;
    }
  }

  // Obtener comentarios de un post
  async getComments({ postId, page = 1, limit = 20 }: CommentsOptions) {
    try {
      const skip = (page - 1) * limit;

      const comments = await prisma.postComment.findMany({
        where: { 
          postId,
          parentId: null // Solo comentarios principales
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              employee: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true
                }
              },
              company: {
                select: {
                  name: true,
                  logo: true
                }
              }
            }
          },
          replies: {
            orderBy: { createdAt: 'asc' },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  employee: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true
                    }
                  },
                  company: {
                    select: {
                      name: true,
                      logo: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      const total = await prisma.postComment.count({ 
        where: { postId, parentId: null } 
      });

      return {
        comments: comments.map(comment => this.formatComment(comment)),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error obteniendo comentarios:', error);
      throw error;
    }
  }

  // Incrementar views
  async incrementViews(postId: string, userId: string) {
    try {
      // Solo incrementar si no es el propio autor
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true }
      });

      if (post && post.userId !== userId) {
        await prisma.post.update({
          where: { id: postId },
          data: { viewsCount: { increment: 1 } }
        });
      }
    } catch (error) {
      console.error('Error incrementando views:', error);
    }
  }

  // Formatear post para respuesta
  private formatPost(post: any) {
    const user = post.user;
    const userInfo = user.employee || user.company;
    
    return {
      id: post.id,
      content: post.content,
      images: post.images ? JSON.parse(post.images) : [],
      type: post.type,
      visibility: post.visibility,
      viewsCount: post.viewsCount,
      sharesCount: post.sharesCount,
      isPinned: post.isPinned,
      isModerated: post.isModerated,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      
      // Datos específicos según tipo
      offerData: post.offerData ? JSON.parse(post.offerData) : null,
      eventData: post.eventData ? JSON.parse(post.eventData) : null,
      demandData: post.demandData ? JSON.parse(post.demandData) : null,
      
      // Usuario
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: userInfo ? 
          (user.employee ? `${userInfo.firstName} ${userInfo.lastName}` : userInfo.name) :
          'Usuario',
        avatar: userInfo?.avatar || userInfo?.logo || null,
        title: user.employee ? userInfo?.jobTitle : 'Empresa'
      },
      
      // Estadísticas
      stats: {
        likes: post._count?.likes || 0,
        comments: post._count?.comments || 0,
        views: post.viewsCount,
        shares: post.sharesCount
      },
      
      // Likes
      likes: post.likes?.map((like: any) => ({
        id: like.id,
        emoji: like.emoji,
        user: this.formatUserInfo(like.user)
      })) || [],
      
      // Comentarios recientes
      recentComments: post.comments?.map((comment: any) => this.formatComment(comment)) || []
    };
  }

  // Formatear comentario
  private formatComment(comment: any) {
    return {
      id: comment.id,
      content: comment.content,
      isEdited: comment.isEdited,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: this.formatUserInfo(comment.user),
      replies: comment.replies?.map((reply: any) => ({
        id: reply.id,
        content: reply.content,
        isEdited: reply.isEdited,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        user: this.formatUserInfo(reply.user)
      })) || []
    };
  }

  // Formatear información de usuario
  private formatUserInfo(user: any) {
    const userInfo = user.employee || user.company;
    return {
      id: user.id,
      email: user.email,
      name: userInfo ? 
        (user.employee ? `${userInfo.firstName} ${userInfo.lastName}` : userInfo.name) :
        'Usuario',
      avatar: userInfo?.avatar || userInfo?.logo || null,
      title: user.employee ? userInfo?.jobTitle : 'Empresa'
    };
  }
}