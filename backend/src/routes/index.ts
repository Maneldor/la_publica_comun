import { Router } from 'express';
import authRoutes from './auth.routes';
import { adminRoutes } from '../modules/admin';
import chatRoutes from '../modules/aiChat/routes/chat.routes';
import { messagingRoutes } from '../modules/messaging';
import postsRoutes from './posts.routes';
import empresasRoutes from './empresas.routes';
// Import other route modules as they are created
// import userRoutes from './user.routes';
// import employeeRoutes from './employee.routes';
// import analyticsRoutes from './analytics.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Route modules
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/ai-chat', chatRoutes);
router.use('/messaging', messagingRoutes);
router.use('/posts', postsRoutes);
router.use('/empresas', empresasRoutes);
// router.use('/users', userRoutes);
// router.use('/employees', employeeRoutes);
// router.use('/analytics', analyticsRoutes);

export default router;