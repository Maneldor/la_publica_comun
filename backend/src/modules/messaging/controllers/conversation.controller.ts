import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiError } from '../../../utils/ApiError';

const prisma = new PrismaClient();

export const getConversations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const conversations = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { recipientId: userId }
      ]
    },
    select: {
      id: true,
      subject: true,
      content: true,
      status: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          email: true,
          role: true,
          employee: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
              jobTitle: true,
              organization: true
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
      recipient: {
        select: {
          id: true,
          email: true,
          role: true,
          employee: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
              jobTitle: true,
              organization: true
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
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip,
    take: Number(limit),
    distinct: ['senderId', 'recipientId']
  });

  const groupedConversations = conversations.reduce((acc: any[], message) => {
    const otherUser = message.senderId === userId ? message.recipient : message.sender;
    const existingConv = acc.find(conv => 
      conv.user.id === otherUser.id
    );

    if (!existingConv) {
      acc.push({
        id: `conv_${otherUser.id}`,
        user: otherUser,
        lastMessage: message,
        unreadCount: 0
      });
    }

    return acc;
  }, []);

  const unreadCounts = await prisma.message.groupBy({
    by: ['senderId'],
    where: {
      recipientId: userId,
      status: 'SENT'
    },
    _count: true
  });

  groupedConversations.forEach(conv => {
    const unread = unreadCounts.find(u => u.senderId === conv.user.id);
    if (unread) {
      conv.unreadCount = unread._count;
    }
  });

  const total = await prisma.message.count({
    where: {
      OR: [
        { senderId: userId },
        { recipientId: userId }
      ]
    }
  });

  res.json({
    success: true,
    data: groupedConversations,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

export const getConversationMessages = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { otherUserId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId }
      ]
    },
    include: {
      sender: {
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
      recipient: {
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
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip,
    take: Number(limit)
  });

  await prisma.message.updateMany({
    where: {
      senderId: otherUserId,
      recipientId: userId,
      status: 'SENT'
    },
    data: {
      status: 'READ',
      readAt: new Date()
    }
  });

  const total = await prisma.message.count({
    where: {
      OR: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId }
      ]
    }
  });

  res.json({
    success: true,
    data: messages.reverse(),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  const userId = req.user?.id;

  if (!q || String(q).length < 2) {
    return res.json({
      success: true,
      data: []
    });
  }

  const searchTerm = String(q).toLowerCase();

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: userId } },
        {
          OR: [
            { email: { contains: searchTerm, mode: 'insensitive' } },
            {
              employee: {
                OR: [
                  { firstName: { contains: searchTerm, mode: 'insensitive' } },
                  { lastName: { contains: searchTerm, mode: 'insensitive' } },
                  { jobTitle: { contains: searchTerm, mode: 'insensitive' } },
                  { organization: { contains: searchTerm, mode: 'insensitive' } }
                ]
              }
            },
            {
              company: {
                name: { contains: searchTerm, mode: 'insensitive' }
              }
            }
          ]
        }
      ]
    },
    select: {
      id: true,
      email: true,
      role: true,
      employee: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
          jobTitle: true,
          organization: true,
          community: true
        }
      },
      company: {
        select: {
          name: true,
          logo: true,
          sector: true
        }
      }
    },
    take: 10
  });

  res.json({
    success: true,
    data: users
  });
});