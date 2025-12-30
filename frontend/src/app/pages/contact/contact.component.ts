import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, MapPin, Phone, Mail, Clock, ChevronRight, User, MessageCircle } from 'lucide-angular';
import { ContentService } from '../../services/content.service';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { FooterComponent } from '../../components/layout/footer/footer.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { ContactInfo } from '../../models/content.models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LucideAngularModule,
    HeaderComponent,
    FooterComponent,
    ButtonComponent
  ],
  template: `
    <app-header></app-header>
    
    <!-- Hero Section -->
    <section class="page-hero">
      <div class="container-modern text-center">
        <h1 class="page-title">Contactez-nous</h1>
        <p class="page-subtitle">Nous sommes là pour répondre à toutes vos questions</p>
      </div>
    </section>

    <!-- Contact Info Section -->
    <section class="contact-info-section section-padding">
      <div class="container-modern">
        <div class="contact-info-grid">
          <div class="contact-info-item">
            <div class="contact-icon-wrapper">
              <lucide-icon name="map-pin" class="contact-icon"></lucide-icon>
            </div>
            <h3 class="contact-info-title">Adresse</h3>
            <p class="contact-info-text">{{ contactInfo?.address || '6, rue Joseph Dijon' }}</p>
            <p class="contact-info-text">75018 Paris</p>
          </div>
          <div class="contact-info-item">
            <div class="contact-icon-wrapper">
              <lucide-icon name="phone" class="contact-icon"></lucide-icon>
            </div>
            <h3 class="contact-info-title">Téléphone</h3>
            <p class="contact-info-text">
              <a href="tel:{{ contactInfo?.phone || '0142589632' }}" class="contact-link">
                {{ contactInfo?.phone || '01 42 58 96 32' }}
              </a>
            </p>
            <p class="contact-info-text">Du lundi au samedi</p>
          </div>
          <div class="contact-info-item">
            <div class="contact-icon-wrapper">
              <lucide-icon name="mail" class="contact-icon"></lucide-icon>
            </div>
            <h3 class="contact-info-title">Email</h3>
            <p class="contact-info-text">
              <a href="mailto:{{ contactInfo?.email || 'contact@autoecole18.fr' }}" class="contact-link">
                {{ contactInfo?.email || 'contact@autoecole18.fr' }}
              </a>
            </p>
            <p class="contact-info-text">Réponse sous 24h</p>
          </div>
          <div class="contact-info-item">
            <div class="contact-icon-wrapper">
              <lucide-icon name="clock" class="contact-icon"></lucide-icon>
            </div>
            <h3 class="contact-info-title">Horaires</h3>
            <p class="contact-info-text">{{ contactInfo?.hours || 'Lun-Ven: 8h-19h' }}</p>
            <p class="contact-info-text">Sam: 9h-17h</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="map-section">
      <div class="map-container">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937604!2d2.352221951743918!3d48.85661407905357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2s6%20Rue%20Joseph%20Dijon%2C%2075018%20Paris!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
          width="100%" 
          height="400" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
          class="map-iframe">
        </iframe>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="contact-form-section section-padding bg-gray-50">
      <div class="container-modern">
        <div class="section-header text-center">
          <h2 class="section-title">Envoyez-nous un message</h2>
          <p class="section-subtitle">Nous vous répondrons dans les plus brefs délais</p>
        </div>
        <div class="contact-form-container">
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name" class="form-label">Nom complet *</label>
                <input 
                  type="text" 
                  id="name" 
                  formControlName="name" 
                  class="form-input"
                  [class.error]="contactForm.get('name')?.invalid && contactForm.get('name')?.touched"
                  placeholder="Votre nom">
                <div *ngIf="contactForm.get('name')?.invalid && contactForm.get('name')?.touched" class="error-message">
                  Le nom est requis
                </div>
              </div>
              <div class="form-group">
                <label for="email" class="form-label">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email" 
                  class="form-input"
                  [class.error]="contactForm.get('email')?.invalid && contactForm.get('email')?.touched"
                  placeholder="votre@email.com">
                <div *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched" class="error-message">
                  <span *ngIf="contactForm.get('email')?.errors?.['required']">L'email est requis</span>
                  <span *ngIf="contactForm.get('email')?.errors?.['email']">Format d'email invalide</span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="phone" class="form-label">Téléphone</label>
              <input 
                type="tel" 
                id="phone" 
                formControlName="phone" 
                class="form-input"
                placeholder="01 23 45 67 89">
            </div>
            <div class="form-group">
              <label for="subject" class="form-label">Sujet *</label>
              <input 
                type="text" 
                id="subject" 
                formControlName="subject" 
                class="form-input"
                [class.error]="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched"
                placeholder="Quel est le sujet de votre message ?">
              <div *ngIf="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched" class="error-message">
                Le sujet est requis
              </div>
            </div>
            <div class="form-group">
              <label for="message" class="form-label">Message *</label>
              <textarea 
                id="message" 
                formControlName="message" 
                rows="5" 
                class="form-input form-textarea"
                [class.error]="contactForm.get('message')?.invalid && contactForm.get('message')?.touched"
                placeholder="Décrivez votre demande...">
              </textarea>
              <div *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched" class="error-message">
                Le message est requis (minimum 10 caractères)
              </div>
            </div>
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn-primary"
                [disabled]="contactForm.invalid || isSubmitting">
                <lucide-icon name="chevron-right" class="mr-2"></lucide-icon>
                <span *ngIf="!isSubmitting">Envoyer le message</span>
                <span *ngIf="isSubmitting">Envoi en cours...</span>
              </button>
            </div>
          </form>
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
    
    .contact-info-section {
      @apply py-16;
    }
    
    .contact-info-grid {
      @apply grid md:grid-cols-2 lg:grid-cols-4 gap-8;
    }
    
    .contact-info-item {
      @apply text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300;
    }
    
    .contact-icon-wrapper {
      @apply w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4;
    }
    
    .contact-icon {
      @apply w-8 h-8 text-primary-600;
    }
    
    .contact-info-title {
      @apply text-xl font-semibold text-gray-900 mb-2;
    }
    
    .contact-info-text {
      @apply text-gray-600 mb-1;
    }
    
    .contact-link {
      @apply text-primary-600 hover:text-primary-700 transition-colors duration-200;
      text-decoration: none;
    }
    
    .map-section {
      @apply relative;
    }
    
    .map-container {
      @apply w-full;
    }
    
    .map-iframe {
      @apply w-full h-96;
    }
    
    .contact-form-section {
      @apply py-16;
    }
    
    .section-header {
      @apply mb-12 text-center;
    }
    
    .section-title {
      @apply text-3xl md:text-4xl font-bold text-gray-900 mb-4;
    }
    
    .section-subtitle {
      @apply text-lg text-gray-600 max-w-2xl mx-auto;
    }
    
    .contact-form-container {
      @apply max-w-2xl mx-auto;
    }
    
    .contact-form {
      @apply space-y-6;
    }
    
    .form-row {
      @apply grid md:grid-cols-2 gap-6;
    }
    
    .form-group {
      @apply space-y-2;
    }
    
    .form-label {
      @apply block text-sm font-medium text-gray-700;
    }
    
    .form-input {
      @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200;
      
      &.error {
        @apply border-red-500 focus:ring-red-500;
      }
      
      &:focus {
        @apply outline-none;
      }
    }
    
    .form-textarea {
      @apply min-h-[120px];
    }
    
    .error-message {
      @apply text-sm text-red-600 mt-1;
    }
    
    .form-actions {
      @apply pt-4;
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
      
      .contact-info-grid {
        @apply grid-cols-1 gap-6;
      }
      
      .map-iframe {
        @apply h-64;
      }
      
      .form-row {
        @apply grid-cols-1 gap-4;
      }
    }
  `]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  contactInfo: ContactInfo | null = null;
  isSubmitting = false;
  submitSuccess = false;

  constructor(
    private fb: FormBuilder,
    private contentService: ContentService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.contentService.getContactInfo().subscribe(info => {
      this.contactInfo = info;
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;
      this.contactForm.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
    }, 2000);
  }
}