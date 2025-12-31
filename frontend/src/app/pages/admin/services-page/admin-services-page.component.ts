import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';
import { AdminServicesListComponent } from '../services/services-list.component';
import { AdminFeaturesEditorComponent } from '../../../admin/shared/admin-features-editor/admin-features-editor.component';
import { AdminVehiclesEditorComponent } from '../../../admin/shared/admin-vehicles-editor/admin-vehicles-editor.component';

@Component({
  selector: 'app-admin-services-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent, AdminServicesListComponent, AdminFeaturesEditorComponent, AdminVehiclesEditorComponent],
  template: `
    <div class="container">
      <div class="section-menu">
        <button class="menu-card" [class.active]="active==='grid'" (click)="active='grid'">
          <div class="menu-card-title">Grille des services</div>
          <div class="menu-card-sub">Créer, modifier, supprimer</div>
        </button>
        <button class="menu-card" [class.active]="active==='features'" [class.missing]="!(featuresForm.get('features_title')?.value)" (click)="active='features'">
          <div class="menu-card-title">Fonctionnalités</div>
          <div class="menu-card-sub">{{ featuresForm.get('features_title')?.value || '—' }}</div>
        </button>
        <button class="menu-card" [class.active]="active==='vehicles'" [class.missing]="!(vehiclesForm.get('vehicles_title')?.value)" (click)="active='vehicles'">
          <div class="menu-card-title">Véhicules</div>
          <div class="menu-card-sub">{{ vehiclesForm.get('vehicles_title')?.value || '—' }}</div>
        </button>
        <button class="menu-card" [class.active]="active==='cta'" [class.missing]="!(ctaForm.get('cta_title')?.value)" (click)="active='cta'">
          <div class="menu-card-title">CTA</div>
          <div class="menu-card-sub">{{ ctaForm.get('cta_title')?.value || '—' }}</div>
        </button>
      </div>
      <mat-card>
        <mat-card-header>
          <mat-card-title>Services — Grille des services</mat-card-title>
          <mat-card-subtitle>Créer, modifier, supprimer des services</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="active==='grid'">
          <app-admin-services-list></app-admin-services-list>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Services — Fonctionnalités (section)</mat-card-title>
          <mat-card-subtitle>Titres et liste JSON</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="active==='features'">
          <form [formGroup]="featuresForm" (ngSubmit)="saveFeatures()">
            <div class="grid">
              <app-admin-input label="Titre" formControlName="features_title"></app-admin-input>
              <app-admin-input label="Sous-titre" formControlName="features_subtitle"></app-admin-input>
            </div>
            <app-admin-features-editor></app-admin-features-editor>
            <button mat-raised-button color="primary" type="submit">Enregistrer</button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Services — Véhicules (section)</mat-card-title>
          <mat-card-subtitle>Titres et liste JSON</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="active==='vehicles'">
          <form [formGroup]="vehiclesForm" (ngSubmit)="saveVehicles()">
            <div class="grid">
              <app-admin-input label="Titre" formControlName="vehicles_title"></app-admin-input>
              <app-admin-input label="Sous-titre" formControlName="vehicles_subtitle"></app-admin-input>
            </div>
            <app-admin-vehicles-editor></app-admin-vehicles-editor>
            <button mat-raised-button color="primary" type="submit">Enregistrer</button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Services — CTA</mat-card-title>
          <mat-card-subtitle>Titre, sous-titre, libellé</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="active==='cta'">
          <form [formGroup]="ctaForm" (ngSubmit)="saveCta()">
            <div class="grid">
              <app-admin-input label="Titre CTA" formControlName="cta_title"></app-admin-input>
              <app-admin-input label="Sous-titre CTA" formControlName="cta_subtitle"></app-admin-input>
            </div>
            <app-admin-input label="Libellé bouton" formControlName="cta_label"></app-admin-input>
            <button mat-raised-button color="primary" type="submit">Enregistrer</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 20px auto; padding: 0 20px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    @media (max-width: 900px){ .grid { grid-template-columns: 1fr } }
    .section-menu{display:grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px;}
    .menu-card{border:none; text-align:left; cursor:pointer; border-radius: 12px; padding: 12px; background: #f3f4f6;}
    .menu-card:hover{background:#e5e7eb}
    .menu-card.active{background:#d1d5db}
    .menu-card.missing{outline: 2px solid #ef4444}
    .menu-card-title{font-weight:700; color:#111827}
    .menu-card-sub{font-size:12px; color:#6b7280}
  `]
})
export class AdminServicesPageComponent implements OnInit {
  featuresForm: FormGroup;
  vehiclesForm: FormGroup;
  ctaForm: FormGroup;
  active: 'grid'|'features'|'vehicles'|'cta' = 'grid';
  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.featuresForm = this.fb.group({ features_title: [''], features_subtitle: [''], features: ['[]'] });
    this.vehiclesForm = this.fb.group({ vehicles_title: [''], vehicles_subtitle: [''], vehicles: ['[]'] });
    this.ctaForm = this.fb.group({ cta_title: [''], cta_subtitle: [''], cta_label: ['Prendre rendez-vous'] });
  }
  ngOnInit(): void {
    this.api.getContent('services','features_title').subscribe({ next: (i) => this.featuresForm.patchValue({ features_title: i?.content || '' }), error: () => {} });
    this.api.getContent('services','features_subtitle').subscribe({ next: (i) => this.featuresForm.patchValue({ features_subtitle: i?.content || '' }), error: () => {} });
    this.api.getContent('services','features').subscribe({ next: (i) => this.featuresForm.patchValue({ features: i?.content || '[]' }), error: () => {} });
    this.api.getContent('services','vehicles_title').subscribe({ next: (i) => this.vehiclesForm.patchValue({ vehicles_title: i?.content || '' }), error: () => {} });
    this.api.getContent('services','vehicles_subtitle').subscribe({ next: (i) => this.vehiclesForm.patchValue({ vehicles_subtitle: i?.content || '' }), error: () => {} });
    this.api.getContent('services','vehicles').subscribe({ next: (i) => this.vehiclesForm.patchValue({ vehicles: i?.content || '[]' }), error: () => {} });
    this.api.getContent('services','cta_title').subscribe({ next: (i) => this.ctaForm.patchValue({ cta_title: i?.content || '' }), error: () => {} });
    this.api.getContent('services','cta_subtitle').subscribe({ next: (i) => this.ctaForm.patchValue({ cta_subtitle: i?.content || '' }), error: () => {} });
    this.api.getContent('services','cta_label').subscribe({ next: (i) => this.ctaForm.patchValue({ cta_label: i?.content || 'Prendre rendez-vous' }), error: () => {} });
  }
  saveFeatures() {
    const v = this.featuresForm.value as any;
    this.api.saveContent({ page_name: 'services', section_name: 'features_title', content_type: 'text', content: v.features_title || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'services', section_name: 'features_subtitle', content_type: 'text', content: v.features_subtitle || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'services', section_name: 'features', content_type: 'json', content: v.features || '[]' }).subscribe({ next: () => {}, error: () => {} });
    this.snack.open('Fonctionnalités enregistrées', 'Fermer', { duration: 3000 });
  }
  saveVehicles() {
    const v = this.vehiclesForm.value as any;
    this.api.saveContent({ page_name: 'services', section_name: 'vehicles_title', content_type: 'text', content: v.vehicles_title || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'services', section_name: 'vehicles_subtitle', content_type: 'text', content: v.vehicles_subtitle || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'services', section_name: 'vehicles', content_type: 'json', content: v.vehicles || '[]' }).subscribe({ next: () => {}, error: () => {} });
    this.snack.open('Véhicules enregistrés', 'Fermer', { duration: 3000 });
  }
  saveCta() {
    const v = this.ctaForm.value as any;
    this.api.saveContent({ page_name: 'services', section_name: 'cta_title', content_type: 'text', content: v.cta_title || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'services', section_name: 'cta_subtitle', content_type: 'text', content: v.cta_subtitle || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'services', section_name: 'cta_label', content_type: 'text', content: v.cta_label || 'Prendre rendez-vous' }).subscribe({ next: () => {}, error: () => {} });
    this.snack.open('CTA enregistré', 'Fermer', { duration: 3000 });
  }
}
