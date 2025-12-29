import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>{{ businessInfo?.name || 'Auto-École CAR 18 ème' }}</h3>
            <p>{{ businessInfo?.description }}</p>
          </div>
          <div class="footer-section">
            <h3>Contact</h3>
            <p>{{ businessInfo?.address }}</p>
            <p>Tél: {{ businessInfo?.phone }}</p>
            <p>Email: {{ businessInfo?.email }}</p>
          </div>
          <div class="footer-section">
            <h3>Horaires</h3>
            <p>{{ hoursText || 'Lundi - Vendredi: 9h - 19h | Samedi: 9h - 13h' }}</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} {{ businessInfo?.name }}. Tous droits réservés. <a routerLink="/legal">Mentions Légales</a></p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #333;
      color: white;
      padding: 40px 0 20px;
      margin-top: auto;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 30px;
    }
    .footer-section h3 {
      color: #F59E0B; /* Accent color */
      margin-bottom: 15px;
    }
    .footer-bottom {
      border-top: 1px solid #555;
      padding-top: 20px;
      text-align: center;
      font-size: 0.9rem;
      color: #aaa;
    }
    .footer-bottom a {
      color: #aaa;
      text-decoration: none;
    }
    .footer-bottom a:hover {
      color: white;
    }
  `]
})
export class FooterComponent implements OnInit {
  businessInfo: any;
  currentYear = new Date().getFullYear();
  hoursText = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getBusinessInfo().subscribe({
      next: (data) => this.businessInfo = data,
      error: (err) => console.error('Error fetching business info:', err)
    });
    this.apiService.getContent('footer','hours').subscribe({
      next: (item) => this.hoursText = item?.content || '',
      error: () => {}
    });
  }
}
