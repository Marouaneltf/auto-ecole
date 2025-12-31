import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/admin/login/login.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AboutComponent } from './pages/about/about.component';
import { LegalComponent } from './pages/legal/legal.component';
import { authGuard } from './auth.guard';
import { AdminPageHostComponent } from './pages/admin/admin-page-host/admin-page-host.component';
import { AdminLayoutComponent } from './pages/admin/layout/admin-layout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'admin/login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canMatch: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'dashboard/:pageKey', component: AdminPageHostComponent },
      { path: 'services', loadComponent: () => import('./pages/admin/services/services-list.component').then(m => m.AdminServicesListComponent) },
      { path: 'services/new', loadComponent: () => import('./pages/admin/services/service-edit.component').then(m => m.AdminServiceEditComponent) },
      { path: 'services/:id', loadComponent: () => import('./pages/admin/services/service-edit.component').then(m => m.AdminServiceEditComponent) },
      { path: 'media', loadComponent: () => import('./pages/admin/media/media-library.component').then(m => m.MediaLibraryComponent) },
      { path: 'header', loadComponent: () => import('./pages/admin/header/admin-header.component').then(m => m.AdminHeaderComponent) },
      { path: 'footer', loadComponent: () => import('./pages/admin/footer/admin-footer.component').then(m => m.AdminFooterComponent) },
      { path: 'about', loadComponent: () => import('./pages/admin/about/admin-about.component').then(m => m.AdminAboutComponent) },
      { path: 'home', loadComponent: () => import('./pages/admin/home-about/admin-home-about.component').then(m => m.AdminHomeAboutComponent) },
      { path: 'home-hero', loadComponent: () => import('./pages/admin/home-hero/admin-home-hero.component').then(m => m.AdminHomeHeroComponent) },
      { path: 'home-services', loadComponent: () => import('./pages/admin/home-services/admin-home-services.component').then(m => m.AdminHomeServicesComponent) },
      { path: 'pages/home', loadComponent: () => import('./pages/admin/home-page/admin-home-page.component').then(m => m.AdminHomePageComponent) },
      { path: 'pages/services', loadComponent: () => import('./pages/admin/services-page/admin-services-page.component').then(m => m.AdminServicesPageComponent) },
      { path: 'pages/about', loadComponent: () => import('./pages/admin/about-page/admin-about-page.component').then(m => m.AdminAboutPageComponent) },
      { path: 'pages/legal', loadComponent: () => import('./pages/admin/legal-page/admin-legal-page.component').then(m => m.AdminLegalPageComponent) },
      { path: 'contact', loadComponent: () => import('./pages/admin/contact-info/admin-contact-info.component').then(m => m.AdminContactInfoComponent) },
      { path: 'ui', loadComponent: () => import('./pages/admin/ui-settings/ui-settings.component').then(m => m.UiSettingsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
