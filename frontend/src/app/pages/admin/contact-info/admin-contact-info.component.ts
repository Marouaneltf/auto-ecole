import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';

@Component({
  selector: 'app-admin-contact-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Coordonnées</mat-card-title>
          <mat-card-subtitle>Téléphone, email, adresse, carte</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="full">
              <app-admin-input label="Adresse" kind="textarea" [rows]="2" formControlName="address"></app-admin-input>
            </div>
            <div class="grid">
              <app-admin-input label="Téléphone" formControlName="phone"></app-admin-input>
              <app-admin-input label="Email" type="email" formControlName="email"></app-admin-input>
            </div>
            <div class="full">
              <app-admin-input label="URL Carte (Google Maps iframe src)" type="url" formControlName="map_url"></app-admin-input>
            </div>
            <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">{{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 20px auto; padding: 0 20px; }
    .full { width: 100%; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  `]
})
export class AdminContactInfoComponent implements OnInit {
  form: FormGroup;
  isSaving = false;
  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({ address: ['', Validators.required], phone: ['', Validators.required], email: ['', [Validators.required, Validators.email]], map_url: [''] });
  }
  ngOnInit(): void {
    this.api.getBusinessInfo().subscribe({
      next: (data) => this.form.patchValue({ address: data?.address || '', phone: data?.phone || '', email: data?.email || '' }),
      error: () => {}
    });
    this.api.getContent('contact','map_url').subscribe({ next: (i) => this.form.patchValue({ map_url: i?.content || '' }), error: () => {} });
  }
  save() {
    this.isSaving = true;
    const v = this.form.value as any;
    const infoPayload = { address: v.address, phone: v.phone, email: v.email };
    this.api.updateBusinessInfo(infoPayload).subscribe({
      next: () => {
        this.api.saveContent({ page_name: 'contact', section_name: 'map_url', content_type: 'text', content: v.map_url || '' }).subscribe({ next: () => {}, error: () => {} });
        this.isSaving = false; this.snack.open('Coordonnées enregistrées', 'Fermer', { duration: 3000 });
      },
      error: () => { this.isSaving = false; this.snack.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 }); }
    });
  }
}
