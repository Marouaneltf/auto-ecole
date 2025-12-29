import { Request, Response } from 'express';
import CmsComponent from '../models/CmsComponent';
import CmsComponentField from '../models/CmsComponentField';
import sequelize from '../config/database';

class CmsComponentController {
  // Add component to page
  async create(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const { page_id, type, name, sort_order, fields } = req.body; // fields is array of { name, type, value }

      const component = await CmsComponent.create({
        page_id,
        type,
        name,
        sort_order: sort_order || 0,
        is_active: true,
      }, { transaction: t });

      if (fields && Array.isArray(fields)) {
        const fieldPromises = fields.map((f: any) => {
          return CmsComponentField.create({
            component_id: component.id,
            field_name: f.name,
            field_type: f.type,
            field_value: f.value,
          }, { transaction: t });
        });
        await Promise.all(fieldPromises);
      }

      await t.commit();

      // Fetch complete component to return
      const fullComponent = await CmsComponent.findByPk(component.id, {
        include: [{ model: CmsComponentField, as: 'fields' }],
      });

      res.status(201).json(fullComponent);
    } catch (error) {
      await t.rollback();
      console.error('Error creating component:', error);
      res.status(500).json({ message: 'Error creating component', error });
    }
  }

  // Update component (and fields)
  async update(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { name, sort_order, is_active, fields } = req.body;

      const component = await CmsComponent.findByPk(id);
      if (!component) {
        await t.rollback();
        return res.status(404).json({ message: 'Component not found' });
      }

      await component.update({
        name,
        sort_order,
        is_active
      }, { transaction: t });

      if (fields && Array.isArray(fields)) {
        const normalized = fields.map((f: any) => ({
          name: f?.name ?? f?.field_name,
          type: f?.type ?? f?.field_type ?? 'text',
          value: f?.value ?? f?.field_value ?? ''
        })).filter((f: any) => !!f.name);

        await CmsComponentField.destroy({
          where: { component_id: parseInt(id) },
          transaction: t
        });

        if (normalized.length > 0) {
          const payload = normalized.map((f: any) => ({
            component_id: parseInt(id),
            field_name: f.name,
            field_type: f.type,
            field_value: f.value
          }));
          await CmsComponentField.bulkCreate(payload, { transaction: t });
        }
      }

      await t.commit();

      const fullComponent = await CmsComponent.findByPk(id, {
        include: [{ model: CmsComponentField, as: 'fields' }],
      });

      res.json(fullComponent);
    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: 'Error updating component', error });
    }
  }

  // Delete component
  async delete(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const component = await CmsComponent.findByPk(id);

      if (!component) {
        await t.rollback();
        return res.status(404).json({ message: 'Component not found' });
      }

      // Delete fields first (cascade might handle this but safer to be explicit or rely on DB FK cascade)
      // Sequelize has onDelete: 'CASCADE' usually, but let's manual delete fields to be safe if not set
      await CmsComponentField.destroy({
        where: { component_id: id },
        transaction: t
      });

      await component.destroy({ transaction: t });
      await t.commit();

      res.json({ message: 'Component deleted successfully' });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: 'Error deleting component', error });
    }
  }

  // Reorder components
  async reorder(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const { items } = req.body; // Array of { id: number, sort_order: number }

      if (!Array.isArray(items)) {
         await t.rollback();
         return res.status(400).json({ message: 'Invalid items format' });
      }

      for (const item of items) {
        await CmsComponent.update(
          { sort_order: item.sort_order },
          { where: { id: item.id }, transaction: t }
        );
      }

      await t.commit();
      res.json({ message: 'Components reordered successfully' });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: 'Error reordering components', error });
    }
  }
}

export default new CmsComponentController();
