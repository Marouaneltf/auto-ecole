import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';

@Component({
  selector: 'app-admin-home-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Accueil — Services</mat-card-title>
          <mat-card-subtitle>Textes de présentation</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="grid">
              <div class="full">
                <app-admin-input label="Texte introductif" kind="textarea" [rows]="3" formControlName="intro"></app-admin-input>
              </div>
              <div class="full">
                <app-admin-input label="Texte du bouton" formControlName="cta"></app-admin-input>
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
export class AdminHomeServicesComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({ intro: [''], cta: ['En savoir plus'] });
  }
  ngOnInit(): void {
    this.api.getContent('home','services_intro').subscribe({ next: (i) => this.form.patchValue({ intro: i?.content || '' }), error: () => {} });
    this.api.getContent('home','services_cta').subscribe({ next: (i) => this.form.patchValue({ cta: i?.content || 'En savoir plus' }), error: () => {} });
  }
  save() {
    const v = this.form.value as any;
    this.api.saveContent({ page_name: 'home', section_name: 'services_intro', content_type: 'text', content: v.intro }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'home', section_name: 'services_cta', content_type: 'text', content: v.cta }).subscribe({ next: () => {}, error: () => {} });
    this.snack.open('Services (Accueil) enregistrés', 'Fermer', { duration: 3000 });
  }
}
