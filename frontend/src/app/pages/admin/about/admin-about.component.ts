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
          <mat-card-subtitle>Texte et image</mat-card-subtitle>
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
    this.form = this.fb.group({ story: ['', Validators.required] });
  }
  ngOnInit(): void {
    this.api.getContent('about','story_text').subscribe({ next: (i) => this.form.patchValue({ story: i?.content || '' }), error: () => {} });
    this.api.getContent('about','image').subscribe({
      next: (i) => { if (i?.content_type === 'media') this.imgId = Number(i.content); },
      error: () => {}
    });
  }
  save() {
    this.isSaving = true;
    const v = this.form.value;
    const ops = [ this.api.saveContent({ page_name: 'about', section_name: 'story_text', content_type: 'text', content: v.story }) ];
    if (this.imgId) ops.push(this.api.saveContent({ page_name: 'about', section_name: 'image', content_type: 'media', content: String(this.imgId) }));
    let done = 0;
    ops.forEach(o => o.subscribe({ next: () => { done++; if (done === ops.length) { this.isSaving = false; this.snack.open('À propos enregistré', 'Fermer', { duration: 3000 }); } }, error: () => { this.isSaving = false; this.snack.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 }); } }));
  }
}
