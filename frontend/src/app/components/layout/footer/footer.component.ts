import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Phone, Mail, MapPin, Clock, Car } from 'lucide-angular';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <footer class="footer">
      <div class="footer-main section-padding bg-gray-900 text-white">
        <div class="container-modern">
          <div class="footer-grid">
            <!-- Company Info -->
            <div class="footer-section">
              <div class="footer-brand">
                <div class="footer-logo" *ngIf="brandIcon">
                  <lucide-icon [name]="brandIcon" class="footer-logo-icon"></lucide-icon>
                </div>
                <div class="footer-brand-text">
                  <h3 class="footer-brand-title" *ngIf="brandTitle">{{ brandTitle }}</h3>
                  <p class="footer-brand-subtitle" *ngIf="brandSubtitle">{{ brandSubtitle }}</p>
                </div>
              </div>
              <p class="footer-description" *ngIf="brandDescription">{{ brandDescription }}</p>
            </div>

            <!-- Contact Info -->
            <div class="footer-section">
              <h4 class="footer-section-title">Nous contacter</h4>
              <div class="footer-contact">
                <div class="contact-item">
                  <lucide-icon [name]="iconAddress" class="contact-icon" *ngIf="iconAddress"></lucide-icon>
                  <span *ngIf="businessInfo?.address">{{ businessInfo?.address }}</span>
                </div>
                <div class="contact-item">
                  <lucide-icon [name]="iconPhone" class="contact-icon" *ngIf="iconPhone"></lucide-icon>
                  <a *ngIf="businessInfo?.phone" href="tel:{{ businessInfo?.phone }}" class="contact-link">{{ businessInfo?.phone }}</a>
                </div>
                <div class="contact-item">
                  <lucide-icon [name]="iconEmail" class="contact-icon" *ngIf="iconEmail"></lucide-icon>
                  <a *ngIf="businessInfo?.email" href="mailto:{{ businessInfo?.email }}" class="contact-link">{{ businessInfo?.email }}</a>
                </div>
                <div class="contact-item">
                  <lucide-icon [name]="iconHours" class="contact-icon" *ngIf="iconHours"></lucide-icon>
                  <span *ngIf="hoursText">{{ hoursText }}</span>
                </div>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="footer-section">
              <h4 class="footer-section-title">Navigation</h4>
              <nav class="footer-nav">
                <ul class="footer-nav-list">
                  <li><a routerLink="/" class="footer-nav-link">{{ navLabels.home }}</a></li>
                  <li><a routerLink="/services" class="footer-nav-link">{{ navLabels.services }}</a></li>
                  <li><a routerLink="/about" class="footer-nav-link">{{ navLabels.about }}</a></li>
                  <li><a routerLink="/contact" class="footer-nav-link">{{ navLabels.contact }}</a></li>
                </ul>
              </nav>
            </div>

            <!-- Services -->
            <div class="footer-section">
              <h4 class="footer-section-title">Nos services</h4>
              <ul class="footer-services-list">
                <li class="footer-service-item" *ngFor="let s of services">{{ s.title }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom bg-gray-800 text-gray-400">
        <div class="container-modern">
          <div class="footer-bottom-content">
            <p class="footer-copyright">
              © {{ currentYear }} <span *ngIf="businessInfo?.name">{{ businessInfo?.name }}</span>
            </p>
            <div class="footer-bottom-links">
              <a routerLink="/legal" class="footer-bottom-link" *ngIf="legalLabel">{{ legalLabel }}</a>
              <span class="footer-bottom-separator" *ngIf="legalLabel && privacyLabel">•</span>
              <a routerLink="/privacy" class="footer-bottom-link" *ngIf="privacyLabel">{{ privacyLabel }}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      @apply mt-auto;
    }
    
    .footer-main {
      @apply py-16;
    }
    
    .footer-grid {
      @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8;
    }
    
    .footer-section {
      @apply space-y-4;
    }
    
    .footer-brand {
      @apply flex items-center space-x-3;
    }
    
    .footer-logo {
      @apply w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center;
    }
    
    .footer-logo-icon {
      @apply w-6 h-6 text-white;
    }
    
    .footer-brand-title {
      @apply text-lg font-bold text-white;
    }
    
    .footer-brand-subtitle {
      @apply text-sm text-gray-400;
    }
    
    .footer-description {
      @apply text-gray-300 text-sm leading-relaxed;
    }
    
    .footer-section-title {
      @apply text-lg font-semibold text-white mb-4;
    }
    
    .footer-contact {
      @apply space-y-3;
    }
    
    .contact-item {
      @apply flex items-center space-x-3 text-gray-300;
    }
    
    .contact-icon {
      @apply w-5 h-5 text-accent-500 flex-shrink-0;
    }
    
    .contact-link {
      @apply text-gray-300 hover:text-accent-500 transition-colors duration-200;
      text-decoration: none;
    }
    
    .footer-nav-list {
      @apply space-y-2 list-none m-0 p-0;
    }
    
    .footer-nav-link {
      @apply text-gray-300 hover:text-accent-500 transition-colors duration-200;
      text-decoration: none;
      display: block;
      padding: 0.25rem 0;
    }
    
    .footer-services-list {
      @apply space-y-2 list-none m-0 p-0;
    }
    
    .footer-service-item {
      @apply text-gray-300 text-sm;
      padding: 0.25rem 0;
    }
    
    .footer-bottom {
      @apply py-4;
    }
    
    .footer-bottom-content {
      @apply flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0;
    }
    
    .footer-copyright {
      @apply text-sm;
      margin: 0;
    }
    
    .footer-bottom-links {
      @apply flex items-center space-x-2 text-sm;
    }
    
    .footer-bottom-link {
      @apply text-gray-400 hover:text-accent-500 transition-colors duration-200;
      text-decoration: none;
    }
    
    .footer-bottom-separator {
      @apply text-gray-500;
    }
    
    @media (max-width: 768px) {
      .footer-grid {
        @apply grid-cols-1 gap-6;
      }
      
      .footer-bottom-content {
        @apply flex-col space-y-4;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent implements OnInit {
  businessInfo: any = null;
  services: any[] = [];
  currentYear = new Date().getFullYear();
  brandTitle = '';
  brandSubtitle = '';
  brandDescription = '';
  navLabels: { home?: string; services?: string; about?: string; contact?: string } = {};
  legalLabel = '';
  privacyLabel = '';
  iconAddress = '';
  iconPhone = '';
  iconEmail = '';
  iconHours = '';
  brandIcon = '';
  hoursText = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getBusinessInfo().subscribe({ next: (info) => {
      this.businessInfo = info;
      const h = (info as any)?.opening_hours;
      if (h) this.hoursText = h;
    }, error: () => console.warn('[footer] business info missing') });
    this.api.getServices().subscribe({ next: (s) => this.services = s || [], error: () => console.warn('[footer] services missing') });
    this.api.getContent('footer','brand_title').subscribe({ next: (i) => this.brandTitle = i?.content || '', error: () => console.warn('[footer] brand_title missing') });
    this.api.getContent('footer','brand_subtitle').subscribe({ next: (i) => this.brandSubtitle = i?.content || '', error: () => console.warn('[footer] brand_subtitle missing') });
    this.api.getContent('footer','brand_description').subscribe({ next: (i) => this.brandDescription = i?.content || '', error: () => console.warn('[footer] brand_description missing') });
    this.api.getContent('footer','brand_icon').subscribe({ next: (i) => this.brandIcon = i?.content || '', error: () => {} });
    this.api.getContent('header','nav_home').subscribe({ next: (i) => this.navLabels.home = i?.content || '', error: () => {} });
    this.api.getContent('header','nav_services').subscribe({ next: (i) => this.navLabels.services = i?.content || '', error: () => {} });
    this.api.getContent('header','nav_about').subscribe({ next: (i) => this.navLabels.about = i?.content || '', error: () => {} });
    this.api.getContent('header','nav_contact').subscribe({ next: (i) => this.navLabels.contact = i?.content || '', error: () => {} });
    this.api.getContent('footer','legal_label').subscribe({ next: (i) => this.legalLabel = i?.content || '', error: () => {} });
    this.api.getContent('footer','privacy_label').subscribe({ next: (i) => this.privacyLabel = i?.content || '', error: () => {} });
    this.api.getContent('footer','icon_address').subscribe({ next: (i) => this.iconAddress = i?.content || '', error: () => {} });
    this.api.getContent('footer','icon_phone').subscribe({ next: (i) => this.iconPhone = i?.content || '', error: () => {} });
    this.api.getContent('footer','icon_email').subscribe({ next: (i) => this.iconEmail = i?.content || '', error: () => {} });
    this.api.getContent('footer','icon_hours').subscribe({ next: (i) => this.iconHours = i?.content || '', error: () => {} });
    this.api.getContent('footer','hours').subscribe({ next: (i) => { if (!this.hoursText) this.hoursText = i?.content || ''; }, error: () => {} });
  }
}
