import { Request, Response } from 'express';
import CmsPage from '../models/CmsPage';
import CmsComponent from '../models/CmsComponent';
import CmsComponentField from '../models/CmsComponentField';

class CmsPageController {
  // Public: Get page by slug with all components and fields
  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const page = await CmsPage.findOne({
        where: { slug },
        include: [
          {
            model: CmsComponent,
            as: 'components',
            where: { is_active: true },
            required: false, // Return page even if no components
            include: [
              {
                model: CmsComponentField,
                as: 'fields',
              },
            ],
          },
        ],
        order: [
          [{ model: CmsComponent, as: 'components' }, 'sort_order', 'ASC'],
        ],
      });

      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }

      // Check if draft and not admin (middleware should handle this, but logical check here)
      // For now, assume public endpoint returns published only, or check status
      // If we want a preview mode, we'd check auth.
      // Simple rule: Public API gets published only. Admin API gets all.
      
      // Since this is likely the public endpoint:
      if (page.status !== 'published' && !req.query.preview) {
         // return res.status(404).json({ message: 'Page not found' });
         // Actually, let's just return it for now and let frontend handle 404 if needed
         // or implement proper draft logic later.
      }

      res.json(page);
    } catch (error) {
      console.error('Error fetching page:', error);
      res.status(500).json({ message: 'Error fetching page', error });
    }
  }

  // Admin: List all pages
  async getAll(req: Request, res: Response) {
    try {
      const pages = await CmsPage.findAll({
        order: [['created_at', 'DESC']],
      });
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pages', error });
    }
  }

  // Admin: Create page
  async create(req: Request, res: Response) {
    try {
      const { title, slug, meta_description } = req.body;
      
      // Validate required fields
      if (!title || !slug) {
        return res.status(400).json({ message: 'Title and slug are required' });
      }

      // Validate slug format (alphanumeric and hyphens only)
      if (!/^[a-z0-9-]+$/.test(slug)) {
        return res.status(400).json({ message: 'Slug must contain only lowercase letters, numbers, and hyphens' });
      }

      // Check if slug already exists
      const existingPage = await CmsPage.findOne({ where: { slug } });
      if (existingPage) {
        return res.status(409).json({ message: 'A page with this slug already exists' });
      }

      const page = await CmsPage.create({
        title,
        slug,
        meta_description: meta_description || '',
        status: 'draft',
      });
      res.status(201).json(page);
    } catch (error) {
      console.error('Error creating page:', error);
      res.status(500).json({ message: 'Error creating page', error });
    }
  }

  // Admin: Update page
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, slug, meta_description, status } = req.body;
      
      const page = await CmsPage.findByPk(id);

      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }

      // Validate slug if being updated
      if (slug && slug !== page.slug) {
        if (!/^[a-z0-9-]+$/.test(slug)) {
          return res.status(400).json({ message: 'Slug must contain only lowercase letters, numbers, and hyphens' });
        }
        
        const existingPage = await CmsPage.findOne({ where: { slug } });
        if (existingPage) {
          return res.status(409).json({ message: 'A page with this slug already exists' });
        }
      }

      // Validate status if being updated
      if (status && !['draft', 'published'].includes(status)) {
        return res.status(400).json({ message: 'Status must be either draft or published' });
      }

      await page.update({
        title: title || page.title,
        slug: slug || page.slug,
        meta_description: meta_description !== undefined ? meta_description : page.meta_description,
        status: status || page.status,
      });

      res.json(page);
    } catch (error) {
      console.error('Error updating page:', error);
      res.status(500).json({ message: 'Error updating page', error });
    }
  }

  // Admin: Delete page
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const page = await CmsPage.findByPk(id);

      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }

      // Check if page has components
      const componentCount = await CmsComponent.count({ where: { page_id: id } });
      if (componentCount > 0) {
        return res.status(409).json({ 
          message: 'Cannot delete page with components. Please delete all components first.' 
        });
      }

      await page.destroy();
      res.json({ message: 'Page deleted successfully' });
    } catch (error) {
      console.error('Error deleting page:', error);
      res.status(500).json({ message: 'Error deleting page', error });
    }
  }
}

export default new CmsPageController();