import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';
import { AdminImagePickerComponent } from '../../../admin/shared/admin-image-picker/admin-image-picker.component';

@Component({
  selector: 'app-admin-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent, AdminImagePickerComponent],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Page À propos</mat-card-title>
          <mat-card-subtitle>Texte, image, valeurs, équipe, CTA</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="grid">
              <div class="full">
                <app-admin-input label="Texte de l’histoire" kind="textarea" [rows]="5" formControlName="story"></app-admin-input>
              </div>
              <div class="full">
                <app-admin-image-picker label="Image" [(selectedId)]="imgId"></app-admin-image-picker>
              </div>
              <div class="full">
                <app-admin-input label="Titre valeurs" formControlName="values_title"></app-admin-input>
              </div>
              <div class="full">
                <app-admin-input label="Sous-titre valeurs" formControlName="values_subtitle"></app-admin-input>
              </div>
              <div class="full">
                <app-admin-input label="Valeurs (JSON)" kind="textarea" [rows]="6" placeholder='[{"icon":"award","title":"...","description":"..."}]' formControlName="values"></app-admin-input>
              </div>
              <div class="full">
                <app-admin-input label="Titre équipe" formControlName="team_title"></app-admin-input>
              </div>
              <div class="full">
                <app-admin-input label="Sous-titre équipe" formControlName="team_subtitle"></app-admin-input>
              </div>
              <div class="full">
                <app-admin-input label="Équipe (JSON)" kind="textarea" [rows]="6" placeholder='[{"name":"...","role":"...","description":"...","image":1}]' formControlName="team"></app-admin-input>
              </div>
              <div class="full">
                <app-admin-input label="CTA titre" formControlName="cta_title"></app-admin-input>
              </div>
              <div class="full">
                <app-admin-input label="CTA sous-titre" formControlName="cta_subtitle"></app-admin-input>
              </div>
              <div class="full">
                <app-admin-input label="CTA bouton principal" formControlName="cta_primary_label"></app-admin-input>
              </div>
            </div>
            <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">{{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 20px auto; padding: 0 20px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .full { grid-column: 1 / -1; }
  `]
})
export class AdminAboutComponent implements OnInit {
  form: FormGroup;
  isSaving = false;
  imgId: number | null = null;

  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({
      story: ['', Validators.required],
      values_title: ['Nos valeurs'],
      values_subtitle: ['Ce qui nous guide chaque jour'],
      values: ['[]'],
      team_title: ['Notre équipe'],
      team_subtitle: ['Des professionnels passionnés à votre service'],
      team: ['[]'],
      cta_title: [''],
      cta_subtitle: [''],
      cta_primary_label: ['Prendre rendez-vous']
    });
  }
  ngOnInit(): void {
    this.api.getContent('about','story_text').subscribe({ next: (i) => this.form.patchValue({ story: i?.content || '' }), error: () => {} });
    this.api.getContent('about','image').subscribe({
      next: (i) => { if (i?.content_type === 'media') this.imgId = Number(i.content); },
      error: () => {}
    });
    this.api.getContent('about','values_title').subscribe({ next: (i) => this.form.patchValue({ values_title: i?.content || 'Nos valeurs' }), error: () => {} });
    this.api.getContent('about','values_subtitle').subscribe({ next: (i) => this.form.patchValue({ values_subtitle: i?.content || 'Ce qui nous guide chaque jour' }), error: () => {} });
    this.api.getContent('about','values').subscribe({ next: (i) => this.form.patchValue({ values: i?.content || '[]' }), error: () => {} });
    this.api.getContent('about','team_title').subscribe({ next: (i) => this.form.patchValue({ team_title: i?.content || 'Notre équipe' }), error: () => {} });
    this.api.getContent('about','team_subtitle').subscribe({ next: (i) => this.form.patchValue({ team_subtitle: i?.content || 'Des professionnels passionnés à votre service' }), error: () => {} });
    this.api.getContent('about','team').subscribe({ next: (i) => this.form.patchValue({ team: i?.content || '[]' }), error: () => {} });
    this.api.getContent('about','cta_title').subscribe({ next: (i) => this.form.patchValue({ cta_title: i?.content || '' }), error: () => {} });
    this.api.getContent('about','cta_subtitle').subscribe({ next: (i) => this.form.patchValue({ cta_subtitle: i?.content || '' }), error: () => {} });
    this.api.getContent('about','cta_primary_label').subscribe({ next: (i) => this.form.patchValue({ cta_primary_label: i?.content || 'Prendre rendez-vous' }), error: () => {} });
  }
  save() {
    this.isSaving = true;
    const v = this.form.value as any;
    const ops = [
      this.api.saveContent({ page_name: 'about', section_name: 'story_text', content_type: 'text', content: v.story }),
      this.api.saveContent({ page_name: 'about', section_name: 'values_title', content_type: 'text', content: v.values_title }),
      this.api.saveContent({ page_name: 'about', section_name: 'values_subtitle', content_type: 'text', content: v.values_subtitle }),
      this.api.saveContent({ page_name: 'about', section_name: 'values', content_type: 'json', content: v.values }),
      this.api.saveContent({ page_name: 'about', section_name: 'team_title', content_type: 'text', content: v.team_title }),
      this.api.saveContent({ page_name: 'about', section_name: 'team_subtitle', content_type: 'text', content: v.team_subtitle }),
      this.api.saveContent({ page_name: 'about', section_name: 'team', content_type: 'json', content: v.team }),
      this.api.saveContent({ page_name: 'about', section_name: 'cta_title', content_type: 'text', content: v.cta_title || '' }),
      this.api.saveContent({ page_name: 'about', section_name: 'cta_subtitle', content_type: 'text', content: v.cta_subtitle || '' }),
      this.api.saveContent({ page_name: 'about', section_name: 'cta_primary_label', content_type: 'text', content: v.cta_primary_label || '' })
    ];
    if (this.imgId) ops.push(this.api.saveContent({ page_name: 'about', section_name: 'image', content_type: 'media', content: String(this.imgId) }));
    let done = 0;
    ops.forEach(o => o.subscribe({ next: () => { done++; if (done === ops.length) { this.isSaving = false; this.snack.open('À propos enregistré', 'Fermer', { duration: 3000 }); } }, error: () => { this.isSaving = false; this.snack.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 }); } }));
  }
}
