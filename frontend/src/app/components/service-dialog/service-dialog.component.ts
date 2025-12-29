import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-service-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.service ? 'Modifier' : 'Ajouter' }} un service</h2>
    <mat-dialog-content>
      <form [formGroup]="serviceForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Catégorie</mat-label>
          <mat-select formControlName="category_id">
            <mat-option *ngFor="let cat of categories" [value]="cat.id">
              {{ cat.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Prix</mat-label>
            <input matInput type="number" formControlName="price">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Durée</mat-label>
            <input matInput formControlName="duration">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Icône (Emoji)</mat-label>
          <input matInput formControlName="icon">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-raised-button color="primary" [disabled]="serviceForm.invalid" (click)="save()">
        Enregistrer
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 10px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  `]
})
export class ServiceDialogComponent implements OnInit {
  serviceForm: FormGroup;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<ServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { service: any }
  ) {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      category_id: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      duration: ['', Validators.required],
      icon: ['🚗', Validators.required],
      slug: [''] // Auto-generated in backend usually, but form might need it
    });
  }

  ngOnInit() {
    this.apiService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    if (this.data.service) {
      this.serviceForm.patchValue(this.data.service);
    }
  }

  save() {
    if (this.serviceForm.valid) {
      const formValue = this.serviceForm.value;
      if (!formValue.slug) {
        formValue.slug = formValue.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      }
      this.dialogRef.close(formValue);
    }
  }
}
