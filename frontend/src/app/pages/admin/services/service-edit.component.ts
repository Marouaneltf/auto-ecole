import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';
import { AdminImagePickerComponent } from '../../../admin/shared/admin-image-picker/admin-image-picker.component';

@Component({
  selector: 'app-admin-service-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule, AdminInputComponent, AdminImagePickerComponent],
  template: `
    <div class="container">
      <div class="action-bar">
        <button class="btn-secondary" (click)="goBack()">Retour</button>
        <div class="spacer"></div>
        <button class="btn-secondary" (click)="cancel()">Annuler</button>
        <button class="btn" (click)="save()" [disabled]="!form.valid">Sauvegarder</button>
      </div>
      <h2 class="title">{{ isNew ? 'Nouveau service' : 'Modifier le service' }}</h2>
      <form [formGroup]="form" class="form-grid">
        <app-admin-input label="Nom" formControlName="name"></app-admin-input>
        <app-admin-input label="Slug" formControlName="slug"></app-admin-input>
        <div class="full">
          <app-admin-input label="Description" kind="textarea" [rows]="6" formControlName="description"></app-admin-input>
        </div>
        <app-admin-input label="Prix (€)" type="number" formControlName="price"></app-admin-input>
        <app-admin-input label="Durée" formControlName="duration"></app-admin-input>
        <app-admin-input label="Icône" kind="select" formControlName="icon">
          <option value="car">car</option>
          <option value="award">award</option>
          <option value="file-text">file-text</option>
          <option value="calendar">calendar</option>
          <option value="users">users</option>
        </app-admin-input>
        <div class="full">
          <app-admin-image-picker label="Image du service" [(selectedId)]="imageMediaId"></app-admin-image-picker>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container{max-width:820px; margin:16px auto; padding:0 16px;}
    .title{margin:0 0 8px 0; font-size:18px;}
    .action-bar{display:flex; align-items:center; gap:8px; margin-bottom:12px;}
    .spacer{flex:1}
    .form-grid{display:grid; grid-template-columns: 1fr 1fr; gap:12px;}
    .full{grid-column: 1 / -1}
    .btn{background:#1E40AF; color:#fff; border:none; border-radius:8px; padding:10px 14px; cursor:pointer;}
    .btn-secondary{background:#e5e7eb; color:#111827; border:none; border-radius:8px; padding:10px 14px; cursor:pointer;}
  `]
})
export class AdminServiceEditComponent implements OnInit {
  form: FormGroup;
  initial: any = null;
  isNew = false;
  id: number | null = null;
  imageMediaId: number | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      description: ['', Validators.required],
      price: [''],
      duration: [''],
      icon: ['car']
    });
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    this.isNew = !param;
    if (param) {
      this.id = Number(param);
      this.api.getServices().subscribe({
        next: (list) => {
          const s = list.find((x: any) => x.id === this.id);
          if (s) { this.initial = s; this.form.patchValue(s); this.imageMediaId = s.image_media_id || null; }
        },
        error: () => {}
      });
    }
  }

  goBack() { this.router.navigate(['/admin/services']); }
  cancel() { if (this.initial) this.form.patchValue(this.initial); else this.form.reset(); }
  save() {
    const v = this.form.value as any;
    if (!this.form.valid) return;
    v.image_media_id = this.imageMediaId || null;
    if (this.isNew) {
      this.api.createService(v).subscribe({
        next: () => { this.snack.open('Service créé', 'Fermer', { duration: 3000 }); this.goBack(); },
        error: () => this.snack.open('Erreur création', 'Fermer', { duration: 3000 })
      });
    } else if (this.id != null) {
      this.api.updateService(this.id, v).subscribe({
        next: () => { this.snack.open('Service mis à jour', 'Fermer', { duration: 3000 }); this.goBack(); },
        error: () => this.snack.open('Erreur mise à jour', 'Fermer', { duration: 3000 })
      });
    }
  }
}
