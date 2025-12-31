import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { AdminInputComponent } from '../admin-input/admin-input.component';
import { AdminImagePickerComponent } from '../admin-image-picker/admin-image-picker.component';

@Component({
  selector: 'app-admin-vehicles-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent, AdminImagePickerComponent],
  template: `
    <div class="editor">
      <div class="header">
        <div class="title">Véhicules</div>
        <button class="btn" type="button" (click)="add()">Ajouter un véhicule</button>
      </div>
      <div class="list">
        <div class="item" *ngFor="let g of vehicles.controls; let i = index" [formGroup]="$any(g)">
          <div class="item-header">
            <div class="item-index">{{ i + 1 }}</div>
            <div class="item-actions">
              <button class="btn-secondary" type="button" (click)="moveUp(i)" [disabled]="i===0">↑</button>
              <button class="btn-secondary" type="button" (click)="moveDown(i)" [disabled]="i===vehicles.length-1">↓</button>
              <button class="btn-danger" type="button" (click)="remove(i)">Supprimer</button>
            </div>
          </div>
          <div class="grid">
            <app-admin-input label="Titre" formControlName="title"></app-admin-input>
            <app-admin-image-picker
              label="Image"
              [selectedId]="$any(g).get('image')?.value"
              (selectedIdChange)="($any(g).get('image')?.setValue($event))"
            ></app-admin-image-picker>
          </div>
          <app-admin-input label="Description" kind="textarea" [rows]="3" formControlName="description"></app-admin-input>
        </div>
      </div>
      <div class="actions">
        <button class="btn" type="button" (click)="save()">Enregistrer les véhicules</button>
      </div>
    </div>
  `,
  styles: [`
    .editor{display:grid; gap:12px}
    .header{display:flex; align-items:center; justify-content:space-between}
    .title{font-weight:800}
    .list{display:grid; gap:12px}
    .item{background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:12px}
    .item-header{display:flex; align-items:center; justify-content:space-between; margin-bottom:8px}
    .item-index{font-weight:700}
    .item-actions{display:flex; gap:6px}
    .grid{display:grid; grid-template-columns: 1fr 1fr; gap: 10px}
    .actions{display:flex; justify-content:flex-end}
    .btn{background:#1E40AF; color:#fff; border:none; border-radius:8px; padding:8px 12px; cursor:pointer}
    .btn-secondary{background:#e5e7eb; color:#111827; border:none; border-radius:8px; padding:6px 10px; cursor:pointer}
    .btn-danger{background:#ef4444; color:#fff; border:none; border-radius:8px; padding:6px 10px; cursor:pointer}
  `]
})
export class AdminVehiclesEditorComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({ vehicles: this.fb.array([]) });
  }
  get vehicles(): FormArray {
    return this.form.get('vehicles') as FormArray;
  }
  add(item: any = { title: '', description: '', image: null }) {
    this.vehicles.push(this.fb.group({ title: [item.title || ''], description: [item.description || ''], image: [item.image || null] }));
  }
  remove(i: number) { this.vehicles.removeAt(i); }
  moveUp(i: number) {
    if (i === 0) return;
    const tmp = this.vehicles.at(i);
    this.vehicles.removeAt(i);
    this.vehicles.insert(i - 1, tmp);
  }
  moveDown(i: number) {
    if (i >= this.vehicles.length - 1) return;
    const tmp = this.vehicles.at(i);
    this.vehicles.removeAt(i);
    this.vehicles.insert(i + 1, tmp);
  }
  ngOnInit(): void {
    this.api.getContent('services','vehicles').subscribe({
      next: (i) => {
        try {
          const arr = JSON.parse(i?.content || '[]');
          (arr || []).forEach((it: any) => this.add(it));
          if (this.vehicles.length === 0) this.add();
        } catch { this.add(); }
      },
      error: () => { this.add(); }
    });
  }
  save() {
    const payload = JSON.stringify(this.vehicles.value);
    this.api.saveContent({ page_name: 'services', section_name: 'vehicles', content_type: 'json', content: payload }).subscribe({
      next: () => this.snack.open('Véhicules enregistrés', 'Fermer', { duration: 3000 }),
      error: () => this.snack.open('Erreur d’enregistrement', 'Fermer', { duration: 3000 })
    });
  }
}
