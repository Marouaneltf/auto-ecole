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
  selector: 'app-admin-home-hero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent, AdminImagePickerComponent],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Accueil — Hero</mat-card-title>
          <mat-card-subtitle>Titre, sous-titre, image de fond</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="grid">
              <app-admin-input label="Titre" formControlName="title"></app-admin-input>
              <app-admin-input label="Sous-titre" formControlName="subtitle"></app-admin-input>
              <div class="full">
                <app-admin-image-picker label="Image de fond" [(selectedId)]="bgId"></app-admin-image-picker>
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
export class AdminHomeHeroComponent implements OnInit {
  form: FormGroup;
  isSaving = false;
  bgId: number | null = null;

  constructor(private fb: FormBuilder, public api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({ title: ['', Validators.required], subtitle: ['', Validators.required] });
  }
  ngOnInit(): void {
    this.api.getContent('home','hero_title').subscribe({ next: (i) => this.form.patchValue({ title: i?.content || '' }), error: () => {} });
    this.api.getContent('home','hero_tagline').subscribe({ next: (i) => this.form.patchValue({ subtitle: i?.content || '' }), error: () => {} });
    this.api.getContent('home','hero_background').subscribe({
      next: (i) => {
        if (i?.content_type === 'media') this.bgId = Number(i.content);
      },
      error: () => {}
    });
  }
  save() {
    this.isSaving = true;
    const v = this.form.value;
    const ops = [
      this.api.saveContent({ page_name: 'home', section_name: 'hero_title', content_type: 'text', content: v.title }),
      this.api.saveContent({ page_name: 'home', section_name: 'hero_tagline', content_type: 'text', content: v.subtitle }),
    ];
    if (this.bgId) ops.push(this.api.saveContent({ page_name: 'home', section_name: 'hero_background', content_type: 'media', content: String(this.bgId) }));
    let done = 0;
    ops.forEach(o => o.subscribe({ next: () => { done++; if (done === ops.length) { this.isSaving = false; this.snack.open('Hero enregistré', 'Fermer', { duration: 3000 }); } }, error: () => { this.isSaving = false; this.snack.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 }); } }));
  }
}
