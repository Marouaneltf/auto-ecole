import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="hero" [ngStyle]="{'background': heroBackground}">
      <div class="hero-content">
        <h1>Bienvenue à l'{{ businessInfo?.name }}</h1>
        <p class="tagline">{{ heroTagline || 'Votre réussite est notre priorité. Formations complètes et accompagnement personnalisé.' }}</p>
        <div class="cta-group">
          <a mat-raised-button color="accent" routerLink="/services">Nos Formations</a>
          <a mat-stroked-button class="white-btn" routerLink="/contact">Nous Contacter</a>
        </div>
      </div>
    </div>

    <section class="services-section">
      <div class="container">
        <h2>Nos Services</h2>
        <div class="services-grid" *ngIf="services.length > 0; else loading">
          <mat-card *ngFor="let service of services" class="service-card">
            <mat-card-header>
              <div mat-card-avatar class="service-icon">{{ service.icon }}</div>
              <mat-card-title>{{ service.name }}</mat-card-title>
              <mat-card-subtitle>{{ service.duration }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ service.description }}</p>
              <p class="price">{{ service.price }} €</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" routerLink="/services">En savoir plus</button>
            </mat-card-actions>
          </mat-card>
        </div>
        <ng-template #loading>
          <p class="loading">Chargement des services...</p>
        </ng-template>
      </div>
    </section>

    <section class="info-section">
      <div class="container">
        <h2>Pourquoi nous choisir ?</h2>
        <div class="features-grid">
          <div class="feature">
            <mat-icon>school</mat-icon>
            <h3>Moniteurs Expérimentés</h3>
            <p>Une équipe pédagogique qualifiée à votre écoute.</p>
          </div>
          <div class="feature">
            <mat-icon>directions_car</mat-icon>
            <h3>Véhicules Récents</h3>
            <p>Apprenez à conduire sur des véhicules modernes et sûrs.</p>
          </div>
          <div class="feature">
            <mat-icon>schedule</mat-icon>
            <h3>Flexibilité</h3>
            <p>Des horaires adaptés à votre emploi du temps.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(rgba(30, 64, 175, 0.9), rgba(30, 64, 175, 0.8));
      color: white;
      padding: 100px 20px;
      text-align: center;
    }
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 20px;
    }
    .tagline {
      font-size: 1.2rem;
      margin-bottom: 40px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    .cta-group {
      display: flex;
      gap: 20px;
      justify-content: center;
    }
    .white-btn {
      color: white;
      border-color: white;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 20px;
    }
    
    h2 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 40px;
      color: #1E40AF;
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
    }
    .service-card {
      height: 100%;
      transition: transform 0.3s;
    }
    .service-card:hover {
      transform: translateY(-5px);
    }
    .service-icon {
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #F59E0B;
      margin-top: 10px;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      text-align: center;
    }
    .feature mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #1E40AF;
      margin-bottom: 20px;
    }
    .loading {
      text-align: center;
      font-style: italic;
      color: #666;
    }
  `]
})
export class HomeComponent implements OnInit {
  businessInfo: any;
  services: any[] = [];
  heroTagline = '';
  heroBackground = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getBusinessInfo().subscribe({
      next: (data) => this.businessInfo = data,
      error: (err) => console.error('Error fetching business info:', err)
    });

    this.apiService.getServices().subscribe({
      next: (data) => {
        // Just show first 3 services on home
        this.services = data.slice(0, 3);
      },
      error: (err) => console.error('Error fetching services:', err)
    });

    this.apiService.getContent('home', 'hero_tagline').subscribe({
      next: (item) => this.heroTagline = item?.content || '',
      error: () => {}
    });
    this.apiService.getContent('home', 'hero_background_url').subscribe({
      next: (item) => {
        const url = item?.content || '';
        this.heroBackground = url
          ? `linear-gradient(rgba(30, 64, 175, 0.9), rgba(30, 64, 175, 0.8)), url('${url}') center/cover`
          : `linear-gradient(rgba(30, 64, 175, 0.9), rgba(30, 64, 175, 0.8))`;
      },
      error: () => {}
    });
  }
}
