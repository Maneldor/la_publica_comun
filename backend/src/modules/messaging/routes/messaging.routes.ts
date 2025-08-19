import { Router } from 'express';
import { authenticateUser } from '../../../middleware/auth.simple';
import * as conversationController from '../controllers/conversation.controller';
import * as messageController from '../controllers/message.controller';
import * as pushController from '../controllers/push.controller';
import * as linkPreviewController from '../controllers/linkPreview.controller';
import { validateSendMessage } from '../validators/message.validator';
import { 
  validateGetLinkPreview, 
  validateGetMultipleLinkPreviews,
  validateDetectUrlsInText 
} from '../validators/linkPreview.validator';

const router = Router();

router.use(authenticateUser);

// Rutas de conversaciones
router.get('/conversations', conversationController.getConversations);
router.get('/conversations/:otherUserId/messages', conversationController.getConversationMessages);
router.get('/users/search', conversationController.searchUsers);

// Rutas de mensajes
router.post('/messages', validateSendMessage, messageController.sendMessage);
router.patch('/messages/:messageId/read', messageController.markAsRead);
router.post('/messages/mark-all-read', messageController.markAllAsRead);
router.delete('/messages/:messageId', messageController.deleteMessage);
router.get('/messages/unread-count', messageController.getUnreadCount);

// Rutas de push notifications
router.post('/push/subscribe', pushController.subscribeToPush);
router.post('/push/unsubscribe', pushController.unsubscribeFromPush);
router.get('/push/subscriptions', pushController.getUserSubscriptions);
router.put('/push/settings', pushController.updateNotificationSettings);
router.get('/push/settings', pushController.getNotificationSettings);
router.get('/push/stats', pushController.getNotificationStats);
router.post('/push/test', pushController.testPushNotification);
router.post('/push/send-custom', pushController.sendCustomNotification);

// Rutas de link previews
router.get('/link-preview', validateGetLinkPreview, linkPreviewController.getLinkPreview);
router.post('/link-previews', validateGetMultipleLinkPreviews, linkPreviewController.getMultipleLinkPreviews);
router.post('/detect-urls', validateDetectUrlsInText, linkPreviewController.detectUrlsInText);

export default router;