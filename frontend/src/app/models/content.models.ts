// Content Models for Driving School Website

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  backgroundImage: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: 'permis-b' | 'permis-a' | 'code';
  icon: string;
  features: string[];
  price?: string;
  duration?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  image?: string;
  date?: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export interface AboutContent {
  title: string;
  description: string;
  story: string;
  timeline: TimelineItem[];
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface LearningStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  siret: string;
  insurance_info: string;
  opening_hours: string;
  social_links: Record<string, string>;
  logo_media_id?: number;
}