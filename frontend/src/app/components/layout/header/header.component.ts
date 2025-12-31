import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, Menu, X, Phone, Car } from 'lucide-angular';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <header class="header" [class.scrolled]="isScrolled">
      <div class="container-modern">
        <div class="header-content">
          <!-- Logo -->
          <div class="logo">
            <a routerLink="/" class="logo-link">
              <div class="logo-icon" *ngIf="!logoUrl && logoIcon">
                <lucide-icon [name]="logoIcon" class="car-icon"></lucide-icon>
              </div>
              <div class="logo-image" *ngIf="logoUrl">
                <img [src]="logoUrl" alt="Logo" class="logo-img" />
              </div>
              <div class="logo-text">
                <span class="logo-title" *ngIf="businessInfo?.name">{{ businessInfo?.name }}</span>
                <span class="logo-subtitle" *ngIf="subtitle">{{ subtitle }}</span>
              </div>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <nav class="desktop-nav">
            <ul class="nav-list">
              <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link">{{ navLabels.home }}</a></li>
              <li><a routerLink="/services" routerLinkActive="active" class="nav-link">{{ navLabels.services }}</a></li>
              <li><a routerLink="/about" routerLinkActive="active" class="nav-link">{{ navLabels.about }}</a></li>
              <li><a routerLink="/contact" routerLinkActive="active" class="nav-link">{{ navLabels.contact }}</a></li>
            </ul>
          </nav>

          <!-- Desktop CTA -->
          <div class="desktop-cta">
            <a *ngIf="businessInfo?.phone" href="tel:{{ businessInfo?.phone }}" class="phone-link">
              <lucide-icon [name]="phoneIcon" class="phone-icon" *ngIf="phoneIcon"></lucide-icon>
              <span>{{ businessInfo?.phone }}</span>
            </a>
            <a routerLink="/contact" class="btn-primary" *ngIf="ctaPrimaryLabel">{{ ctaPrimaryLabel }}</a>
          </div>

          <!-- Mobile Menu Toggle -->
          <button 
            class="mobile-menu-toggle"
            (click)="toggleMobileMenu()"
            [class.active]="isMobileMenuOpen"
          >
            <lucide-icon [name]="menuIcon" class="menu-icon" *ngIf="!isMobileMenuOpen && menuIcon"></lucide-icon>
            <lucide-icon [name]="closeIcon" class="menu-icon" *ngIf="isMobileMenuOpen && closeIcon"></lucide-icon>
          </button>
        </div>

        <!-- Mobile Navigation -->
        <div class="mobile-nav" [class.open]="isMobileMenuOpen">
          <div class="mobile-nav-content">
            <nav class="mobile-nav-menu">
              <ul class="mobile-nav-list">
                <li><a routerLink="/" (click)="closeMobileMenu()" class="mobile-nav-link">{{ navLabels.home }}</a></li>
                <li><a routerLink="/services" (click)="closeMobileMenu()" class="mobile-nav-link">{{ navLabels.services }}</a></li>
                <li><a routerLink="/about" (click)="closeMobileMenu()" class="mobile-nav-link">{{ navLabels.about }}</a></li>
                <li><a routerLink="/contact" (click)="closeMobileMenu()" class="mobile-nav-link">{{ navLabels.contact }}</a></li>
              </ul>
            </nav>
            <div class="mobile-cta">
              <a *ngIf="businessInfo?.phone && ctaMobileLabel" href="tel:{{ businessInfo?.phone }}" class="btn-primary w-full">
                <lucide-icon [name]="phoneIcon" class="mr-2" *ngIf="phoneIcon"></lucide-icon>
                {{ ctaMobileLabel }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      @apply fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm transition-all duration-300;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .header.scrolled {
      @apply bg-white shadow-lg;
    }
    
    .header-content {
      @apply flex items-center justify-between py-4;
    }
    
    .logo {
      @apply flex-shrink-0;
    }
    
    .logo-link {
      @apply flex items-center space-x-3 no-underline;
    }
    
    .logo-icon {
      @apply w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center;
    }
    
    .car-icon {
      @apply w-6 h-6 text-white;
    }
    
    .logo-text {
      @apply flex flex-col;
    }
    
    .logo-title {
      @apply text-xl font-bold text-gray-900;
    }
    
    .logo-subtitle {
      @apply text-sm text-gray-600;
    }
    
    .desktop-nav {
      @apply hidden lg:flex;
    }
    
    .nav-list {
      @apply flex space-x-8 list-none m-0 p-0;
    }
    
    .nav-link {
      @apply text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 relative;
      text-decoration: none;
      
      &:after {
        content: '';
        @apply absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300;
      }
      
      &:hover:after,
      &.active:after {
        @apply w-full;
      }
    }
    
    .desktop-cta {
      @apply hidden lg:flex items-center space-x-4;
    }
    
    .phone-link {
      @apply flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200;
      text-decoration: none;
    }
    
    .phone-icon {
      @apply w-5 h-5;
    }
    
    .mobile-menu-toggle {
      @apply lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200;
      background: none;
      border: none;
      cursor: pointer;
    }
    
    .menu-icon {
      @apply w-6 h-6 text-gray-700;
    }
    
    .mobile-nav {
      @apply lg:hidden fixed top-0 left-0 right-0 h-0 bg-white overflow-hidden transition-all duration-300;
      z-index: 40;
    }
    
    .mobile-nav.open {
      @apply h-screen pt-20;
    }
    
    .mobile-nav-content {
      @apply p-6;
    }
    
    .mobile-nav-menu {
      @apply mb-8;
    }
    
    .mobile-nav-list {
      @apply space-y-4 list-none m-0 p-0;
    }
    
    .mobile-nav-link {
      @apply block text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors duration-200 py-3;
      text-decoration: none;
    }
    
    .mobile-cta {
      @apply space-y-4;
    }
    
    @media (max-width: 1024px) {
      .mobile-nav.open {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }
    }
    .logo-image{display:flex; align-items:center; justify-content:center; width:42px; height:42px; border-radius:8px; overflow:hidden; background:rgba(255,255,255,0.9); border:1px solid rgba(17,24,39,0.08)}
    .logo-img{width:100%; height:100%; object-fit:contain}
  `]
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  businessInfo: any = null;
  navLabels: { home?: string; services?: string; about?: string; contact?: string } = {};
  subtitle = '';
  logoUrl = '';
  logoIcon = '';
  phoneIcon = 'phone';
  menuIcon = 'menu';
  closeIcon = 'x';
  ctaPrimaryLabel = '';
  ctaMobileLabel = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll.bind(this));
    this.api.getBusinessInfo().subscribe({ next: (data) => {
      this.businessInfo = data;
      const id = (data as any)?.logo_media_id;
      if (id) this.api.getMediaById(id).subscribe({ next: (m) => this.logoUrl = this.api.resolveMediaUrl(m), error: () => {} });
    }, error: () => console.warn('[header] business info missing') });
    this.api.getContent('header','nav_home').subscribe({ next: (i) => this.navLabels.home = i?.content || '', error: () => console.warn('[header] nav_home missing') });
    this.api.getContent('header','nav_services').subscribe({ next: (i) => this.navLabels.services = i?.content || '', error: () => console.warn('[header] nav_services missing') });
    this.api.getContent('header','nav_about').subscribe({ next: (i) => this.navLabels.about = i?.content || '', error: () => console.warn('[header] nav_about missing') });
    this.api.getContent('header','nav_contact').subscribe({ next: (i) => this.navLabels.contact = i?.content || '', error: () => console.warn('[header] nav_contact missing') });
    this.api.getContent('header','subtitle').subscribe({ next: (i) => this.subtitle = i?.content || '', error: () => {} });
    this.api.getContent('header','cta_primary_label').subscribe({ next: (i) => this.ctaPrimaryLabel = i?.content || '', error: () => {} });
    this.api.getContent('header','cta_mobile_label').subscribe({ next: (i) => this.ctaMobileLabel = i?.content || '', error: () => {} });
    this.api.getContent('header','logo_icon').subscribe({ next: (i) => this.logoIcon = i?.content || '', error: () => {} });
    this.api.getContent('header','menu_icon').subscribe({ next: (i) => this.menuIcon = i?.content || 'menu', error: () => {} });
    this.api.getContent('header','close_icon').subscribe({ next: (i) => this.closeIcon = i?.content || 'x', error: () => {} });
    this.phoneIcon = 'phone';
    setTimeout(() => this.updateHeaderHeightVar(), 0);
    window.addEventListener('resize', () => this.updateHeaderHeightVar());
  }

  onScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  private updateHeaderHeightVar() {
    const el = document.querySelector('header.header') as HTMLElement | null;
    if (el) {
      const h = el.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${h}px`);
    }
  }
}
