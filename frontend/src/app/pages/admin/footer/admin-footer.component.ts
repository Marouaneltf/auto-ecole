import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';

@Component({
  selector: 'app-admin-footer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Pied de page</mat-card-title>
          <mat-card-subtitle>Horaires et réseaux sociaux</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="full">
              <app-admin-input label="Horaires (texte)" formControlName="opening_hours"></app-admin-input>
            </div>
            <div class="grid">
              <app-admin-input label="Facebook URL" type="url" formControlName="facebook"></app-admin-input>
              <app-admin-input label="Instagram URL" type="url" formControlName="instagram"></app-admin-input>
              <app-admin-input label="Twitter/X URL" type="url" formControlName="twitter"></app-admin-input>
            </div>
            <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">{{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 20px auto; padding: 0 20px; }
    .full { width: 100%; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  `]
})
export class AdminFooterComponent implements OnInit {
  form: FormGroup;
  isSaving = false;
  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({ opening_hours: [''], facebook: [''], instagram: [''], twitter: [''] });
  }
  ngOnInit(): void {
    this.api.getBusinessInfo().subscribe({
      next: (data) => {
        this.form.patchValue({ opening_hours: (data as any)?.opening_hours || '' });
        const sl = (data as any)?.social_links || {};
        this.form.patchValue({ facebook: sl.facebook || '', instagram: sl.instagram || '', twitter: sl.twitter || '' });
      },
      error: () => {}
    });
  }
  save() {
    this.isSaving = true;
    const v = this.form.value as any;
    const payload: any = { opening_hours: v.opening_hours, social_links: { facebook: v.facebook, instagram: v.instagram, twitter: v.twitter } };
    this.api.updateBusinessInfo(payload).subscribe({
      next: () => { this.isSaving = false; this.snack.open('Pied de page enregistré', 'Fermer', { duration: 3000 }); },
      error: () => { this.isSaving = false; this.snack.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 }); }
    });
  }
}
