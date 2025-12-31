import path from 'path';
import fs from 'fs';
import sequelize from '../config/database';
import BusinessInfo from '../models/BusinessInfo';
import ServiceCategory from '../models/ServiceCategory';
import Service from '../models/Service';
import Content from '../models/Content';
import Media from '../models/Media';

function mimeFromExt(filename: string): string {
  const ext = filename.toLowerCase();
  if (ext.endsWith('.png')) return 'image/png';
  if (ext.endsWith('.jpg') || ext.endsWith('.jpeg')) return 'image/jpeg';
  if (ext.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
}

async function ensureMediaFromUploads(): Promise<Media[]> {
  const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
  const seedDir = path.join(uploadsDir, 'seed');
  const sourceDir = fs.existsSync(seedDir) ? seedDir : uploadsDir;
  if (!fs.existsSync(sourceDir)) return [];
  const files = fs.readdirSync(sourceDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  const seeded: Media[] = [];
  for (const filename of files) {
    const existing = await Media.findOne({ where: { filename } });
    if (existing) { seeded.push(existing as any); continue; }
    const fullPath = path.join(sourceDir, filename);
    const stat = fs.statSync(fullPath);
    const rec = await Media.create({
      filename,
      original_name: filename,
      mime_type: mimeFromExt(filename),
      file_size: stat.size,
      path: fullPath,
      alt_text: filename.replace(/[-_]/g, ' '),
    });
    seeded.push(rec as any);
  }
  return seeded;
}

export async function seedBusinessInfo(): Promise<void> {
  const count = await BusinessInfo.count();
  if (count > 0) return;
  const media = await ensureMediaFromUploads();
  const logo = media[0]?.id || null;
  await BusinessInfo.create({
    name: 'Auto-École CAR 18 ème',
    address: '6, rue Joseph Dijon, 75018 Paris',
    phone: '01 42 58 96 32',
    email: 'contact@autoecole18.fr',
    description: 'Auto-école professionnelle à Paris 18ème, spécialisée dans tous types de permis de conduire',
    siret: '12345678900012',
    insurance_info: 'Assurance responsabilité civile professionnelle',
    opening_hours: 'Lundi-Vendredi: 8h-19h; Samedi: 8h-17h',
    logo_media_id: logo,
    social_links: { facebook: '', instagram: '', twitter: '' }
  });
}

export async function seedHeaderFooterContent(): Promise<void> {
  const pairs: Array<[string, string, string]> = [
    ['header','nav_home','text'],
    ['header','nav_services','text'],
    ['header','nav_about','text'],
    ['header','nav_contact','text'],
    ['header','subtitle','text'],
    ['header','cta_primary_label','text'],
    ['header','cta_mobile_label','text'],
    ['header','logo_icon','text'],
    ['header','menu_icon','text'],
    ['header','close_icon','text'],
    ['footer','brand_title','text'],
    ['footer','brand_subtitle','text'],
    ['footer','brand_description','text'],
    ['footer','legal_label','text'],
    ['footer','privacy_label','text'],
    ['footer','icon_address','text'],
    ['footer','icon_phone','text'],
    ['footer','icon_email','text'],
    ['footer','icon_hours','text'],
    ['footer','brand_icon','text'],
  ];
  const values: Record<string,string> = {
    'header:nav_home': 'Accueil',
    'header:nav_services': 'Services',
    "header:nav_about": "L'Auto-École",
    'header:nav_contact': 'Contact',
    'header:subtitle': 'Permis de conduire Paris',
    'header:cta_primary_label': 'Nous contacter',
    'header:cta_mobile_label': 'Appeler maintenant',
    'header:logo_icon': 'car',
    'header:menu_icon': 'menu',
    'header:close_icon': 'x',
    'footer:brand_title': 'Auto-École CAR 18 ème',
    'footer:brand_subtitle': 'Votre réussite, notre priorité',
    'footer:brand_description': 'Auto-école professionnelle au cœur du 18e arrondissement de Paris. Plus de 5000 permis délivrés.',
    'footer:legal_label': 'Mentions légales',
    'footer:privacy_label': 'Politique de confidentialité',
    'footer:icon_address': 'map-pin',
    'footer:icon_phone': 'phone',
    'footer:icon_email': 'mail',
    'footer:icon_hours': 'clock',
    'footer:brand_icon': 'car',
  };
  for (const [page, section, type] of pairs) {
    const key = `${page}:${section}`;
    const content = values[key] || '';
    const [item, created] = await Content.findOrCreate({ where: { page_name: page, section_name: section }, defaults: { content_type: type, content } });
    if (created && content) await item.update({ content_type: type, content });
  }
}

export async function seedHome(): Promise<void> {
  const media = await ensureMediaFromUploads();
  const bgId = media[1]?.id || null;
  const entries = [
    { page_name: 'home', section_name: 'hero_title', content_type: 'text', content: 'Votre permis de conduire en toute confiance' },
    { page_name: 'home', section_name: 'hero_tagline', content_type: 'text', content: 'Réussissez votre permis avec notre méthode éprouvée et nos moniteurs certifiés.' },
    { page_name: 'home', section_name: 'hero_background', content_type: 'media', content: bgId ? String(bgId) : '' },
    { page_name: 'home', section_name: 'hero_cta_primary', content_type: 'text', content: 'Commencer maintenant' },
    { page_name: 'home', section_name: 'hero_cta_secondary', content_type: 'text', content: 'Nos services' },
    { page_name: 'home', section_name: 'hero_badge', content_type: 'text', content: 'Plus de 15 ans d’expérience' },
    { page_name: 'home', section_name: 'hero_stats', content_type: 'json', content: JSON.stringify([
      { value: '95%', label: 'Taux de réussite' },
      { value: '5000+', label: 'Élèves formés' },
      { value: '4.8/5', label: 'Avis clients' }
    ]) },
    { page_name: 'home', section_name: 'why_choose_us', content_type: 'json', content: JSON.stringify([
      { icon: 'award', title: 'Taux de réussite élevé', description: 'Grâce à une pédagogie moderne et un suivi personnalisé' },
      { icon: 'users', title: 'Moniteurs certifiés', description: 'Professionnels expérimentés, attentifs et bienveillants' },
      { icon: 'clock', title: 'Horaires flexibles', description: 'Créneaux adaptés à votre emploi du temps' },
    ]) },
    { page_name: 'home', section_name: 'why_badge', content_type: 'text', content: 'Pourquoi nous choisir' },
    { page_name: 'home', section_name: 'why_title', content_type: 'text', content: 'L’excellence à votre service' },
    { page_name: 'home', section_name: 'why_subtitle', content_type: 'text', content: 'Des milliers d’élèves nous font confiance pour leur réussite au permis de conduire' },
    { page_name: 'home', section_name: 'why_cta_label', content_type: 'text', content: 'Découvrir tous nos avantages' },
    { page_name: 'home', section_name: 'learning_steps', content_type: 'json', content: JSON.stringify([
      { step: 'Inscription', description: 'Dossier complet et prise en charge rapide' },
      { step: 'Code de la route', description: 'Apprentissage accompagné et examens blancs' },
      { step: 'Conduite pratique', description: 'Leçons structurées sur parcours variés' },
      { step: 'Examen final', description: 'Préparation ciblée et conseils de réussite' },
    ]) },
    { page_name: 'home', section_name: 'services_badge', content_type: 'text', content: 'Nos formations' },
    { page_name: 'home', section_name: 'services_title', content_type: 'text', content: 'Choisissez votre permis' },
    { page_name: 'home', section_name: 'services_subtitle', content_type: 'text', content: 'Des formations adaptées à vos besoins et à votre rythme' },
    { page_name: 'home', section_name: 'testimonials_badge', content_type: 'text', content: 'Témoignages' },
    { page_name: 'home', section_name: 'testimonials_title', content_type: 'text', content: 'Ils ont réussi avec nous' },
    { page_name: 'home', section_name: 'testimonials_subtitle', content_type: 'text', content: 'Découvrez les expériences de nos élèves satisfaits' },
    { page_name: 'home', section_name: 'testimonials_prev_icon', content_type: 'text', content: 'chevron-left' },
    { page_name: 'home', section_name: 'testimonials_next_icon', content_type: 'text', content: 'chevron-right' },
    { page_name: 'home', section_name: 'cta_title', content_type: 'text', content: 'Prêt à commencer votre formation ?' },
    { page_name: 'home', section_name: 'cta_subtitle', content_type: 'text', content: 'Contactez-nous dès aujourd’hui pour planifier votre premier cours' },
    { page_name: 'home', section_name: 'cta_primary_label', content_type: 'text', content: 'Prendre rendez-vous' },
    { page_name: 'home', section_name: 'promotions', content_type: 'json', content: JSON.stringify([
      { title: 'Pack Code + Conduite', description: 'Économisez 15% avec notre formule complète', image: 'https://images.unsplash.com/photo-1517363890941-6286ff9cf2a8?q=80&w=1400&auto=format&fit=crop', link: '/services/code-accelere', order: 1, visible: true },
      { title: 'Permis B Automatique', description: 'Idéal pour débuter en douceur', image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1400&auto=format&fit=crop', link: '/services/automatique', order: 2, visible: true },
      { title: 'Week-end Intensif', description: 'Stage express code + conduite', image: 'https://images.unsplash.com/photo-1518308672949-3c2b6e3c3e1c?q=80&w=1400&auto=format&fit=crop', link: '/contact', order: 3, visible: true }
    ]) },
  ];
  for (const e of entries) {
    const [item, created] = await Content.findOrCreate({ where: { page_name: e.page_name, section_name: e.section_name }, defaults: e });
    if (created) await item.update(e);
  }
}

export async function seedServices(): Promise<void> {
  const [catB] = await ServiceCategory.findOrCreate({ where: { slug: 'permis-b' }, defaults: { name: 'Permis B', slug: 'permis-b', description: 'Permis de conduire voiture', sort_order: 1 } });
  const [catA] = await ServiceCategory.findOrCreate({ where: { slug: 'permis-a' }, defaults: { name: 'Permis A', slug: 'permis-a', description: 'Permis de conduire moto', sort_order: 2 } });
  const [catCode] = await ServiceCategory.findOrCreate({ where: { slug: 'code' }, defaults: { name: 'Code', slug: 'code', description: 'Code de la route', sort_order: 3 } });

  const media = await ensureMediaFromUploads();
  const m = (i: number) => media[i]?.id || null;
  const defs = [
    { category_id: catB.id, name: 'AAC - Apprentissage anticipé de la conduite', slug: 'aac-apprentissage-anticipe', description: 'Formation complète en AAC avec accompagnement et suivi personnalisé.', price: 1200.00, duration: '20 heures', icon: 'car', image_media_id: m(2), sort_order: 1 },
    { category_id: catB.id, name: 'CS - Conduite supervisée', slug: 'cs-conduite-supervisee', description: 'Formation en conduite supervisée avec encadrement progressif.', price: 1100.00, duration: '20 heures', icon: 'car', image_media_id: m(3), sort_order: 2 },
    { category_id: catB.id, name: 'Manuelle', slug: 'manuelle', description: 'Permis B boîte manuelle avec véhicules récents et double commande.', price: 1000.00, duration: '20 heures', icon: 'car', image_media_id: m(4), sort_order: 3 },
    { category_id: catB.id, name: 'Automatique', slug: 'automatique', description: 'Permis B boîte automatique, idéal pour débuter en douceur.', price: 1050.00, duration: '15 heures', icon: 'car', image_media_id: m(5), sort_order: 4 },
    { category_id: catA.id, name: 'A1 / A2', slug: 'a1-a2', description: 'Permis moto A1 et A2 avec ateliers sécurité et maîtrise.', price: 800.00, duration: '10 heures', icon: 'award', image_media_id: m(6), sort_order: 1 },
    { category_id: catA.id, name: '125', slug: '125', description: 'Formation 125cm3 pour titulaires du permis B souhaitant conduire une 125cc.', price: 300.00, duration: '7 heures', icon: 'award', image_media_id: m(7), sort_order: 2 },
    { category_id: catA.id, name: 'BSR', slug: 'bsr', description: 'Brevet de sécurité routière pour cyclomoteurs, centré sur la sécurité.', price: 150.00, duration: '3 heures', icon: 'file-text', image_media_id: m(8), sort_order: 3 },
    { category_id: catCode.id, name: 'Code accéléré', slug: 'code-accelere', description: 'Formation accélérée au code avec examens blancs et coaching.', price: 200.00, duration: '10 heures', icon: 'file-text', image_media_id: m(9), sort_order: 1 },
  ];

  for (const d of defs) {
    const existing = await Service.findOne({ where: { slug: d.slug } });
    if (!existing) await Service.create(d as any);
  }
  const entries = [
    { page_name: 'services', section_name: 'page_title', content_type: 'text', content: 'Nos Formations' },
    { page_name: 'services', section_name: 'page_subtitle', content_type: 'text', content: 'Découvrez nos offres adaptées à vos besoins' },
    { page_name: 'services', section_name: 'features_title', content_type: 'text', content: 'Pourquoi choisir notre auto-école ?' },
    { page_name: 'services', section_name: 'features_subtitle', content_type: 'text', content: 'Des milliers d\'élèves nous font confiance' },
    { page_name: 'services', section_name: 'features', content_type: 'json', content: JSON.stringify([
      { icon: 'award', title: 'Taux de réussite élevé', description: '95% de réussite grâce à notre méthode pédagogique' },
      { icon: 'users', title: 'Instructeurs certifiés', description: 'Des professionnels expérimentés et à l\'écoute' },
      { icon: 'clock', title: 'Horaires flexibles', description: 'Des créneaux adaptés à votre emploi du temps' },
      { icon: 'check-circle', title: 'Formule tout inclus', description: 'Code, leçons de conduite et examen inclus' },
    ]) },
  ];
  for (const e of entries) {
    const [item, created] = await Content.findOrCreate({ where: { page_name: e.page_name, section_name: e.section_name }, defaults: e });
    if (created) await item.update(e);
  }
  const v1 = media[2]?.id || null;
  const vehicles = [
    { title: 'Voitures', description: 'Dernières générations avec double commande', image: v1 },
  ];
  const [vehItem, vehCreated] = await Content.findOrCreate({ where: { page_name: 'services', section_name: 'vehicles' }, defaults: { page_name: 'services', section_name: 'vehicles', content_type: 'json', content: JSON.stringify(vehicles) } });
  if (vehCreated) await vehItem.update({ content_type: 'json', content: JSON.stringify(vehicles) });
  await Content.findOrCreate({ where: { page_name: 'services', section_name: 'vehicles_title' }, defaults: { content_type: 'text', content: 'Nos véhicules' } });
  await Content.findOrCreate({ where: { page_name: 'services', section_name: 'vehicles_subtitle' }, defaults: { content_type: 'text', content: 'Des véhicules modernes et bien entretenus' } });
  await Content.findOrCreate({ where: { page_name: 'services', section_name: 'cta_title' }, defaults: { content_type: 'text', content: 'Prêt à commencer votre formation ?' } });
  await Content.findOrCreate({ where: { page_name: 'services', section_name: 'cta_subtitle' }, defaults: { content_type: 'text', content: 'Contactez-nous pour planifier votre premier cours' } });
  await Content.findOrCreate({ where: { page_name: 'services', section_name: 'cta_label' }, defaults: { content_type: 'text', content: 'Prendre rendez-vous' } });
}

export async function seedAbout(): Promise<void> {
  const media = await ensureMediaFromUploads();
  const imgId = media[0]?.id || null;
  const entries = [
    { page_name: 'about', section_name: 'story_text', content_type: 'text', content: 'Fondée au cœur du 18ème arrondissement, nous accompagnons nos élèves vers la réussite.' },
    { page_name: 'about', section_name: 'image', content_type: 'media', content: imgId ? String(imgId) : '' },
    { page_name: 'about', section_name: 'timeline', content_type: 'json', content: JSON.stringify([
      { year: '2010', title: 'Ouverture de l’auto-école', description: 'Création à Paris 18ème avec une équipe de moniteurs certifiés.' },
      { year: '2015', title: 'Cap des 1000 permis', description: 'Nos méthodes pédagogiques portent leurs fruits.' },
      { year: '2020', title: 'Plateforme numérique', description: 'Lancement de nos outils en ligne pour le code et la conduite.' },
      { year: '2024', title: 'Taux de réussite 95%', description: 'Accompagnement personnalisé et organisation optimisée.' }
    ]) },
    { page_name: 'about', section_name: 'values_title', content_type: 'text', content: 'Nos valeurs' },
    { page_name: 'about', section_name: 'values_subtitle', content_type: 'text', content: 'Ce qui nous guide chaque jour' },
    { page_name: 'about', section_name: 'values', content_type: 'json', content: JSON.stringify([
      { icon: 'award', title: 'Excellence', description: 'Nous visons l’excellence dans chaque aspect de notre enseignement.' },
      { icon: 'users', title: 'Personnalisation', description: 'Chaque élève est unique, nous adaptons notre enseignement à vos besoins.' },
      { icon: 'car', title: 'Sécurité', description: 'La sécurité est notre priorité absolue.' },
      { icon: 'clock', title: 'Flexibilité', description: 'Horaires flexibles et formules adaptées à votre emploi du temps.' }
    ]) },
    { page_name: 'about', section_name: 'team_title', content_type: 'text', content: 'Notre équipe' },
    { page_name: 'about', section_name: 'team_subtitle', content_type: 'text', content: 'Des professionnels passionnés à votre service' },
    { page_name: 'about', section_name: 'team', content_type: 'json', content: JSON.stringify([
      { name: 'Jean Dupont', role: 'Instructeur principal', description: '15 ans d’expérience, spécialiste permis B', image: imgId || null },
      { name: 'Marie Martin', role: 'Instructrice moto', description: 'Spécialiste permis A et formation accélérée', image: imgId || null },
      { name: 'Pierre Bernard', role: 'Instructeur code', description: 'Expert en pédagogie et formation en ligne', image: imgId || null }
    ]) },
    { page_name: 'about', section_name: 'cta_title', content_type: 'text', content: 'Prêt à nous rejoindre ?' },
    { page_name: 'about', section_name: 'cta_subtitle', content_type: 'text', content: 'Commencez votre formation dès aujourd’hui' },
    { page_name: 'about', section_name: 'cta_primary_label', content_type: 'text', content: 'Prendre rendez-vous' },
  ];
  for (const e of entries) {
    const [item, created] = await Content.findOrCreate({ where: { page_name: e.page_name, section_name: e.section_name }, defaults: e });
    if (created) await item.update(e);
  }
}

export async function seedTestimonials(): Promise<void> {
  const media = await ensureMediaFromUploads();
  const pick = (i:number) => media[i]?.id || null;
  const testimonials = [
    { name: 'Marie Dubois', rating: 5, comment: 'Excellente auto-école ! J\'ai réussi du premier coup.', date: '2024-06-01', avatar_media_id: pick(3), order: 1 },
    { name: 'Jean Martin', rating: 5, comment: 'Équipe formidable et moniteurs très pédagogues.', date: '2024-07-15', avatar_media_id: pick(4), order: 2 },
    { name: 'Sophie Bernard', rating: 4, comment: 'Organisation parfaite et méthodes efficaces.', date: '2024-08-20', avatar_media_id: pick(5), order: 3 },
    { name: 'Ali Ben Youssef', rating: 5, comment: 'Horaires flexibles et suivi personnalisé, top !', date: '2024-09-05', avatar_media_id: pick(6), order: 4 },
    { name: 'Camille Legrand', rating: 5, comment: 'Moniteurs patients et pédagogues, je recommande.', date: '2024-10-12', avatar_media_id: pick(7), order: 5 },
  ];
  const [item, created] = await Content.findOrCreate({ where: { page_name: 'testimonials', section_name: 'list' }, defaults: { content_type: 'json', content: JSON.stringify(testimonials) } });
  if (created) await item.update({ content_type: 'json', content: JSON.stringify(testimonials) });
}

export async function seedUiSettings(): Promise<void> {
  const entries = [
    { page_name: 'ui', section_name: 'primary_color', content_type: 'text', content: '#1E40AF' },
    { page_name: 'ui', section_name: 'accent_color', content_type: 'text', content: '#F59E0B' },
    { page_name: 'contact', section_name: 'map_url', content_type: 'text', content: '' },
    { page_name: 'service_card', section_name: 'cta_label', content_type: 'text', content: 'En savoir plus' },
    { page_name: 'service_card', section_name: 'badge', content_type: 'json', content: JSON.stringify({
      'permis-b': { label: 'Permis B', icon: 'car' },
      'permis-a': { label: 'Permis A', icon: 'car' },
      'code': { label: 'Code', icon: 'file-text' }
    }) },
    { page_name: 'legal', section_name: 'title', content_type: 'text', content: 'Mentions Légales' },
    { page_name: 'legal', section_name: 'content_html', content_type: 'html', content: `
      <section>
        <h2>1. Éditeur du site</h2>
        <p>Le site Auto-École CAR 18 ème est édité par Auto-École CAR 18 ème, 6 rue Joseph Dijon, 75018 Paris.</p>
        <p><strong>Téléphone :</strong> 01 42 58 96 32</p>
        <p><strong>Email :</strong> contact@autoecole18.fr</p>
        <p><strong>SIRET :</strong> 12345678900012</p>
      </section>
      <section>
        <h2>2. Hébergement</h2>
        <p>Ce site est hébergé par [Nom de l’hébergeur], [Adresse de l’hébergeur].</p>
      </section>
      <section>
        <h2>3. Propriété intellectuelle</h2>
        <p>Contenus protégés par les lois sur la propriété intellectuelle. Toute reproduction est interdite sans autorisation.</p>
      </section>
      <section>
        <h2>4. Données personnelles</h2>
        <p>Conformément à la loi, vous disposez d’un droit d’accès, de modification et de suppression des données vous concernant.</p>
      </section>
    ` },
    { page_name: 'privacy', section_name: 'title', content_type: 'text', content: 'Politique de confidentialité' },
    { page_name: 'privacy', section_name: 'content_html', content_type: 'html', content: `
      <section>
        <h2>Collecte des données</h2>
        <p>Nous collectons les données strictement nécessaires au traitement de vos demandes et inscriptions.</p>
      </section>
      <section>
        <h2>Utilisation</h2>
        <p>Vos données sont utilisées pour vous contacter, gérer les cours et améliorer nos services.</p>
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>Vous pouvez demander l’accès, la rectification ou la suppression de vos données à tout moment.</p>
      </section>
    ` },
    { page_name: 'contact', section_name: 'form_title', content_type: 'text', content: 'Nous contacter' },
    { page_name: 'contact', section_name: 'form_subtitle', content_type: 'text', content: 'Remplissez le formulaire pour être recontacté rapidement' },
    { page_name: 'contact', section_name: 'submit_label', content_type: 'text', content: 'Envoyer le message' },
  ];
  for (const e of entries) {
    const [item, created] = await Content.findOrCreate({ where: { page_name: e.page_name, section_name: e.section_name }, defaults: e });
    if (created) await item.update(e);
  }
}

export async function runSeedsIfEmpty(): Promise<void> {
  const tables = await Promise.all([
    BusinessInfo.count(),
    Service.count(),
    Content.count(),
    Media.count(),
  ]);
  const isEmpty = tables.every((c) => c === 0);
  if (!isEmpty) { console.log('[seed] Skipped: data exists'); return; }
  console.log('[seed] Starting initial data seeding');
  await seedBusinessInfo();
  await seedHeaderFooterContent();
  await seedHome();
  await seedServices();
  await seedAbout();
  await seedTestimonials();
  await seedUiSettings();
  console.log('[seed] Completed');
}

export async function runSeedsMissing(): Promise<void> {
  await ensureMediaFromUploads();
  await seedBusinessInfo();
  await seedHeaderFooterContent();
  await seedHome();
  await seedServices();
  await seedAbout();
  await seedTestimonials();
  await seedUiSettings();
}
