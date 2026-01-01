import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

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

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="service-card card-modern group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl" (click)="openContact()">
      <div class="service-header relative overflow-hidden">
        <div class="service-image-wrapper" *ngIf="imageUrl">
          <img 
            [src]="imageUrl" 
            [alt]="service.title"
            class="service-image w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110">
          <div class="service-image-overlay"></div>
        </div>
        
        <div class="service-category-badge absolute top-4 right-4" *ngIf="badgeLabel">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-primary-700">
            <lucide-icon [name]="badgeIcon" class="w-3 h-3 mr-1" *ngIf="badgeIcon"></lucide-icon>
            {{ badgeLabel }}
          </span>
        </div>
      </div>
      
      <div class="service-content p-6">
        <div class="service-icon-wrapper mb-4">
          <lucide-icon [name]="getIconName()" class="service-icon w-8 h-8"></lucide-icon>
        </div>
        
        <h3 class="service-title text-xl font-bold text-gray-900 mb-3">
          {{ service.title }}
        </h3>
        
        <p class="service-description text-gray-600 mb-4 leading-relaxed">
          {{ service.description }}
        </p>
        
        <ul class="service-features space-y-2 mb-6">
          <li *ngFor="let feature of service.features" class="feature-item flex items-center text-sm text-gray-700">
            <lucide-icon name="check" class="feature-icon w-4 h-4 text-accent-500 mr-3 flex-shrink-0"></lucide-icon>
            <span>{{ feature }}</span>
          </li>
        </ul>
        
        <div class="service-footer flex items-center justify-between">
          <div class="service-pricing" *ngIf="service.price || service.duration">
            <div *ngIf="service.price" class="service-price text-2xl font-bold text-accent-600">
              {{ service.price }}
            </div>
            <div *ngIf="service.duration" class="service-duration text-sm text-gray-500">
              {{ service.duration }}
            </div>
          </div>
          
          <button type="button" class="service-cta btn-primary px-6 py-2 text-sm font-semibold" *ngIf="ctaLabel" (click)="openContact($event)">
            {{ ctaLabel }}
            <lucide-icon name="chevron-right" class="w-4 h-4 ml-2"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .service-card {
      @apply bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden;
      transition: all 0.3s ease;
    }
    
    .service-header {
      @apply relative;
    }
    
    .service-image-wrapper {
      @apply relative overflow-hidden;
    }
    
    .service-image {
      @apply w-full h-48 object-cover transition-transform duration-300;
    }
    
    .service-image-overlay {
      @apply absolute inset-0 bg-gradient-to-t from-black/20 to-transparent;
    }
    
    .service-category-badge {
      @apply z-10;
    }
    
    .service-icon-wrapper {
      @apply w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center;
    }
    
    .service-icon {
      @apply text-white;
    }
    
    .service-content {
      @apply p-6 flex-1 flex flex-col;
    }
    
    .service-title {
      @apply text-xl font-bold text-gray-900;
    }
    
    .service-description {
      @apply text-gray-600 flex-1;
    }
    
    .service-features {
      @apply space-y-2;
    }
    
    .feature-item {
      @apply flex items-center text-sm text-gray-700;
    }
    
    .feature-icon {
      @apply text-orange-500;
    }
    
    .service-footer {
      @apply flex items-center justify-between pt-4 border-t border-gray-100;
    }
    
    .service-price {
      @apply text-2xl font-bold text-orange-600;
    }
    
    .service-duration {
      @apply text-sm text-gray-500;
    }
    
    .service-cta {
      @apply bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5;
    }
    
    .service-card:hover .service-image {
      transform: scale(1.1);
    }
    
    .service-card:hover .service-icon-wrapper {
      @apply bg-gradient-to-br from-orange-500 to-orange-600;
      transform: scale(1.05);
    }
    
    .service-card:hover .service-cta {
      @apply bg-orange-600;
    }
  `]
})
export class ServiceCardComponent {
  @Input() service!: Service;
  imageUrl = '';
  ctaLabel = '';
  badgeLabel = '';
  badgeIcon = '';

  constructor(public api: ApiService, private router: Router) {}

  openContact(event?: Event) {
    event?.stopPropagation();
    this.router.navigate(['/contact'], { queryParams: { service: this.service?.title || '' } });
  }

  getIconName(): string {
    const iconMap: Record<string, string> = {
      'car': 'car',
      'file-text': 'file-text',
      'award': 'award',
      'calendar': 'calendar',
      'users': 'users'
    };
    return iconMap[this.service.icon] || 'car';
  }

  getCategoryIcon(): string {
    const categoryIconMap: Record<string, string> = {
      'permis-b': 'car',
      'permis-a': 'car', // fallback
      'code': 'file-text'
    };
    return categoryIconMap[this.service.category] || 'car';
  }

  getCategoryLabel(): string {
    const categoryLabelMap: Record<string, string> = {
      'permis-b': 'Permis B',
      'permis-a': 'Permis A',
      'code': 'Code'
    };
    return categoryLabelMap[this.service.category] || 'Formation';
  }

  ngOnInit() {
    const byId = (this.service as any)?.image_media_id;
    if (byId) {
      this.api.getMediaById(byId).subscribe({ next: (m) => this.imageUrl = this.api.resolveMediaUrl(m), error: () => {} });
      return;
    }
    const raw = (this.service as any)?.image_url || (this.service as any)?.image;
    if (raw) this.imageUrl = this.api.resolveMediaUrl({ url: raw });
    this.api.getContent('service_card','cta_label').subscribe({ next: (i) => this.ctaLabel = i?.content || '', error: () => {} });
    this.api.getContent('service_card','badge').subscribe({ next: (i) => {
      try {
        const map = JSON.parse(i?.content || '{}');
        const key = (this.service?.category || '').toLowerCase();
        const cfg = map[key];
        if (cfg) { this.badgeLabel = cfg.label || ''; this.badgeIcon = cfg.icon || ''; }
        else { this.badgeLabel = ''; this.badgeIcon = ''; }
      } catch { this.badgeLabel = ''; this.badgeIcon = ''; }
    }, error: () => {} });
  }
}
