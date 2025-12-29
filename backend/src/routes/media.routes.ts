import { Router } from 'express';
import MediaController from '../controllers/MediaController';
import { authenticateToken, isAdmin } from '../middleware/auth';
import upload from '../middleware/upload';

const router = Router();

// Public route to view/get media? 
// No, media is accessed via static file serving.
// These routes are for management (Admin only).

router.post('/upload', authenticateToken, isAdmin, upload.single('file'), MediaController.upload);
router.get('/', authenticateToken, isAdmin, MediaController.getAll);
router.delete('/:id', authenticateToken, isAdmin, MediaController.delete);

export default router;
