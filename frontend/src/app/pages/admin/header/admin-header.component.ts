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
          <mat-card-subtitle>Logo, nom, libellés, sous-titre, CTAs, icônes</mat-card-subtitle>
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
            <div class="grid top-grid" style="margin-top:12px">
              <div class="span3">
                <app-admin-input label="Sous-titre" formControlName="subtitle"></app-admin-input>
              </div>
            </div>
            <div class="grid nav-grid">
              <app-admin-input label="Accueil" formControlName="nav_home"></app-admin-input>
              <app-admin-input label="Services" formControlName="nav_services"></app-admin-input>
              <app-admin-input label="À propos" formControlName="nav_about"></app-admin-input>
              <app-admin-input label="Contact" formControlName="nav_contact"></app-admin-input>
            </div>
            <div class="grid nav-grid">
              <app-admin-input label="CTA principal (desktop)" formControlName="cta_primary_label"></app-admin-input>
              <app-admin-input label="CTA mobile (menu)" formControlName="cta_mobile_label"></app-admin-input>
            </div>
            <div class="grid nav-grid">
              <app-admin-input label="Icône logo (fallback)" kind="select" formControlName="logo_icon">
                <option value="">(aucun)</option>
                <option *ngFor="let i of allowedIcons" [value]="i">{{ i }}</option>
              </app-admin-input>
              <app-admin-input label="Icône menu" kind="select" formControlName="menu_icon">
                <option value="">(aucun)</option>
                <option *ngFor="let i of allowedIcons" [value]="i">{{ i }}</option>
              </app-admin-input>
              <app-admin-input label="Icône fermeture" kind="select" formControlName="close_icon">
                <option value="">(aucun)</option>
                <option *ngFor="let i of allowedIcons" [value]="i">{{ i }}</option>
              </app-admin-input>
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
  allowedIcons = ['car','phone','menu','x','award','users','calendar','file-text','check-circle','heart','shield','book-open','map-pin','mail','clock','chevron-right','chevron-left'];

  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nav_home: ['Accueil', Validators.required],
      nav_services: ['Services', Validators.required],
      nav_about: ["L'Auto-École", Validators.required],
      nav_contact: ['Contact', Validators.required],
      subtitle: [''],
      cta_primary_label: ['Nous contacter'],
      cta_mobile_label: ['Appeler maintenant'],
      logo_icon: ['car'],
      menu_icon: ['menu'],
      close_icon: ['x'],
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
    this.api.getContent('header','subtitle').subscribe({ next: (i) => this.form.patchValue({ subtitle: i?.content || '' }), error: () => {} });
    this.api.getContent('header','cta_primary_label').subscribe({ next: (i) => this.form.patchValue({ cta_primary_label: i?.content || 'Nous contacter' }), error: () => {} });
    this.api.getContent('header','cta_mobile_label').subscribe({ next: (i) => this.form.patchValue({ cta_mobile_label: i?.content || 'Appeler maintenant' }), error: () => {} });
    this.api.getContent('header','logo_icon').subscribe({ next: (i) => this.form.patchValue({ logo_icon: i?.content || 'car' }), error: () => {} });
    this.api.getContent('header','menu_icon').subscribe({ next: (i) => this.form.patchValue({ menu_icon: i?.content || 'menu' }), error: () => {} });
    this.api.getContent('header','close_icon').subscribe({ next: (i) => this.form.patchValue({ close_icon: i?.content || 'x' }), error: () => {} });
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
        this.api.saveContent({ page_name: 'header', section_name: 'subtitle', content_type: 'text', content: v.subtitle || '' }).subscribe({ next: () => {}, error: () => {} });
        this.api.saveContent({ page_name: 'header', section_name: 'cta_primary_label', content_type: 'text', content: v.cta_primary_label || '' }).subscribe({ next: () => {}, error: () => {} });
        this.api.saveContent({ page_name: 'header', section_name: 'cta_mobile_label', content_type: 'text', content: v.cta_mobile_label || '' }).subscribe({ next: () => {}, error: () => {} });
        this.api.saveContent({ page_name: 'header', section_name: 'logo_icon', content_type: 'text', content: v.logo_icon || '' }).subscribe({ next: () => {}, error: () => {} });
        this.api.saveContent({ page_name: 'header', section_name: 'menu_icon', content_type: 'text', content: v.menu_icon || '' }).subscribe({ next: () => {}, error: () => {} });
        this.api.saveContent({ page_name: 'header', section_name: 'close_icon', content_type: 'text', content: v.close_icon || '' }).subscribe({ next: () => {}, error: () => {} });
        this.isSaving = false;
        this.snack.open('En-tête enregistré', 'Fermer', { duration: 3000 });
      },
      error: () => { this.isSaving = false; this.snack.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 }); }
    });
  }
}
