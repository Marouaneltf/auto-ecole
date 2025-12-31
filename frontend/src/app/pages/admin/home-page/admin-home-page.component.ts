import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';
import { AdminHomeHeroComponent } from '../home-hero/admin-home-hero.component';
import { AdminHomeServicesComponent } from '../home-services/admin-home-services.component';
import { AdminHeroStatsEditorComponent } from '../../../admin/shared/admin-hero-stats-editor/admin-hero-stats-editor.component';

@Component({
  selector: 'app-admin-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    AdminInputComponent,
    AdminHomeHeroComponent,
    AdminHomeServicesComponent,
    AdminHeroStatsEditorComponent
  ],
  template: `
    <div class="container">
      <div class="section-menu">
        <button class="menu-card" [class.active]="active==='hero'" (click)="active='hero'">
          <div class="menu-card-icon"></div>
          <div class="menu-card-title">Hero</div>
          <div class="menu-card-sub">Titre, sous-titre, image</div>
        </button>
        <button class="menu-card" [class.active]="active==='badge'" [class.missing]="!(heroForm.get('hero_badge')?.value)" (click)="active='badge'">
          <div class="menu-card-title">Badge & Stats</div>
          <div class="menu-card-sub">{{ heroForm.get('hero_badge')?.value || '—' }}</div>
        </button>
        <button class="menu-card" [class.active]="active==='why'" [class.missing]="!(whyForm.get('why_title')?.value)" (click)="active='why'">
          <div class="menu-card-title">Pourquoi nous choisir</div>
          <div class="menu-card-sub">{{ whyForm.get('why_title')?.value || '—' }}</div>
        </button>
        <button class="menu-card" [class.active]="active==='services'" [class.missing]="!(servicesForm.get('services_title')?.value)" (click)="active='services'">
          <div class="menu-card-title">Section Services</div>
          <div class="menu-card-sub">{{ servicesForm.get('services_title')?.value || '—' }}</div>
        </button>
        <button class="menu-card" [class.active]="active==='testimonials'" [class.missing]="!(testimonialsForm.get('testimonials_title')?.value)" (click)="active='testimonials'">
          <div class="menu-card-title">Témoignages</div>
          <div class="menu-card-sub">{{ testimonialsForm.get('testimonials_title')?.value || '—' }}</div>
        </button>
        <button class="menu-card" [class.active]="active==='cta'" [class.missing]="!(ctaForm.get('cta_title')?.value)" (click)="active='cta'">
          <div class="menu-card-title">CTA global</div>
          <div class="menu-card-sub">{{ ctaForm.get('cta_title')?.value || '—' }}</div>
        </button>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Accueil — Hero</mat-card-title>
          <mat-card-subtitle>Titre, sous-titre, image</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="active==='hero'">
          <app-admin-home-hero></app-admin-home-hero>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Accueil — Badge & Statistiques</mat-card-title>
          <mat-card-subtitle>Texte badge et statistiques (JSON)</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="active==='badge'">
          <form [formGroup]="heroForm" (ngSubmit)="saveHeroMeta()">
            <app-admin-input label="Badge (texte)" formControlName="hero_badge"></app-admin-input>
            <app-admin-hero-stats-editor></app-admin-hero-stats-editor>
            <button mat-raised-button color="primary" type="submit">Enregistrer</button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Accueil — Pourquoi nous choisir</mat-card-title>
          <mat-card-subtitle>Libellés de section et CTA</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="active==='why'">
          <form [formGroup]="whyForm" (ngSubmit)="saveWhy()">
            <div class="grid">
              <app-admin-input label="Badge" formControlName="why_badge"></app-admin-input>
              <app-admin-input label="Titre" formControlName="why_title"></app-admin-input>
              <app-admin-input label="Sous-titre" formControlName="why_subtitle"></app-admin-input>
            </div>
            <app-admin-input label="CTA (libellé)" formControlName="why_cta_label"></app-admin-input>
            <button mat-raised-button color="primary" type="submit">Enregistrer</button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Accueil — Services (section)</mat-card-title>
          <mat-card-subtitle>Libellés de section</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="active==='services'">
          <form [formGroup]="servicesForm" (ngSubmit)="saveServicesSection()">
            <div class="grid">
              <app-admin-input label="Badge" formControlName="services_badge"></app-admin-input>
              <app-admin-input label="Titre" formControlName="services_title"></app-admin-input>
              <app-admin-input label="Sous-titre" formControlName="services_subtitle"></app-admin-input>
            </div>
            <button mat-raised-button color="primary" type="submit">Enregistrer</button>
          </form>
          <app-admin-home-services></app-admin-home-services>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Accueil — Témoignages</mat-card-title>
          <mat-card-subtitle>Libellés de section & icônes de navigation</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="active==='testimonials'">
          <form [formGroup]="testimonialsForm" (ngSubmit)="saveTestimonials()">
            <div class="grid">
              <app-admin-input label="Badge" formControlName="testimonials_badge"></app-admin-input>
              <app-admin-input label="Titre" formControlName="testimonials_title"></app-admin-input>
              <app-admin-input label="Sous-titre" formControlName="testimonials_subtitle"></app-admin-input>
            </div>
            <div class="grid">
              <app-admin-input label="Icône précédent" formControlName="testimonials_prev_icon"></app-admin-input>
              <app-admin-input label="Icône suivant" formControlName="testimonials_next_icon"></app-admin-input>
            </div>
            <button mat-raised-button color="primary" type="submit">Enregistrer</button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Accueil — CTA Global</mat-card-title>
          <mat-card-subtitle>Titres et bouton</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="active==='cta'">
          <form [formGroup]="ctaForm" (ngSubmit)="saveCta()">
            <div class="grid">
              <app-admin-input label="Titre CTA" formControlName="cta_title"></app-admin-input>
              <app-admin-input label="Sous-titre CTA" formControlName="cta_subtitle"></app-admin-input>
            </div>
            <app-admin-input label="Libellé bouton principal" formControlName="cta_primary_label"></app-admin-input>
            <button mat-raised-button color="primary" type="submit">Enregistrer</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 20px auto; padding: 0 20px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    @media (max-width: 900px){ .grid { grid-template-columns: 1fr } }
    .section-menu{display:grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px;}
    .menu-card{border:none; text-align:left; cursor:pointer; border-radius: 12px; padding: 12px; background: #f3f4f6;}
    .menu-card:hover{background:#e5e7eb}
    .menu-card.active{background:#d1d5db}
    .menu-card.missing{outline: 2px solid #ef4444}
    .menu-card-title{font-weight:700; color:#111827}
    .menu-card-sub{font-size:12px; color:#6b7280}
  `]
})
export class AdminHomePageComponent implements OnInit {
  heroForm: FormGroup;
  whyForm: FormGroup;
  servicesForm: FormGroup;
  testimonialsForm: FormGroup;
  ctaForm: FormGroup;
  active: 'hero'|'badge'|'why'|'services'|'testimonials'|'cta' = 'hero';
  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.heroForm = this.fb.group({ hero_badge: [''], hero_stats: ['[]'] });
    this.whyForm = this.fb.group({ why_badge: [''], why_title: [''], why_subtitle: [''], why_cta_label: [''] });
    this.servicesForm = this.fb.group({ services_badge: [''], services_title: [''], services_subtitle: [''] });
    this.testimonialsForm = this.fb.group({ testimonials_badge: [''], testimonials_title: [''], testimonials_subtitle: [''], testimonials_prev_icon: ['chevron-left'], testimonials_next_icon: ['chevron-right'] });
    this.ctaForm = this.fb.group({ cta_title: [''], cta_subtitle: [''], cta_primary_label: ['Prendre rendez-vous'] });
  }
  ngOnInit(): void {
    this.api.getContent('home','hero_badge').subscribe({ next: (i) => this.heroForm.patchValue({ hero_badge: i?.content || '' }), error: () => {} });
    this.api.getContent('home','hero_stats').subscribe({ next: (i) => this.heroForm.patchValue({ hero_stats: i?.content || '[]' }), error: () => {} });
    this.api.getContent('home','why_badge').subscribe({ next: (i) => this.whyForm.patchValue({ why_badge: i?.content || '' }), error: () => {} });
    this.api.getContent('home','why_title').subscribe({ next: (i) => this.whyForm.patchValue({ why_title: i?.content || '' }), error: () => {} });
    this.api.getContent('home','why_subtitle').subscribe({ next: (i) => this.whyForm.patchValue({ why_subtitle: i?.content || '' }), error: () => {} });
    this.api.getContent('home','why_cta_label').subscribe({ next: (i) => this.whyForm.patchValue({ why_cta_label: i?.content || '' }), error: () => {} });
    this.api.getContent('home','services_badge').subscribe({ next: (i) => this.servicesForm.patchValue({ services_badge: i?.content || '' }), error: () => {} });
    this.api.getContent('home','services_title').subscribe({ next: (i) => this.servicesForm.patchValue({ services_title: i?.content || '' }), error: () => {} });
    this.api.getContent('home','services_subtitle').subscribe({ next: (i) => this.servicesForm.patchValue({ services_subtitle: i?.content || '' }), error: () => {} });
    this.api.getContent('home','testimonials_badge').subscribe({ next: (i) => this.testimonialsForm.patchValue({ testimonials_badge: i?.content || '' }), error: () => {} });
    this.api.getContent('home','testimonials_title').subscribe({ next: (i) => this.testimonialsForm.patchValue({ testimonials_title: i?.content || '' }), error: () => {} });
    this.api.getContent('home','testimonials_subtitle').subscribe({ next: (i) => this.testimonialsForm.patchValue({ testimonials_subtitle: i?.content || '' }), error: () => {} });
    this.api.getContent('home','testimonials_prev_icon').subscribe({ next: (i) => this.testimonialsForm.patchValue({ testimonials_prev_icon: i?.content || 'chevron-left' }), error: () => {} });
    this.api.getContent('home','testimonials_next_icon').subscribe({ next: (i) => this.testimonialsForm.patchValue({ testimonials_next_icon: i?.content || 'chevron-right' }), error: () => {} });
    this.api.getContent('home','cta_title').subscribe({ next: (i) => this.ctaForm.patchValue({ cta_title: i?.content || '' }), error: () => {} });
    this.api.getContent('home','cta_subtitle').subscribe({ next: (i) => this.ctaForm.patchValue({ cta_subtitle: i?.content || '' }), error: () => {} });
    this.api.getContent('home','cta_primary_label').subscribe({ next: (i) => this.ctaForm.patchValue({ cta_primary_label: i?.content || 'Prendre rendez-vous' }), error: () => {} });
  }
  saveHeroMeta() {
    const v = this.heroForm.value as any;
    this.api.saveContent({ page_name: 'home', section_name: 'hero_badge', content_type: 'text', content: v.hero_badge || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'home', section_name: 'hero_stats', content_type: 'json', content: v.hero_stats || '[]' }).subscribe({ next: () => {}, error: () => {} });
    this.snack.open('Hero (badge & stats) enregistré', 'Fermer', { duration: 3000 });
  }
  saveWhy() {
    const v = this.whyForm.value as any;
    this.api.saveContent({ page_name: 'home', section_name: 'why_badge', content_type: 'text', content: v.why_badge || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'home', section_name: 'why_title', content_type: 'text', content: v.why_title || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'home', section_name: 'why_subtitle', content_type: 'text', content: v.why_subtitle || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'home', section_name: 'why_cta_label', content_type: 'text', content: v.why_cta_label || '' }).subscribe({ next: () => {}, error: () => {} });
    this.snack.open('Pourquoi nous choisir enregistré', 'Fermer', { duration: 3000 });
  }
  saveServicesSection() {
    const v = this.servicesForm.value as any;
    this.api.saveContent({ page_name: 'home', section_name: 'services_badge', content_type: 'text', content: v.services_badge || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'home', section_name: 'services_title', content_type: 'text', content: v.services_title || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'home', section_name: 'services_subtitle', content_type: 'text', content: v.services_subtitle || '' }).subscribe({ next: () => {}, error: () => {} });
    this.snack.open('Section Services (Accueil) enregistrée', 'Fermer', { duration: 3000 });
  }
  saveTestimonials() {
    const v = this.testimonialsForm.value as any;
    this.api.saveContent({ page_name: 'home', section_name: 'testimonials_badge', content_type: 'text', content: v.testimonials_badge || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'home', section_name: 'testimonials_title', content_type: 'text', content: v.testimonials_title || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'home', section_name: 'testimonials_subtitle', content_type: 'text', content: v.testimonials_subtitle || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'home', section_name: 'testimonials_prev_icon', content_type: 'text', content: v.testimonials_prev_icon || 'chevron-left' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'home', section_name: 'testimonials_next_icon', content_type: 'text', content: v.testimonials_next_icon || 'chevron-right' }).subscribe({ next: () => {}, error: () => {} });
    this.snack.open('Témoignages enregistrés', 'Fermer', { duration: 3000 });
  }
  saveCta() {
    const v = this.ctaForm.value as any;
    this.api.saveContent({ page_name: 'home', section_name: 'cta_title', content_type: 'text', content: v.cta_title || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'home', section_name: 'cta_subtitle', content_type: 'text', content: v.cta_subtitle || '' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'home', section_name: 'cta_primary_label', content_type: 'text', content: v.cta_primary_label || 'Prendre rendez-vous' }).subscribe({ next: () => {}, error: () => {} });
    this.snack.open('CTA global enregistré', 'Fermer', { duration: 3000 });
  }
}
