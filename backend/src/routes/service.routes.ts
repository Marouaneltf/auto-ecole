import { Router } from 'express';
import {
  getServices,
  getServicesByCategory,
  createService,
  updateService,
  deleteService,
  getCategories,
  createCategory,
} from '../controllers/ServiceController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public
router.get('/', getServices);
router.get('/categories', getCategories);
router.get('/category/:categorySlug', getServicesByCategory);

// Protected
router.post('/', authenticateToken, createService);
router.put('/:id', authenticateToken, updateService);
router.delete('/:id', authenticateToken, deleteService);
router.post('/categories', authenticateToken, createCategory);

export default router;
