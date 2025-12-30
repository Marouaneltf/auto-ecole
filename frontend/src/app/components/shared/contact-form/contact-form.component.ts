import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, User, Mail, Phone, MessageCircle, Send } from 'lucide-angular';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
      <div class="form-grid">
        <div class="form-group">
          <label for="name" class="form-label">
            <lucide-icon name="user" class="w-4 h-4 mr-2"></lucide-icon>
            Nom complet
          </label>
          <input
            type="text"
            id="name"
            formControlName="name"
            class="form-input"
            [class.error]="contactForm.get('name')?.invalid && contactForm.get('name')?.touched"
            placeholder="Jean Dupont">
          <div *ngIf="contactForm.get('name')?.invalid && contactForm.get('name')?.touched" class="error-message">
            <span *ngIf="contactForm.get('name')?.errors?.['required']">Le nom est requis</span>
            <span *ngIf="contactForm.get('name')?.errors?.['minlength']">Minimum 2 caractères</span>
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">
            <lucide-icon name="mail" class="w-4 h-4 mr-2"></lucide-icon>
            Email
          </label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="form-input"
            [class.error]="contactForm.get('email')?.invalid && contactForm.get('email')?.touched"
            placeholder="jean.dupont@email.com">
          <div *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched" class="error-message">
            <span *ngIf="contactForm.get('email')?.errors?.['required']">L'email est requis</span>
            <span *ngIf="contactForm.get('email')?.errors?.['email']">Email invalide</span>
          </div>
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">
            <lucide-icon name="phone" class="w-4 h-4 mr-2"></lucide-icon>
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            formControlName="phone"
            class="form-input"
            [class.error]="contactForm.get('phone')?.invalid && contactForm.get('phone')?.touched"
            placeholder="06 12 34 56 78">
          <div *ngIf="contactForm.get('phone')?.invalid && contactForm.get('phone')?.touched" class="error-message">
            <span *ngIf="contactForm.get('phone')?.errors?.['required']">Le téléphone est requis</span>
            <span *ngIf="contactForm.get('phone')?.errors?.['pattern']">Format invalide</span>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="message" class="form-label">
          <lucide-icon name="message-circle" class="w-4 h-4 mr-2"></lucide-icon>
          Message
        </label>
        <textarea
          id="message"
          formControlName="message"
          class="form-input form-textarea"
          [class.error]="contactForm.get('message')?.invalid && contactForm.get('message')?.touched"
          placeholder="Bonjour, je souhaite obtenir des informations sur..."
          rows="4"></textarea>
        <div *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched" class="error-message">
          <span *ngIf="contactForm.get('message')?.errors?.['required']">Le message est requis</span>
          <span *ngIf="contactForm.get('message')?.errors?.['minlength']">Minimum 10 caractères</span>
        </div>
      </div>

      <button
        type="submit"
        [disabled]="contactForm.invalid || isSubmitting"
        class="submit-btn">
        <lucide-icon name="send" class="w-4 h-4 mr-2"></lucide-icon>
        <span *ngIf="!isSubmitting">Envoyer le message</span>
        <span *ngIf="isSubmitting">Envoi en cours...</span>
      </button>

      <div *ngIf="submitSuccess" class="success-message">
        <lucide-icon name="check-circle" class="w-5 h-5 mr-2"></lucide-icon>
        Message envoyé avec succès ! Nous vous contacterons rapidement.
      </div>

      <div *ngIf="submitError" class="error-message-global">
        <lucide-icon name="alert-circle" class="w-5 h-5 mr-2"></lucide-icon>
        Une erreur s'est produite. Veuillez réessayer.
      </div>
    </form>
  `,
  styles: [`
    .contact-form {
      @apply space-y-6;
    }

    .form-grid {
      @apply grid md:grid-cols-3 gap-6;
    }

    .form-group {
      @apply space-y-2;
    }

    .form-label {
      @apply flex items-center text-sm font-medium text-gray-700;
    }

    .form-input {
      @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200;
    }

    .form-input.error {
      @apply border-red-500 focus:ring-red-500;
    }

    .form-textarea {
      @apply resize-none;
    }

    .form-input::placeholder {
      @apply text-gray-400;
    }

    .submit-btn {
      @apply w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
    }

    .submit-btn:disabled {
      @apply opacity-50 cursor-not-allowed transform-none shadow-none;
    }

    .error-message {
      @apply text-sm text-red-600 mt-1;
    }

    .error-message-global {
      @apply flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg;
    }

    .success-message {
      @apply flex items-center text-sm text-green-600 bg-green-50 p-3 rounded-lg;
    }

    @media (max-width: 768px) {
      .form-grid {
        @apply grid-cols-1 gap-4;
      }
    }
  `]
})
export class ContactFormComponent {
  @Output() formSubmit = new EventEmitter<ContactFormData>();
  
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^0[1-9]\d{8}$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitError = false;
      
      // Simulate API call
      setTimeout(() => {
        this.submitSuccess = true;
        this.formSubmit.emit(this.contactForm.value);
        this.contactForm.reset();
        this.isSubmitting = false;
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      }, 1500);
    } else {
      this.markFormGroupTouched(this.contactForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}