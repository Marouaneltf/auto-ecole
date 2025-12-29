import sequelize from './config/database';
import bcrypt from 'bcryptjs';
import User from './models/User';
import ServiceCategory from './models/ServiceCategory';
import Service from './models/Service';
import BusinessInfo from './models/BusinessInfo';
import Content from './models/Content';

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // Reset database
    console.log('Database synced');

    // Create Admin User
    await User.create({
      email: 'admin@autoecole18.fr',
      password_hash: await bcrypt.hash('admin123', 10),
      name: 'Admin',
      role: 'admin',
    });
    console.log('Admin user created');

    // Create Service Categories
    const catB = await ServiceCategory.create({
      name: 'Permis B',
      slug: 'permis-b',
      description: 'Permis de conduire voiture',
      sort_order: 1,
    });

    const catA = await ServiceCategory.create({
      name: 'Permis A',
      slug: 'permis-a',
      description: 'Permis de conduire moto',
      sort_order: 2,
    });

    const catCode = await ServiceCategory.create({
      name: 'Code',
      slug: 'code',
      description: 'Code de la route',
      sort_order: 3,
    });
    console.log('Categories created');

    // Create Services
    await Service.bulkCreate([
      {
        category_id: catB.id,
        name: 'AAC - Apprentissage anticipé de la conduite',
        slug: 'aac-apprentissage-anticipe',
        description: 'Formation complète en AAC',
        price: 1200.00,
        duration: '20 heures',
        icon: '🚗',
        sort_order: 1,
      },
      {
        category_id: catB.id,
        name: 'CS - Conduite supervisée',
        slug: 'cs-conduite-supervisee',
        description: 'Formation en conduite supervisée',
        price: 1100.00,
        duration: '20 heures',
        icon: '🚗',
        sort_order: 2,
      },
      {
        category_id: catB.id,
        name: 'Manuelle',
        slug: 'manuelle',
        description: 'Permis B boîte manuelle',
        price: 1000.00,
        duration: '20 heures',
        icon: '🚗',
        sort_order: 3,
      },
      {
        category_id: catB.id,
        name: 'Automatique',
        slug: 'automatique',
        description: 'Permis B boîte automatique',
        price: 1050.00,
        duration: '15 heures',
        icon: '🚗',
        sort_order: 4,
      },
      {
        category_id: catA.id,
        name: 'A1 / A2',
        slug: 'a1-a2',
        description: 'Permis moto A1 et A2',
        price: 800.00,
        duration: '10 heures',
        icon: '🏍',
        sort_order: 1,
      },
      {
        category_id: catA.id,
        name: '125',
        slug: '125',
        description: 'Formation 125cm3',
        price: 300.00,
        duration: '7 heures',
        icon: '🛵',
        sort_order: 2,
      },
      {
        category_id: catA.id,
        name: 'BSR',
        slug: 'bsr',
        description: 'Brevet de sécurité routier',
        price: 150.00,
        duration: '3 heures',
        icon: '🛵',
        sort_order: 3,
      },
      {
        category_id: catCode.id,
        name: 'Code accéléré',
        slug: 'code-accelere',
        description: 'Formation accélérée au code',
        price: 200.00,
        duration: '10 heures',
        icon: '📝',
        sort_order: 1,
      },
    ]);
    console.log('Services created');

    // Create Business Info
    await BusinessInfo.create({
      name: 'Auto-École CAR 18 ème',
      address: '6, rue Joseph Dijon, 75018 Paris',
      phone: '01 42 58 74 12',
      email: 'contact@autoecole18.fr',
      description: 'Auto-école professionnelle à Paris 18ème, spécialisée dans tous types de permis de conduire',
      siret: '12345678900012',
      insurance_info: 'Assurance responsabilité civile professionnelle',
    });
    console.log('Business Info created');

    // Seed Content sections
    await Content.bulkCreate([
      {
        page_name: 'home',
        section_name: 'hero_tagline',
        content_type: 'text',
        content: 'Votre réussite est notre priorité. Formations complètes et accompagnement personnalisé.',
      },
      {
        page_name: 'home',
        section_name: 'hero_background_url',
        content_type: 'text',
        content: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      },
      {
        page_name: 'about',
        section_name: 'story_text',
        content_type: 'text',
        content: 'Fondée au cœur du 18ème arrondissement de Paris, l’Auto-École CAR 18 ème accompagne ses élèves vers la réussite depuis plus de 10 ans.',
      },
      {
        page_name: 'about',
        section_name: 'image_url',
        content_type: 'text',
        content: 'https://images.unsplash.com/photo-1580273916550-e323be2ed532?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      },
      {
        page_name: 'footer',
        section_name: 'hours',
        content_type: 'text',
        content: 'Lundi - Vendredi: 9h - 19h | Samedi: 9h - 13h',
      }
    ]);
    console.log('Content sections created');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
