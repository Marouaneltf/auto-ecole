import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Car, FileText, Award, Clock, Users, CheckCircle } from 'lucide-angular';
import { ApiService } from '../../services/api.service';
import { ServiceCardComponent } from '../../components/shared/service-card/service-card.component';
import { Service as FrontService } from '../../models/content.models';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    ServiceCardComponent
  ],
  template: `
    <!-- Hero Section -->
    <section class="page-hero">
      <div class="container-modern text-center">
        <h1 class="page-title" *ngIf="pageTitle">{{ pageTitle }}</h1>
        <p class="page-subtitle" *ngIf="pageSubtitle">{{ pageSubtitle }}</p>
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
    <section class="features-section section-padding bg-gray-50" *ngIf="features?.length">
      <div class="container-modern">
        <div class="section-header text-center">
          <h2 class="section-title" *ngIf="featuresTitle">{{ featuresTitle }}</h2>
          <p class="section-subtitle" *ngIf="featuresSubtitle">{{ featuresSubtitle }}</p>
        </div>
        <div class="features-grid">
          <div class="feature-item" *ngFor="let f of features">
            <div class="feature-icon">
              <lucide-icon [name]="f.icon" class="w-8 h-8"></lucide-icon>
            </div>
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-description">{{ f.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Vehicle Showcase -->
    <section class="vehicles-section section-padding" *ngIf="vehicles?.length">
      <div class="container-modern">
        <div class="section-header text-center">
          <h2 class="section-title" *ngIf="vehiclesTitle">{{ vehiclesTitle }}</h2>
          <p class="section-subtitle" *ngIf="vehiclesSubtitle">{{ vehiclesSubtitle }}</p>
        </div>
        <div class="vehicles-grid">
          <div class="vehicle-item" *ngFor="let v of vehicles">
            <div class="vehicle-image" *ngIf="v.image_url">
              <img [src]="v.image_url" [alt]="v.title" class="vehicle-img">
            </div>
            <h3 class="vehicle-title">{{ v.title }}</h3>
            <p class="vehicle-description">{{ v.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section section-padding bg-primary-600" *ngIf="ctaLabel || businessPhone">
      <div class="container-modern text-center">
        <h2 class="cta-title" *ngIf="ctaTitle">{{ ctaTitle }}</h2>
        <p class="cta-subtitle" *ngIf="ctaSubtitle">{{ ctaSubtitle }}</p>
        <div class="cta-actions">
          <button class="btn-secondary" *ngIf="businessPhone">
            <lucide-icon name="phone" class="mr-2"></lucide-icon>
            {{ businessPhone }}
          </button>
          <button routerLink="/contact" class="btn-primary" *ngIf="ctaLabel">
            {{ ctaLabel }}
            <lucide-icon name="chevron-right" class="ml-2"></lucide-icon>
          </button>
        </div>
      </div>
    </section>

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
  services: FrontService[] = [];
  pageTitle = '';
  pageSubtitle = '';
  featuresTitle = '';
  featuresSubtitle = '';
  features: Array<{ icon: string; title: string; description: string }> = [];
  vehiclesTitle = '';
  vehiclesSubtitle = '';
  vehicles: Array<{ title: string; description: string; image_url?: string }> = [];
  ctaTitle = '';
  ctaSubtitle = '';
  ctaLabel = '';
  businessPhone = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getServices().subscribe({
      next: (list) => {
        this.services = (list || []).map((s: any) => ({
          id: String(s.id ?? s.slug ?? ''),
          title: String(s.name ?? ''),
          description: String(s.description ?? ''),
          category: 'permis-b',
          icon: String(s.icon ?? 'car'),
          features: [],
          price: s.price ? `${s.price}€` : undefined,
          duration: s.duration || undefined,
          image_media_id: s.image_media_id ?? undefined,
          image_url: s.image_url ?? undefined
        }));
      },
      error: () => { console.warn('[services] cannot load services'); this.services = []; }
    });

    this.api.getContent('services','page_title').subscribe({ next: (i) => this.pageTitle = i?.content || '', error: () => {} });
    this.api.getContent('services','page_subtitle').subscribe({ next: (i) => this.pageSubtitle = i?.content || '', error: () => {} });
    this.api.getContent('services','features_title').subscribe({ next: (i) => this.featuresTitle = i?.content || '', error: () => {} });
    this.api.getContent('services','features_subtitle').subscribe({ next: (i) => this.featuresSubtitle = i?.content || '', error: () => {} });
    this.api.getContent('services','features').subscribe({ next: (i) => { try { const arr = JSON.parse(i?.content || '[]'); this.features = Array.isArray(arr) ? arr : []; } catch { this.features = []; } }, error: () => {} });
    this.api.getContent('services','vehicles_title').subscribe({ next: (i) => this.vehiclesTitle = i?.content || '', error: () => {} });
    this.api.getContent('services','vehicles_subtitle').subscribe({ next: (i) => this.vehiclesSubtitle = i?.content || '', error: () => {} });
    this.api.getContent('services','vehicles').subscribe({ next: (i) => {
      try {
        const arr = JSON.parse(i?.content || '[]');
        const list = Array.isArray(arr) ? arr : [];
        this.vehicles = list.map((v: any) => ({ title: v.title, description: v.description, image_url: '' }));
        list.forEach((v: any, idx: number) => {
          const id = Number(v.image);
          if (!isNaN(id) && id > 0) {
            this.api.getMediaById(id).subscribe({ next: (m) => this.vehicles[idx].image_url = this.api.resolveMediaUrl(m), error: () => {} });
          } else if (typeof v.image === 'string') {
            this.vehicles[idx].image_url = this.api.resolveMediaUrl({ url: v.image });
          }
        });
      } catch { this.vehicles = []; }
    }, error: () => {} });
    this.api.getContent('services','cta_title').subscribe({ next: (i) => this.ctaTitle = i?.content || '', error: () => {} });
    this.api.getContent('services','cta_subtitle').subscribe({ next: (i) => this.ctaSubtitle = i?.content || '', error: () => {} });
    this.api.getContent('services','cta_label').subscribe({ next: (i) => this.ctaLabel = i?.content || '', error: () => {} });
    this.api.getBusinessInfo().subscribe({ next: (info) => this.businessPhone = info?.phone || '', error: () => {} });
  }
}
