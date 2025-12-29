import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  template: `
    <mat-card class="service-card">
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
        <a mat-button color="primary" routerLink="/contact">S'inscrire</a>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
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
  `]
})
export class ServiceCardComponent {
  @Input() service: any;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, MatIconModule, MatButtonModule, RouterLink, ServiceCardComponent],
  template: `
    <div class="page-header">
      <div class="container">
        <h1>Nos Formations</h1>
        <p>Découvrez nos offres adaptées à vos besoins</p>
      </div>
    </div>

    <div class="container content">
      <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start">
        <mat-tab label="Tous">
          <div class="services-grid">
            <ng-container *ngFor="let service of services">
              <app-service-card [service]="service"></app-service-card>
            </ng-container>
          </div>
        </mat-tab>
        
        <mat-tab *ngFor="let cat of categories" [label]="cat.name">
          <div class="services-grid">
            <ng-container *ngFor="let service of services">
              <app-service-card *ngIf="service.category_id === cat.id" [service]="service"></app-service-card>
            </ng-container>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .page-header {
      background-color: #1E40AF;
      color: white;
      padding: 60px 0;
      text-align: center;
    }
    .page-header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .content {
      padding-top: 40px;
      padding-bottom: 60px;
    }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
      margin-top: 30px;
    }
  `]
})
export class ServicesComponent implements OnInit {
  categories: any[] = [];
  services: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getCategories().subscribe(data => this.categories = data);
    this.apiService.getServices().subscribe(data => this.services = data);
  }
}
