import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';

@Component({
  selector: 'app-admin-legal-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Mentions légales</mat-card-title>
          <mat-card-subtitle>Titre et contenu HTML</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <app-admin-input label="Titre" formControlName="title"></app-admin-input>
            <app-admin-input label="Contenu (HTML)" kind="textarea" [rows]="10" formControlName="content_html"></app-admin-input>
            <button mat-raised-button color="primary" type="submit">Enregistrer</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.container { max-width: 900px; margin: 20px auto; padding: 0 20px; }`]
})
export class AdminLegalPageComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({ title: ['Mentions Légales'], content_html: [''] });
  }
  ngOnInit(): void {
    this.api.getContent('legal','title').subscribe({ next: (i) => this.form.patchValue({ title: i?.content || 'Mentions Légales' }), error: () => {} });
    this.api.getContent('legal','content_html').subscribe({ next: (i) => this.form.patchValue({ content_html: i?.content || '' }), error: () => {} });
  }
  save() {
    const v = this.form.value as any;
    this.api.saveContent({ page_name: 'legal', section_name: 'title', content_type: 'text', content: v.title || 'Mentions Légales' }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'legal', section_name: 'content_html', content_type: 'html', content: v.content_html || '' }).subscribe({ next: () => {}, error: () => {} });
    this.snack.open('Mentions légales enregistrées', 'Fermer', { duration: 3000 });
  }
}

