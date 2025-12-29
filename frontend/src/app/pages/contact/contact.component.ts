import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-header">
      <div class="container">
        <h1>Contactez-nous</h1>
        <p>Une question ? Besoin d'informations ? Nous sommes là pour vous.</p>
      </div>
    </div>

    <div class="container content">
      <div class="grid-layout">
        <div class="contact-info">
          <h2>Nos Coordonnées</h2>
          <div class="info-item">
            <mat-icon>location_on</mat-icon>
            <div>
              <h3>Adresse</h3>
              <p>{{ businessInfo?.address }}</p>
            </div>
          </div>
          <div class="info-item">
            <mat-icon>phone</mat-icon>
            <div>
              <h3>Téléphone</h3>
              <p>{{ businessInfo?.phone }}</p>
            </div>
          </div>
          <div class="info-item">
            <mat-icon>email</mat-icon>
            <div>
              <h3>Email</h3>
              <p>{{ businessInfo?.email }}</p>
            </div>
          </div>
          
          <div class="hours">
            <h3>Horaires d'ouverture</h3>
            <ul>
              <li><strong>Lundi - Vendredi:</strong> 9h00 - 19h00</li>
              <li><strong>Samedi:</strong> 9h00 - 13h00</li>
              <li><strong>Dimanche:</strong> Fermé</li>
            </ul>
          </div>

          <div class="map">
            <!-- Simple placeholder for map, ideally use Google Maps API -->
            <iframe 
              width="100%" 
              height="300" 
              frameborder="0" 
              scrolling="no" 
              marginheight="0" 
              marginwidth="0" 
              src="https://maps.google.com/maps?q=6%20rue%20Joseph%20Dijon%2C%2075018%20Paris&t=&z=15&ie=UTF8&iwloc=&output=embed">
            </iframe>
          </div>
        </div>

        <div class="contact-form">
          <h2>Envoyez-nous un message</h2>
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nom complet</mat-label>
              <input matInput formControlName="name" placeholder="Votre nom">
              <mat-error *ngIf="contactForm.get('name')?.hasError('required')">Le nom est requis</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" placeholder="votre@email.com">
              <mat-error *ngIf="contactForm.get('email')?.hasError('required')">L'email est requis</mat-error>
              <mat-error *ngIf="contactForm.get('email')?.hasError('email')">Email invalide</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Téléphone</mat-label>
              <input matInput formControlName="phone" placeholder="06 12 34 56 78">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Message</mat-label>
              <textarea matInput formControlName="message" rows="5" placeholder="Votre message..."></textarea>
              <mat-error *ngIf="contactForm.get('message')?.hasError('required')">Le message est requis</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="contactForm.invalid || isLoading">
              {{ isLoading ? 'Envoi...' : 'Envoyer' }}
            </button>
          </form>
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
    .grid-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
    }
    @media (max-width: 768px) {
      .grid-layout {
        grid-template-columns: 1fr;
      }
    }
    h2 {
      color: #1E40AF;
      margin-bottom: 30px;
    }
    .info-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 25px;
    }
    .info-item mat-icon {
      color: #F59E0B;
      margin-right: 15px;
      font-size: 24px;
    }
    .info-item h3 {
      margin: 0 0 5px 0;
      font-size: 1.1rem;
    }
    .info-item p {
      margin: 0;
      color: #555;
    }
    .hours {
      margin-top: 40px;
      background: #F3F4F6;
      padding: 20px;
      border-radius: 8px;
    }
    .hours ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .hours li {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .map {
      margin-top: 40px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .full-width {
      width: 100%;
      margin-bottom: 10px;
    }
    button[type="submit"] {
      width: 100%;
      padding: 10px;
      font-size: 1.1rem;
    }
  `]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  businessInfo: any;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.apiService.getBusinessInfo().subscribe(data => this.businessInfo = data);
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.apiService.submitContact(this.contactForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Message envoyé avec succès !', 'Fermer', { duration: 3000 });
          this.contactForm.reset();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error sending message:', err);
          this.snackBar.open('Erreur lors de l\'envoi du message.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
