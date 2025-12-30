import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Car, FileText, Award, Clock, Users, CheckCircle } from 'lucide-angular';
import { ContentService } from '../../services/content.service';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { FooterComponent } from '../../components/layout/footer/footer.component';
import { ServiceCardComponent } from '../../components/shared/service-card/service-card.component';
import { Service } from '../../models/content.models';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    HeaderComponent,
    FooterComponent,
    ServiceCardComponent
  ],
  template: `
    <app-header></app-header>
    
    <!-- Hero Section -->
    <section class="page-hero">
      <div class="container-modern text-center">
        <h1 class="page-title">Nos Formations</h1>
        <p class="page-subtitle">Découvrez nos offres adaptées à vos besoins</p>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="services-grid-section section-padding">
      <div class="container-modern">
        <div class="services-grid">
          <app-service-card 
            *ngFor="let service of services" 
            [service]="service"
            class="service-card-item">
          </app-service-card>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section section-padding bg-gray-50">
      <div class="container-modern">
        <div class="section-header text-center">
          <h2 class="section-title">Pourquoi choisir notre auto-école ?</h2>
          <p class="section-subtitle">Des milliers d'élèves nous font confiance</p>
        </div>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">
              <lucide-icon name="award" class="w-8 h-8"></lucide-icon>
            </div>
            <h3 class="feature-title">Taux de réussite élevé</h3>
            <p class="feature-description">95% de réussite grâce à notre méthode pédagogique éprouvée</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <lucide-icon name="users" class="w-8 h-8"></lucide-icon>
            </div>
            <h3 class="feature-title">Instructeurs certifiés</h3>
            <p class="feature-description">Des professionnels expérimentés et à l'écoute</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <lucide-icon name="clock" class="w-8 h-8"></lucide-icon>
            </div>
            <h3 class="feature-title">Horaires flexibles</h3>
            <p class="feature-description">Des créneaux adaptés à votre emploi du temps</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <lucide-icon name="check-circle" class="w-8 h-8"></lucide-icon>
            </div>
            <h3 class="feature-title">Formule tout inclus</h3>
            <p class="feature-description">Code de la route, leçons de conduite et examen inclus</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Vehicle Showcase -->
    <section class="vehicles-section section-padding">
      <div class="container-modern">
        <div class="section-header text-center">
          <h2 class="section-title">Nos véhicules</h2>
          <p class="section-subtitle">Des véhicules modernes et bien entretenus</p>
        </div>
        <div class="vehicles-grid">
          <div class="vehicle-item">
            <div class="vehicle-image">
              <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Voiture de formation" class="vehicle-img">
            </div>
            <h3 class="vehicle-title">Voitures</h3>
            <p class="vehicle-description">Dernières générations avec double commande</p>
          </div>
          <div class="vehicle-item">
            <div class="vehicle-image">
              <img src="https://images.unsplash.com/photo-1558980664-3a031cf67ea8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Moto de formation" class="vehicle-img">
            </div>
            <h3 class="vehicle-title">Motos</h3>
            <p class="vehicle-description">125cm³ et plus, équipement fourni</p>
          </div>
          <div class="vehicle-item">
            <div class="vehicle-image">
              <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Scooter de formation" class="vehicle-img">
            </div>
            <h3 class="vehicle-title">Scooters</h3>
            <p class="vehicle-description">Idéal pour la ville, facile à manœuvrer</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section section-padding bg-primary-600">
      <div class="container-modern text-center">
        <h2 class="cta-title">Prêt à commencer votre formation ?</h2>
        <p class="cta-subtitle">Contactez-nous pour planifier votre premier cours</p>
        <div class="cta-actions">
          <button class="btn-secondary">
            <lucide-icon name="phone" class="mr-2"></lucide-icon>
            01 42 58 96 32
          </button>
          <button routerLink="/contact" class="btn-primary">
            Prendre rendez-vous
            <lucide-icon name="chevron-right" class="ml-2"></lucide-icon>
          </button>
        </div>
      </div>
    </section>

    <app-footer></app-footer>
  `,
  styles: [`
    .page-hero {
      @apply bg-gradient-to-br from-primary-600 to-primary-700 text-white py-24;
    }
    
    .page-title {
      @apply text-4xl md:text-5xl font-bold mb-4;
    }
    
    .page-subtitle {
      @apply text-xl md:text-2xl text-primary-100 max-w-2xl mx-auto;
    }
    
    .services-grid-section {
      @apply py-16;
    }
    
    .services-grid {
      @apply grid md:grid-cols-2 lg:grid-cols-3 gap-8;
    }
    
    .service-card-item {
      @apply h-full;
    }
    
    .features-section {
      @apply py-16;
    }
    
    .section-header {
      @apply mb-12;
    }
    
    .section-title {
      @apply text-3xl md:text-4xl font-bold text-gray-900 mb-4;
    }
    
    .section-subtitle {
      @apply text-lg text-gray-600 max-w-2xl mx-auto;
    }
    
    .features-grid {
      @apply grid md:grid-cols-2 lg:grid-cols-4 gap-8;
    }
    
    .feature-item {
      @apply text-center;
    }
    
    .feature-icon {
      @apply w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600;
    }
    
    .feature-title {
      @apply text-xl font-semibold text-gray-900 mb-2;
    }
    
    .feature-description {
      @apply text-gray-600;
    }
    
    .vehicles-section {
      @apply py-16;
    }
    
    .vehicles-grid {
      @apply grid md:grid-cols-3 gap-8;
    }
    
    .vehicle-item {
      @apply text-center;
    }
    
    .vehicle-image {
      @apply mb-4 rounded-xl overflow-hidden shadow-lg;
    }
    
    .vehicle-img {
      @apply w-full h-48 object-cover transition-transform duration-300;
    }
    
    .vehicle-item:hover .vehicle-img {
      @apply scale-105;
    }
    
    .vehicle-title {
      @apply text-xl font-semibold text-gray-900 mb-2;
    }
    
    .vehicle-description {
      @apply text-gray-600;
    }
    
    .cta-section {
      @apply text-white;
    }
    
    .cta-title {
      @apply text-3xl md:text-4xl font-bold mb-4;
    }
    
    .cta-subtitle {
      @apply text-xl mb-8 max-w-2xl mx-auto;
    }
    
    .cta-actions {
      @apply flex flex-col sm:flex-row gap-4 justify-center;
    }
    
    @media (max-width: 768px) {
      .page-hero {
        @apply py-16;
      }
      
      .page-title {
        @apply text-3xl;
      }
      
      .page-subtitle {
        @apply text-lg;
      }
      
      .features-grid {
        @apply grid-cols-2 gap-6;
      }
      
      .vehicles-grid {
        @apply grid-cols-1 gap-8;
      }
    }
  `]
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.contentService.getServices().subscribe(services => {
      this.services = services;
    });
  }
}