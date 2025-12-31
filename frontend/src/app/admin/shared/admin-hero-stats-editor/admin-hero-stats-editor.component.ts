import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { AdminInputComponent } from '../admin-input/admin-input.component';

@Component({
  selector: 'app-admin-hero-stats-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent],
  template: `
    <div class="editor">
      <div class="header">
        <div class="title">Statistiques du Hero</div>
        <button class="btn" type="button" (click)="add()">Ajouter une statistique</button>
      </div>
      <div class="list">
        <div class="item" *ngFor="let g of stats.controls; let i = index" [formGroup]="$any(g)">
          <div class="item-header">
            <div class="item-index">{{ i + 1 }}</div>
            <div class="item-actions">
              <button class="btn-secondary" type="button" (click)="moveUp(i)" [disabled]="i===0">↑</button>
              <button class="btn-secondary" type="button" (click)="moveDown(i)" [disabled]="i===stats.length-1">↓</button>
              <button class="btn-danger" type="button" (click)="remove(i)">Supprimer</button>
            </div>
          </div>
          <div class="grid">
            <app-admin-input label="Valeur" formControlName="value"></app-admin-input>
            <app-admin-input label="Libellé" formControlName="label"></app-admin-input>
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="btn" type="button" (click)="save()">Enregistrer les statistiques</button>
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
export class AdminHeroStatsEditorComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({ stats: this.fb.array([]) });
  }
  get stats(): FormArray {
    return this.form.get('stats') as FormArray;
  }
  add(item: any = { value: '', label: '' }) {
    this.stats.push(this.fb.group({ value: [item.value || ''], label: [item.label || ''] }));
  }
  remove(i: number) { this.stats.removeAt(i); }
  moveUp(i: number) {
    if (i === 0) return;
    const tmp = this.stats.at(i);
    this.stats.removeAt(i);
    this.stats.insert(i - 1, tmp);
  }
  moveDown(i: number) {
    if (i >= this.stats.length - 1) return;
    const tmp = this.stats.at(i);
    this.stats.removeAt(i);
    this.stats.insert(i + 1, tmp);
  }
  ngOnInit(): void {
    this.api.getContent('home','hero_stats').subscribe({
      next: (i) => {
        try {
          const arr = JSON.parse(i?.content || '[]');
          (arr || []).forEach((it: any) => this.add(it));
          if (this.stats.length === 0) this.add();
        } catch { this.add(); }
      },
      error: () => { this.add(); }
    });
  }
  save() {
    const payload = JSON.stringify(this.stats.value);
    this.api.saveContent({ page_name: 'home', section_name: 'hero_stats', content_type: 'json', content: payload }).subscribe({
      next: () => this.snack.open('Statistiques enregistrées', 'Fermer', { duration: 3000 }),
      error: () => this.snack.open('Erreur d’enregistrement', 'Fermer', { duration: 3000 })
    });
  }
}
