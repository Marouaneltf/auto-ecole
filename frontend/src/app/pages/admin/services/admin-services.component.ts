import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, AdminInputComponent],
  template: `
    <div class="container">
      <h2>Gestion des services</h2>
      <div class="grid">
        <section>
          <h3>Catégories</h3>
          <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()" class="form-grid">
            <app-admin-input label="Nom" formControlName="name"></app-admin-input>
            <app-admin-input label="Slug" formControlName="slug"></app-admin-input>
            <div class="row">
              <button class="btn" type="submit">{{ editingCategory ? 'Mettre à jour' : 'Ajouter' }}</button>
              <button *ngIf="editingCategory" class="btn-secondary" type="button" (click)="resetCategory()">Annuler</button>
            </div>
          </form>
          <ul class="list">
            <li *ngFor="let c of categories" class="list-item">
              <span>{{ c.name }} ({{ c.slug }})</span>
              <div class="actions">
                <button class="btn-secondary" (click)="editCategory(c)">Modifier</button>
              </div>
            </li>
          </ul>
        </section>
        <section>
          <h3>Services</h3>
          <form [formGroup]="serviceForm" (ngSubmit)="saveService()" class="form-grid">
            <div class="full">
              <app-admin-input label="Catégorie" kind="select" formControlName="category_id">
                <option [value]="''" disabled>Choisir une catégorie</option>
                <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
              </app-admin-input>
            </div>
            <app-admin-input label="Nom" formControlName="name"></app-admin-input>
            <app-admin-input label="Slug" formControlName="slug"></app-admin-input>
            <div class="full">
              <app-admin-input label="Description" kind="textarea" [rows]="4" formControlName="description"></app-admin-input>
            </div>
            <app-admin-input label="Prix (€)" type="number" formControlName="price"></app-admin-input>
            <app-admin-input label="Durée" formControlName="duration"></app-admin-input>
            <app-admin-input label="Icône" placeholder="car, award, file-text" formControlName="icon"></app-admin-input>
            <div class="row">
              <button class="btn" type="submit">{{ editingService ? 'Mettre à jour' : 'Ajouter' }}</button>
              <button *ngIf="editingService" class="btn-secondary" type="button" (click)="resetService()">Annuler</button>
            </div>
          </form>
          <ul class="list">
            <li *ngFor="let s of services" class="list-item">
              <span>{{ s.name }} — {{ s.price }} € ({{ s.duration }})</span>
              <div class="actions">
                <button class="btn-secondary" (click)="editService(s)">Modifier</button>
                <button class="btn-danger" (click)="deleteService(s)">Supprimer</button>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 20px auto; padding: 0 20px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    section { background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 16px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
    .row { display: flex; gap: 8px; }
    .btn { padding: 8px 12px; border-radius: 4px; background: #1E40AF; color: #fff; border: none; cursor: pointer; }
    .btn-secondary { padding: 8px 12px; border-radius: 4px; background: #e5e7eb; color: #111827; border: none; cursor: pointer; }
    .btn-danger { padding: 8px 12px; border-radius: 4px; background: #dc2626; color: #fff; border: none; cursor: pointer; }
    .list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
    .list-item { display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #eee; border-radius: 6px; }
    .actions { display: flex; gap: 8px; }
    .full{grid-column:1 / -1}
  `]
})
export class AdminServicesComponent implements OnInit {
  categories: any[] = [];
  services: any[] = [];
  categoryForm: FormGroup;
  serviceForm: FormGroup;
  editingCategory: any = null;
  editingService: any = null;

  constructor(private api: ApiService, private fb: FormBuilder, private snack: MatSnackBar) {
    this.categoryForm = this.fb.group({ name: ['', Validators.required], slug: ['', Validators.required] });
    this.serviceForm = this.fb.group({
      category_id: ['', Validators.required],
      name: ['', Validators.required],
      slug: ['', Validators.required],
      description: ['', Validators.required],
      price: [''],
      duration: [''],
      icon: ['car']
    });
  }

  ngOnInit() { this.reload(); }
  reload() {
    this.api.getCategories().subscribe({ next: (c) => this.categories = c, error: () => {} });
    this.api.getServices().subscribe({ next: (s) => this.services = s, error: () => {} });
  }

  editCategory(c: any) { this.editingCategory = c; this.categoryForm.patchValue({ name: c.name, slug: c.slug }); }
  resetCategory() { this.editingCategory = null; this.categoryForm.reset(); }
  saveCategory() {
    const v = this.categoryForm.value as any;
    if (!this.categoryForm.valid) return;
    if (this.editingCategory) {
      this.snack.open('Mise à jour des catégories non disponible', 'Fermer', { duration: 3000 });
    } else {
      this.api.createCategory(v).subscribe({
        next: () => { this.snack.open('Catégorie créée', 'Fermer', { duration: 3000 }); this.reload(); this.resetCategory(); },
        error: () => this.snack.open('Erreur création catégorie', 'Fermer', { duration: 3000 })
      });
    }
  }

  editService(s: any) { this.editingService = s; this.serviceForm.patchValue(s); }
  resetService() { this.editingService = null; this.serviceForm.reset(); }
  saveService() {
    const v = this.serviceForm.value as any;
    if (!this.serviceForm.valid) return;
    if (this.editingService) {
      this.api.updateService(this.editingService.id, v).subscribe({
        next: () => { this.snack.open('Service mis à jour', 'Fermer', { duration: 3000 }); this.reload(); this.resetService(); },
        error: () => this.snack.open('Erreur mise à jour', 'Fermer', { duration: 3000 })
      });
    } else {
      this.api.createService(v).subscribe({
        next: () => { this.snack.open('Service créé', 'Fermer', { duration: 3000 }); this.reload(); this.resetService(); },
        error: () => this.snack.open('Erreur création', 'Fermer', { duration: 3000 })
      });
    }
  }

  deleteService(s: any) {
    if (!confirm(`Supprimer ${s.name} ?`)) return;
    this.api.deleteService(s.id).subscribe({
      next: () => { this.snack.open('Service supprimé', 'Fermer', { duration: 3000 }); this.reload(); },
      error: () => this.snack.open('Erreur suppression', 'Fermer', { duration: 3000 })
    });
  }
}
