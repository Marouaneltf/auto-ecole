import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { AdminInputComponent } from '../admin-input/admin-input.component';

@Component({
  selector: 'app-admin-values-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent],
  template: `
    <div class="editor">
      <div class="header">
        <div class="title">Valeurs</div>
        <button class="btn" type="button" (click)="add()">Ajouter une valeur</button>
      </div>
      <div class="list">
        <div class="item" *ngFor="let g of values.controls; let i = index" [formGroup]="$any(g)">
          <div class="item-header">
            <div class="item-index">{{ i + 1 }}</div>
            <div class="item-actions">
              <button class="btn-secondary" type="button" (click)="moveUp(i)" [disabled]="i===0">↑</button>
              <button class="btn-secondary" type="button" (click)="moveDown(i)" [disabled]="i===values.length-1">↓</button>
              <button class="btn-danger" type="button" (click)="remove(i)">Supprimer</button>
            </div>
          </div>
          <div class="grid">
            <app-admin-input label="Icône" kind="select" formControlName="icon">
              <option *ngFor="let n of icons" [value]="n">{{ n }}</option>
            </app-admin-input>
            <app-admin-input label="Titre" formControlName="title"></app-admin-input>
          </div>
          <app-admin-input label="Description" kind="textarea" [rows]="3" formControlName="description"></app-admin-input>
        </div>
      </div>
      <div class="actions">
        <button class="btn" type="button" (click)="save()">Enregistrer les valeurs</button>
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
export class AdminValuesEditorComponent implements OnInit {
  form: FormGroup;
  icons = ['award','users','car','clock','shield','heart','book-open','check-circle'];
  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({ values: this.fb.array([]) });
  }
  get values(): FormArray {
    return this.form.get('values') as FormArray;
  }
  add(item: any = { icon: 'award', title: '', description: '' }) {
    this.values.push(this.fb.group({ icon: [item.icon || 'award'], title: [item.title || ''], description: [item.description || ''] }));
  }
  remove(i: number) { this.values.removeAt(i); }
  moveUp(i: number) {
    if (i === 0) return;
    const tmp = this.values.at(i);
    this.values.removeAt(i);
    this.values.insert(i - 1, tmp);
  }
  moveDown(i: number) {
    if (i >= this.values.length - 1) return;
    const tmp = this.values.at(i);
    this.values.removeAt(i);
    this.values.insert(i + 1, tmp);
  }
  ngOnInit(): void {
    this.api.getContent('about','values').subscribe({
      next: (i) => {
        try {
          const arr = JSON.parse(i?.content || '[]');
          (arr || []).forEach((it: any) => this.add(it));
          if (this.values.length === 0) this.add();
        } catch { this.add(); }
      },
      error: () => { this.add(); }
    });
  }
  save() {
    const payload = JSON.stringify(this.values.value);
    this.api.saveContent({ page_name: 'about', section_name: 'values', content_type: 'json', content: payload }).subscribe({
      next: () => this.snack.open('Valeurs enregistrées', 'Fermer', { duration: 3000 }),
      error: () => this.snack.open('Erreur d’enregistrement', 'Fermer', { duration: 3000 })
    });
  }
}
