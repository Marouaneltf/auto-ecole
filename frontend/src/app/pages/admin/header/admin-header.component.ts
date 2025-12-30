import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';
import { AdminImagePickerComponent } from '../../../admin/shared/admin-image-picker/admin-image-picker.component';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, MatDialogModule, AdminInputComponent, AdminImagePickerComponent],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>En-tête du site</mat-card-title>
          <mat-card-subtitle>Logo, nom, libellés de navigation</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="grid top-grid">
              <div class="span3">
                <app-admin-input label="Nom de l’entreprise" formControlName="name"></app-admin-input>
              </div>
              <div class="span1">
                <app-admin-image-picker label="Logo" [(selectedId)]="logoId"></app-admin-image-picker>
              </div>
            </div>
            <div class="grid nav-grid">
              <app-admin-input label="Accueil" formControlName="nav_home"></app-admin-input>
              <app-admin-input label="Services" formControlName="nav_services"></app-admin-input>
              <app-admin-input label="À propos" formControlName="nav_about"></app-admin-input>
              <app-admin-input label="Contact" formControlName="nav_contact"></app-admin-input>
            </div>
            <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">{{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 20px auto; padding: 0 20px; }
    .grid { display: grid; gap: 12px; }
    .top-grid { grid-template-columns: repeat(4, 1fr); }
    .nav-grid { grid-template-columns: repeat(4, 1fr); margin-top: 12px; }
    .span3 { grid-column: span 3; }
    .span1 { grid-column: span 1; }
    @media (max-width: 900px) {
      .top-grid { grid-template-columns: 1fr; }
      .nav-grid { grid-template-columns: 1fr 1fr; }
      .span3, .span1 { grid-column: 1 / -1; }
    }
    @media (max-width: 520px) {
      .nav-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminHeaderComponent implements OnInit {
  form: FormGroup;
  isSaving = false;
  logoId: number | null = null;

  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nav_home: ['Accueil', Validators.required],
      nav_services: ['Services', Validators.required],
      nav_about: ["L'Auto-École", Validators.required],
      nav_contact: ['Contact', Validators.required],
    });
  }

  ngOnInit(): void {
    this.api.getBusinessInfo().subscribe({
      next: (data) => {
        this.form.patchValue({ name: data?.name || '' });
        const id = (data as any)?.logo_media_id;
        if (id) this.logoId = Number(id);
      },
      error: () => {}
    });
    this.api.getContent('header','nav_home').subscribe({ next: (i) => this.form.patchValue({ nav_home: i?.content || 'Accueil' }), error: () => {} });
    this.api.getContent('header','nav_services').subscribe({ next: (i) => this.form.patchValue({ nav_services: i?.content || 'Services' }), error: () => {} });
    this.api.getContent('header','nav_about').subscribe({ next: (i) => this.form.patchValue({ nav_about: i?.content || "L'Auto-École" }), error: () => {} });
    this.api.getContent('header','nav_contact').subscribe({ next: (i) => this.form.patchValue({ nav_contact: i?.content || 'Contact' }), error: () => {} });
  }

  save() {
    this.isSaving = true;
    const v = this.form.value;
    const updates: any = { name: v.name };
    if (this.logoId) updates.logo_media_id = this.logoId;
    this.api.updateBusinessInfo(updates).subscribe({
      next: () => {
        this.api.saveContent({ page_name: 'header', section_name: 'nav_home', content_type: 'text', content: v.nav_home }).subscribe({ next: () => {}, error: () => {} });
        this.api.saveContent({ page_name: 'header', section_name: 'nav_services', content_type: 'text', content: v.nav_services }).subscribe({ next: () => {}, error: () => {} });
        this.api.saveContent({ page_name: 'header', section_name: 'nav_about', content_type: 'text', content: v.nav_about }).subscribe({ next: () => {}, error: () => {} });
        this.api.saveContent({ page_name: 'header', section_name: 'nav_contact', content_type: 'text', content: v.nav_contact }).subscribe({ next: () => {}, error: () => {} });
        this.isSaving = false;
        this.snack.open('En-tête enregistré', 'Fermer', { duration: 3000 });
      },
      error: () => { this.isSaving = false; this.snack.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 }); }
    });
  }
}
