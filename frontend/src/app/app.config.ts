import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Phone, Mail, MapPin, Clock, Car, Star, Award, FileText, Check, Menu, X, ChevronRight, ChevronLeft, Users, Shield, TrendingUp, Heart, BookOpen, Calendar, MessageCircle, Send, User, AlertCircle, CheckCircle } from 'lucide-angular';
import { ADMIN_PAGES, AdminPageMeta } from './admin/admin-registry.token';

import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimations(),
    importProvidersFrom(LucideAngularModule.pick({ Phone, Mail, MapPin, Clock, Car, Star, Award, FileText, Check, Menu, X, ChevronRight, ChevronLeft, Users, Shield, TrendingUp, Heart, BookOpen, Calendar, MessageCircle, Send, User, AlertCircle, CheckCircle })),
    { provide: ADMIN_PAGES, useValue: [
      { key: 'header', title: 'En-tête', description: 'Logo, nom, nav.', load: () => import('./pages/admin/header/admin-header.component').then(m => m.AdminHeaderComponent) },
      { key: 'home-hero', title: 'Accueil — Hero', description: 'Titre, sous-titre, image.', load: () => import('./pages/admin/home-hero/admin-home-hero.component').then(m => m.AdminHomeHeroComponent) },
      { key: 'home-services', title: 'Accueil — Services', description: 'Intro et CTA.', load: () => import('./pages/admin/home-services/admin-home-services.component').then(m => m.AdminHomeServicesComponent) },
      { key: 'home-about', title: 'Accueil — À propos', description: 'Texte et image.', load: () => import('./pages/admin/home-about/admin-home-about.component').then(m => m.AdminHomeAboutComponent) },
      { key: 'about', title: 'Page À propos', description: 'Histoire et image.', load: () => import('./pages/admin/about/admin-about.component').then(m => m.AdminAboutComponent) },
      { key: 'footer', title: 'Pied de page', description: 'Horaires, réseaux.', load: () => import('./pages/admin/footer/admin-footer.component').then(m => m.AdminFooterComponent) },
      { key: 'contact-info', title: 'Coordonnées', description: 'Adresse, téléphone, email.', load: () => import('./pages/admin/contact-info/admin-contact-info.component').then(m => m.AdminContactInfoComponent) },
      { key: 'media', title: 'Médiathèque', description: 'Gérer les images.', load: () => import('./pages/admin/media/media-library.component').then(m => m.MediaLibraryComponent) },
      { key: 'services', title: 'Services', description: 'Offres et catégories.', load: () => import('./pages/admin/services/admin-services.component').then(m => m.AdminServicesComponent) },
      { key: 'ui-settings', title: 'UI & Branding', description: 'Couleurs, identité.', load: () => import('./pages/admin/ui-settings/ui-settings.component').then(m => m.UiSettingsComponent) },
    ] as AdminPageMeta[] }
  ]
};
