import { Router } from 'express';
import CmsPageController from '../controllers/CmsPageController';
import CmsComponentController from '../controllers/CmsComponentController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/pages/:slug', CmsPageController.getBySlug);

// Admin routes (Pages)
router.get('/admin/pages', authenticateToken, isAdmin, CmsPageController.getAll);
router.post('/admin/pages', authenticateToken, isAdmin, CmsPageController.create);
router.put('/admin/pages/:id', authenticateToken, isAdmin, CmsPageController.update);
router.delete('/admin/pages/:id', authenticateToken, isAdmin, CmsPageController.delete);

// Admin routes (Components)
router.post('/admin/components', authenticateToken, isAdmin, CmsComponentController.create);
router.put('/admin/components/:id', authenticateToken, isAdmin, CmsComponentController.update);
router.delete('/admin/components/:id', authenticateToken, isAdmin, CmsComponentController.delete);
router.post('/admin/components/reorder', authenticateToken, isAdmin, CmsComponentController.reorder);

export default router;
