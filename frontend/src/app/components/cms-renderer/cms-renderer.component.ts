import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsComponent } from '../../services/cms.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cms-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngSwitch]="component.type" class="cms-component">
      
      <!-- Hero Component -->
      <section *ngSwitchCase="'hero'" class="hero-section" [style.background-image]="'url(' + getField('background_image') + ')'">
        <div class="container">
          <h1>{{ getField('title') }}</h1>
          <p>{{ getField('subtitle') }}</p>
          <a *ngIf="getField('cta_text')" [href]="getField('cta_link')" class="btn btn-primary">
            {{ getField('cta_text') }}
          </a>
        </div>
      </section>

      <!-- Text Block -->
      <section *ngSwitchCase="'text-block'" class="text-block-section" [class]="'text-' + getField('alignment')">
        <div class="container">
          <div class="content" [innerHTML]="getField('content')"></div>
        </div>
      </section>

      <!-- Image + Text -->
      <section *ngSwitchCase="'image-text'" class="image-text-section" [class.reverse]="getField('image_position') === 'right'">
        <div class="container grid">
          <div class="text">
            <h2>{{ getField('title') }}</h2>
            <div class="content" [innerHTML]="getField('content')"></div>
          </div>
          <div class="image" *ngIf="getField('image')">
            <img [src]="getMediaUrl(getField('image'))" [alt]="getField('title')">
          </div>
        </div>
      </section>

      <!-- Services List -->
      <section *ngSwitchCase="'services-list'" class="services-section">
        <div class="container">
          <h2>{{ getField('title') || 'Our Services' }}</h2>
          <div class="services-grid">
            <div class="service-card" *ngFor="let service of services">
              <div class="service-icon">{{ service.icon }}</div>
              <h3>{{ service.name }}</h3>
              <p>{{ service.description }}</p>
              <div class="service-price">{{ service.price }} €</div>
              <div class="service-duration">{{ service.duration }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section *ngSwitchCase="'cta'" class="cta-section">
        <div class="container">
          <h2>{{ getField('title') }}</h2>
          <p>{{ getField('description') }}</p>
          <a *ngIf="getField('button_text')" [href]="getField('button_link')" class="btn btn-accent">
            {{ getField('button_text') }}
          </a>
        </div>
      </section>

      <!-- Opening Hours -->
      <section *ngSwitchCase="'opening-hours'" class="opening-hours-section">
        <div class="container">
          <h2>{{ getField('title') || 'Opening Hours' }}</h2>
          <div class="hours-grid">
            <div class="hours-item" *ngFor="let day of businessInfo?.hours">
              <span class="day">{{ day.day }}</span>
              <span class="hours">{{ day.hours }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Gallery -->
      <section *ngSwitchCase="'gallery'" class="gallery-section">
        <div class="container">
          <div class="gallery-grid" [class.carousel]="getField('layout') === 'carousel'">
            <div class="gallery-item" *ngFor="let image of galleryImages">
              <img [src]="image" alt="Gallery image">
            </div>
          </div>
        </div>
      </section>

      <!-- Fallback -->
      <div *ngSwitchDefault class="unknown-component">
        <p>Unknown component type: {{ component.type }}</p>
      </div>
    </div>
  `,
  styles: [`
    .cms-component { margin-bottom: 60px; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    
    /* Hero Section */
    .hero-section {
      height: 500px;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      text-align: center;
      position: relative;
    }
    
    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }
    
    .hero-section .container {
      position: relative;
      z-index: 2;
      width: 100%;
    }
    
    .hero-section h1 {
      font-size: 3.5rem;
      margin-bottom: 20px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      font-weight: 700;
    }
    
    .hero-section p {
      font-size: 1.3rem;
      margin-bottom: 30px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Text Block */
    .text-block-section {
      padding: 60px 0;
    }
    
    .text-block-section.text-center { text-align: center; }
    .text-block-section.text-right { text-align: right; }
    
    .content {
      font-size: 1.1rem;
      line-height: 1.7;
      color: #374151;
    }

    /* Image Text */
    .image-text-section {
      padding: 60px 0;
    }
    
    .image-text-section .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
    }
    
    .image-text-section.reverse .grid {
      grid-template-columns: 1fr 1fr;
      direction: rtl;
    }
    
    .image-text-section.reverse .text {
      direction: ltr;
    }
    
    .image-text-section .text h2 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      color: #1f2937;
    }
    
    .image-text-section .image img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    /* Services List */
    .services-section {
      padding: 80px 0;
      background: #f9fafb;
    }
    
    .services-section h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 50px;
      color: #1f2937;
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
    
    .service-card {
      background: white;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }
    
    .service-card:hover {
      transform: translateY(-5px);
    }
    
    .service-icon {
      font-size: 3rem;
      margin-bottom: 20px;
    }
    
    .service-card h3 {
      font-size: 1.5rem;
      margin-bottom: 15px;
      color: #1f2937;
    }
    
    .service-card p {
      color: #6b7280;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    
    .service-price {
      font-size: 1.8rem;
      font-weight: 700;
      color: #059669;
      margin-bottom: 5px;
    }
    
    .service-duration {
      color: #6b7280;
      font-size: 0.9rem;
    }

    /* Call to Action */
    .cta-section {
      padding: 80px 0;
      text-align: center;
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
    }
    
    .cta-section h2 {
      font-size: 2.5rem;
      margin-bottom: 20px;
    }
    
    .cta-section p {
      font-size: 1.2rem;
      margin-bottom: 30px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      opacity: 0.9;
    }

    /* Opening Hours */
    .opening-hours-section {
      padding: 60px 0;
      background: white;
    }
    
    .opening-hours-section h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 40px;
      color: #1f2937;
    }
    
    .hours-grid {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .hours-item {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .hours-item:last-child {
      border-bottom: none;
    }
    
    .day {
      font-weight: 600;
      color: #1f2937;
    }
    
    .hours {
      color: #6b7280;
    }

    /* Gallery */
    .gallery-section {
      padding: 60px 0;
    }
    
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .gallery-grid.carousel {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      gap: 20px;
      padding: 20px 0;
    }
    
    .gallery-item {
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      aspect-ratio: 1;
    }
    
    .gallery-grid.carousel .gallery-item {
      min-width: 300px;
      scroll-snap-align: start;
    }
    
    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .gallery-item:hover img {
      transform: scale(1.05);
    }

    /* Buttons */
    .btn {
      display: inline-block;
      padding: 12px 30px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
      font-size: 1rem;
    }
    
    .btn-primary {
      background: #1e40af;
      color: white;
    }
    
    .btn-primary:hover {
      background: #1e3a8a;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
    }
    
    .btn-accent {
      background: #f59e0b;
      color: white;
    }
    
    .btn-accent:hover {
      background: #d97706;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2.5rem;
      }
      
      .image-text-section .grid,
      .image-text-section.reverse .grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }
      
      .services-grid {
        grid-template-columns: 1fr;
      }
      
      .gallery-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }
      
      .container {
        padding: 0 15px;
      }
    }

    @media (max-width: 480px) {
      .hero-section {
        height: 400px;
      }
      
      .hero-section h1 {
        font-size: 2rem;
      }
      
      .text-block-section,
      .image-text-section,
      .services-section,
      .cta-section,
      .opening-hours-section,
      .gallery-section {
        padding: 40px 0;
      }
    }
  `]
})
export class CmsRendererComponent implements OnChanges {
  @Input() component!: CmsComponent;
  @Input() businessInfo?: any;
  @Input() services?: any[];
  @Input() mediaItems?: any[];

  galleryImages: string[] = [];

  constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['component']) {
      this.loadComponentData();
    }
  }

  loadComponentData() {
    // Load services for services-list component
    if (this.component.type === 'services-list' && !this.services) {
      this.apiService.getServices().subscribe({
        next: (data) => {
          this.services = data;
        },
        error: (error) => console.error('Error loading services:', error)
      });
    }

    // Load gallery images
    if (this.component?.type === 'gallery') {
      const galleryField = this.component?.fields?.find(f => f.field_name === 'images');
      if (galleryField && galleryField.field_value) {
        try {
          const imageIds = JSON.parse(galleryField.field_value);
          this.galleryImages = imageIds.map((id: number) => this.getMediaUrl(id.toString()));
        } catch (error) {
          console.error('Error parsing gallery images:', error);
        }
      }
    }
  }

  getField(name: string): any {
    const field = this.component?.fields?.find(f => f.field_name === name);
    return field ? field.field_value : '';
  }

  getMediaUrl(mediaId: string): string {
    if (!this.mediaItems) return '';
    const media = this.mediaItems.find(m => m.id === +mediaId);
    return media?.url || '';
  }
}
