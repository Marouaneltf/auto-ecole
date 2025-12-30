import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Phone, Mail, MapPin, Clock, Car } from 'lucide-angular';
import { ContentService } from '../../../services/content.service';
import { ContactInfo } from '../../../models/content.models';

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
                <div class="footer-logo">
                  <lucide-icon name="car" class="footer-logo-icon"></lucide-icon>
                </div>
                <div class="footer-brand-text">
                  <h3 class="footer-brand-title">Auto-École CAR 18ème</h3>
                  <p class="footer-brand-subtitle">Votre réussite, notre priorité</p>
                </div>
              </div>
              <p class="footer-description">
                Auto-école professionnelle au cœur du 18e arrondissement de Paris. 
                Plus de 5000 permis délivrés avec un taux de réussite exceptionnel.
              </p>
            </div>

            <!-- Contact Info -->
            <div class="footer-section">
              <h4 class="footer-section-title">Nous contacter</h4>
              <div class="footer-contact">
                <div class="contact-item">
                  <lucide-icon name="map-pin" class="contact-icon"></lucide-icon>
                  <span>{{ contactInfo?.address || '6, rue Joseph Dijon, 75018 Paris' }}</span>
                </div>
                <div class="contact-item">
                  <lucide-icon name="phone" class="contact-icon"></lucide-icon>
                  <a href="tel:{{ contactInfo?.phone || '0142589632' }}" class="contact-link">
                    {{ contactInfo?.phone || '01 42 58 96 32' }}
                  </a>
                </div>
                <div class="contact-item">
                  <lucide-icon name="mail" class="contact-icon"></lucide-icon>
                  <a href="mailto:{{ contactInfo?.email || 'contact@autoecole18.fr' }}" class="contact-link">
                    {{ contactInfo?.email || 'contact@autoecole18.fr' }}
                  </a>
                </div>
                <div class="contact-item">
                  <lucide-icon name="clock" class="contact-icon"></lucide-icon>
                  <span>{{ contactInfo?.hours || 'Lun-Ven: 8h-19h, Sam: 9h-17h' }}</span>
                </div>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="footer-section">
              <h4 class="footer-section-title">Navigation</h4>
              <nav class="footer-nav">
                <ul class="footer-nav-list">
                  <li><a routerLink="/" class="footer-nav-link">Accueil</a></li>
                  <li><a routerLink="/services" class="footer-nav-link">Services</a></li>
                  <li><a routerLink="/about" class="footer-nav-link">À propos</a></li>
                  <li><a routerLink="/contact" class="footer-nav-link">Contact</a></li>
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
              © {{ currentYear }} Auto-École CAR 18ème. Tous droits réservés.
            </p>
            <div class="footer-bottom-links">
              <a routerLink="/legal" class="footer-bottom-link">Mentions légales</a>
              <span class="footer-bottom-separator">•</span>
              <a routerLink="/privacy" class="footer-bottom-link">Politique de confidentialité</a>
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
  contactInfo: ContactInfo | null = null;
  services: any[] = [];
  currentYear = new Date().getFullYear();

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.contentService.getContactInfo().subscribe(info => {
      this.contactInfo = info;
    });
    this.contentService.getServices().subscribe(s => this.services = s);
  }
}
