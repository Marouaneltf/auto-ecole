import { Request, Response } from 'express';
import Content from '../models/Content';

export const listContent = async (req: Request, res: Response) => {
  try {
    const { page, section } = req.query as { page?: string; section?: string };
    const where: any = {};
    if (page) where.page_name = page;
    if (section) where.section_name = section;
    const items = await Content.findAll({ where, order: [['page_name', 'ASC'], ['section_name', 'ASC']] });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content', error });
  }
};

export const getContentByPageSection = async (req: Request, res: Response) => {
  try {
    const { page, section } = req.params;
    const item = await Content.findOne({ where: { page_name: page, section_name: section } });
    if (!item) {
      return res.status(200).json(null);
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content', error });
  }
};

export const upsertContent = async (req: Request, res: Response) => {
  try {
    const { page_name, section_name, content_type, content, metadata } = req.body;
    if (!page_name || !section_name) {
      return res.status(400).json({ message: 'page_name and section_name are required' });
    }
    const [item, created] = await Content.findOrCreate({
      where: { page_name, section_name },
      defaults: { content_type, content, metadata }
    });
    if (!created) {
      await item.update({ content_type, content, metadata });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error saving content', error });
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Content.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Content not found' });
    }
    await item.destroy();
    res.json({ message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting content', error });
  }
};
