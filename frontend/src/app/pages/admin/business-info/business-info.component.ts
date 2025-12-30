import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';

@Component({
  selector: 'app-business-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Informations de l'entreprise</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="grid">
              <app-admin-input label="Nom" formControlName="name"></app-admin-input>
              <app-admin-input label="Téléphone" formControlName="phone"></app-admin-input>
              <app-admin-input label="Email" type="email" formControlName="email"></app-admin-input>
            </div>
            <div class="full-width">
              <app-admin-input label="Adresse" kind="textarea" [rows]="2" formControlName="address"></app-admin-input>
            </div>
            <div class="full-width">
              <app-admin-input label="Description" kind="textarea" [rows]="3" formControlName="description"></app-admin-input>
            </div>
            <div class="full-width">
              <app-admin-input label="Horaires (texte)" formControlName="opening_hours"></app-admin-input>
            </div>
            <div class="full-width">
              <app-admin-input label="Liens sociaux (JSON)" kind="textarea" [rows]="2" placeholder='{"facebook":"url","instagram":"url"}' formControlName="social_links"></app-admin-input>
            </div>
            <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">{{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 20px auto; padding: 0 20px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .full-width { width: 100%; }
  `]
})
export class BusinessInfoComponent implements OnInit {
  form: FormGroup;
  isSaving = false;

  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: [''],
      opening_hours: [''],
      social_links: ['']
    });
  }

  ngOnInit(): void {
    this.api.getBusinessInfo().subscribe({
      next: (data) => {
        this.form.patchValue({
          name: data?.name || '',
          address: data?.address || '',
          phone: data?.phone || '',
          email: data?.email || '',
          description: data?.description || '',
          opening_hours: (data as any)?.opening_hours || '',
          social_links: (data as any)?.social_links ? JSON.stringify((data as any).social_links) : ''
        });
      },
      error: () => {}
    });
  }

  save() {
    this.isSaving = true;
    const value = { ...this.form.value } as any;
    if (value.social_links) {
      try { value.social_links = JSON.parse(value.social_links); } catch { this.snack.open('Liens sociaux doivent être un JSON valide', 'Fermer', { duration: 3000 }); this.isSaving = false; return; }
    } else { value.social_links = null; }
    this.api.updateBusinessInfo(value).subscribe({
      next: () => { this.snack.open('Informations enregistrées', 'Fermer', { duration: 3000 }); this.isSaving = false; },
      error: () => { this.snack.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 }); this.isSaving = false; }
    });
  }
}
