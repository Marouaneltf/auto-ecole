import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';
import { AdminImagePickerComponent } from '../../../admin/shared/admin-image-picker/admin-image-picker.component';

@Component({
  selector: 'app-admin-home-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent, AdminImagePickerComponent],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Accueil — À propos</mat-card-title>
          <mat-card-subtitle>Texte et image de prévisualisation</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="grid">
              <div class="full">
                <app-admin-input label="Texte" kind="textarea" [rows]="3" formControlName="text"></app-admin-input>
              </div>
              <div class="full">
                <app-admin-image-picker label="Image" [(selectedId)]="imgId"></app-admin-image-picker>
              </div>
            </div>
            <button mat-raised-button color="primary" type="submit">Enregistrer</button>
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
export class AdminHomeAboutComponent implements OnInit {
  form: FormGroup;
  imgId: number | null = null;

  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({ text: [''] });
  }
  ngOnInit(): void {
    this.api.getContent('home','about_preview_text').subscribe({ next: (i) => this.form.patchValue({ text: i?.content || '' }), error: () => {} });
    this.api.getContent('home','about_preview_image').subscribe({
      next: (i) => { if (i?.content_type === 'media') this.imgId = Number(i.content); },
      error: () => {}
    });
  }
  save() {
    const v = this.form.value as any;
    this.api.saveContent({ page_name: 'home', section_name: 'about_preview_text', content_type: 'text', content: v.text }).subscribe({ next: () => {}, error: () => {} });
    if (this.imgId) this.api.saveContent({ page_name: 'home', section_name: 'about_preview_image', content_type: 'media', content: String(this.imgId) }).subscribe({ next: () => {}, error: () => {} });
    this.snack.open('Accueil — À propos enregistré', 'Fermer', { duration: 3000 });
  }
}
