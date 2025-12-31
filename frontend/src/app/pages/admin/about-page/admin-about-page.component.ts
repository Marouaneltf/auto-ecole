import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';
import { AdminAboutComponent } from '../about/admin-about.component';
import { AdminValuesEditorComponent } from '../../../admin/shared/admin-values-editor/admin-values-editor.component';
import { AdminTeamEditorComponent } from '../../../admin/shared/admin-team-editor/admin-team-editor.component';

@Component({
  selector: 'app-admin-about-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent, AdminAboutComponent, AdminValuesEditorComponent, AdminTeamEditorComponent],
  template: `
    <div class="container">
      <div class="section-menu">
        <button class="menu-card" [class.active]="active==='main'" (click)="active='main'">
          <div class="menu-card-title">Contenu principal</div>
          <div class="menu-card-sub">Texte et image</div>
        </button>
        <button class="menu-card" [class.active]="active==='timeline'" (click)="active='timeline'">
          <div class="menu-card-title">Parcours (timeline)</div>
          <div class="menu-card-sub">Liste JSON</div>
        </button>
      </div>
      <mat-card>
        <mat-card-header>
          <mat-card-title>À propos — Valeurs</mat-card-title>
          <mat-card-subtitle>Icône, titre, description</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <app-admin-values-editor></app-admin-values-editor>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-header>
          <mat-card-title>À propos — Équipe</mat-card-title>
          <mat-card-subtitle>Fiche membre avec avatar</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <app-admin-team-editor></app-admin-team-editor>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-header>
          <mat-card-title>À propos — Contenu principal</mat-card-title>
          <mat-card-subtitle>Texte et image</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="active==='main'">
          <app-admin-about></app-admin-about>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>À propos — Parcours (timeline)</mat-card-title>
          <mat-card-subtitle>Liste JSON des étapes</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="active==='timeline'">
          <form [formGroup]="timelineForm" (ngSubmit)="saveTimeline()">
            <app-admin-input label="Timeline (JSON)" kind="textarea" [rows]="6" placeholder='[{"year":"2010","title":"Fondation","description":"..."}]' formControlName="timeline"></app-admin-input>
            <button mat-raised-button color="primary" type="submit">Enregistrer</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 20px auto; padding: 0 20px; }
    .section-menu{display:grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px;}
    .menu-card{border:none; text-align:left; cursor:pointer; border-radius: 12px; padding: 12px; background: #f3f4f6;}
    .menu-card:hover{background:#e5e7eb}
    .menu-card.active{background:#d1d5db}
    .menu-card.missing{outline: 2px solid #ef4444}
    .menu-card-title{font-weight:700; color:#111827}
    .menu-card-sub{font-size:12px; color:#6b7280}
  `]
})
export class AdminAboutPageComponent implements OnInit {
  timelineForm: FormGroup;
  active: 'main'|'timeline' = 'main';
  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.timelineForm = this.fb.group({ timeline: ['[]'] });
  }
  ngOnInit(): void {
    this.api.getContent('about','timeline').subscribe({ next: (i) => this.timelineForm.patchValue({ timeline: i?.content || '[]' }), error: () => {} });
  }
  saveTimeline() {
    const v = this.timelineForm.value as any;
    this.api.saveContent({ page_name: 'about', section_name: 'timeline', content_type: 'json', content: v.timeline || '[]' }).subscribe({ next: () => {}, error: () => {} });
    this.snack.open('Timeline enregistrée', 'Fermer', { duration: 3000 });
  }
}
