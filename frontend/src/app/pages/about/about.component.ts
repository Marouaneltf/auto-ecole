import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="page-header">
      <div class="container">
        <h1>À Propos de Nous</h1>
        <p>Découvrez l'histoire et les valeurs de l'Auto-École CAR 18 ème</p>
      </div>
    </div>

    <div class="container content">
      <div class="about-section">
        <div class="about-text">
          <h2>Notre Histoire</h2>
          <p>{{ storyText }}</p>
        </div>
        <div class="about-image">
          <img [src]="imageUrl" alt="Driving School Team">
        </div>
      </div>

      <div class="values-section">
        <h2>Nos Valeurs</h2>
        <div class="values-grid">
          <mat-card class="value-card">
            <mat-icon>verified_user</mat-icon>
            <h3>Qualité</h3>
            <p>Un enseignement rigoureux et conforme aux dernières normes de sécurité routière.</p>
          </mat-card>
          <mat-card class="value-card">
            <mat-icon>psychology</mat-icon>
            <h3>Pédagogie</h3>
            <p>Une approche personnalisée pour s'adapter aux besoins et difficultés de chaque élève.</p>
          </mat-card>
          <mat-card class="value-card">
            <mat-icon>sentiment_satisfied_alt</mat-icon>
            <h3>Bienveillance</h3>
            <p>Un apprentissage dans la bonne humeur et le respect, pour gagner en confiance.</p>
          </mat-card>
        </div>
      </div>
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
      padding-top: 60px;
      padding-bottom: 80px;
    }
    .about-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      align-items: center;
      margin-bottom: 80px;
    }
    @media (max-width: 768px) {
      .about-section {
        grid-template-columns: 1fr;
      }
    }
    .about-image img {
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    h2 {
      color: #1E40AF;
      font-size: 2rem;
      margin-bottom: 30px;
    }
    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
    .value-card {
      padding: 20px;
      text-align: center;
    }
    .value-card mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #F59E0B;
      margin-bottom: 20px;
    }
  `]
})
export class AboutComponent implements OnInit {
  storyText = '';
  imageUrl = '';
  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.apiService.getContent('about','story_text').subscribe({
      next: (item) => this.storyText = item?.content || '',
      error: () => {}
    });
    this.apiService.getContent('about','image_url').subscribe({
      next: (item) => this.imageUrl = item?.content || '',
      error: () => {}
    });
  }
}
