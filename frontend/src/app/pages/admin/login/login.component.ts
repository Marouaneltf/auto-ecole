import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    AdminInputComponent
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Administration</mat-card-title>
          <mat-card-subtitle>Connectez-vous pour gérer le site</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="stack">
              <app-admin-input
                label="Email"
                type="email"
                placeholder="admin@exemple.com"
                autocomplete="username"
                formControlName="email"
              ></app-admin-input>

              <app-admin-input
                label="Mot de passe"
                type="password"
                autocomplete="current-password"
                formControlName="password"
              ></app-admin-input>
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading" class="full-width">
              {{ isLoading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
      background-color: #F3F4F6;
      padding: 20px;
    }
    .login-card {
      max-width: 400px;
      width: 100%;
      padding: 20px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .stack { display: grid; gap: 12px; margin-bottom: 15px; }
    mat-card-header {
      margin-bottom: 20px;
      justify-content: center;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.apiService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/admin/dashboard']);
          this.snackBar.open('Connexion réussie !', 'Fermer', { duration: 3000 });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Login error:', err);
          this.snackBar.open('Email ou mot de passe incorrect.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
