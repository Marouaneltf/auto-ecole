import { Request, Response } from 'express';
import Service from '../models/Service';
import ServiceCategory from '../models/ServiceCategory';

// Categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await ServiceCategory.findAll({
      order: [['sort_order', 'ASC']],
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await ServiceCategory.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
};

// Services
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.findAll({
      include: [{ model: ServiceCategory, as: 'category' }],
      order: [['sort_order', 'ASC']],
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
};

export const getServicesByCategory = async (req: Request, res: Response) => {
  try {
    const { categorySlug } = req.params;
    const category = await ServiceCategory.findOne({ where: { slug: categorySlug } });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const services = await Service.findAll({
      where: { category_id: category.id },
      order: [['sort_order', 'ASC']],
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await service.update(req.body);
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await service.destroy();
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error });
  }
};
