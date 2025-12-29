import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-content-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des contenus</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="contentForm" (ngSubmit)="save()">
            <div class="grid">
              <mat-form-field appearance="outline">
                <mat-label>Page</mat-label>
                <input matInput formControlName="page_name" placeholder="ex: home, about, footer">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Section</mat-label>
                <input matInput formControlName="section_name" placeholder="ex: hero_tagline">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Type</mat-label>
                <mat-select formControlName="content_type">
                  <mat-option value="text">text</mat-option>
                  <mat-option value="html">html</mat-option>
                  <mat-option value="json">json</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contenu</mat-label>
              <textarea matInput formControlName="content" rows="4"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Métadonnées (JSON)</mat-label>
              <textarea matInput formControlName="metadata" rows="3" placeholder='{"key":"value"}'></textarea>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button mat-stroked-button type="button" (click)="reset()">Nouveau</button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="list-card">
        <mat-card-content>
          <table mat-table [dataSource]="items" class="full-width-table">
            <ng-container matColumnDef="page">
              <th mat-header-cell *matHeaderCellDef> Page </th>
              <td mat-cell *matCellDef="let el"> {{el.page_name}} </td>
            </ng-container>
            <ng-container matColumnDef="section">
              <th mat-header-cell *matHeaderCellDef> Section </th>
              <td mat-cell *matCellDef="let el"> {{el.section_name}} </td>
            </ng-container>
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef> Type </th>
              <td mat-cell *matCellDef="let el"> {{el.content_type}} </td>
            </ng-container>
            <ng-container matColumnDef="updated">
              <th mat-header-cell *matHeaderCellDef> Modifié </th>
              <td mat-cell *matCellDef="let el"> {{el.updated_at | date:'short'}} </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let el">
                <button mat-button color="primary" (click)="edit(el)">Modifier</button>
                <button mat-button color="warn" (click)="remove(el)">Supprimer</button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1000px;
      margin: 20px auto;
      padding: 0 20px;
    }
    .grid {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr;
      gap: 16px;
    }
    .full-width {
      width: 100%;
    }
    .list-card {
      margin-top: 20px;
    }
    .full-width-table {
      width: 100%;
    }
  `]
})
export class ContentManagerComponent implements OnInit {
  contentForm: FormGroup;
  items: any[] = [];
  displayedColumns = ['page', 'section', 'type', 'updated', 'actions'];
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.contentForm = this.fb.group({
      page_name: ['', Validators.required],
      section_name: ['', Validators.required],
      content_type: ['text'],
      content: [''],
      metadata: ['']
    });
  }

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/admin/login']);
      return;
    }
    this.load();
  }

  load() {
    this.api.listContent().subscribe({
      next: (data) => this.items = data,
      error: () => this.snack.open('Erreur de chargement des contenus', 'Fermer', { duration: 3000 })
    });
  }

  save() {
    if (this.contentForm.invalid) return;
    this.isSaving = true;
    const value = { ...this.contentForm.value };
    if (value.metadata) {
      try {
        value.metadata = JSON.parse(value.metadata);
      } catch {
        this.snack.open('Métadonnées doivent être un JSON valide', 'Fermer', { duration: 3000 });
        this.isSaving = false;
        return;
      }
    } else {
      value.metadata = null;
    }
    this.api.saveContent(value).subscribe({
      next: () => {
        this.isSaving = false;
        this.snack.open('Contenu enregistré', 'Fermer', { duration: 3000 });
        this.reset();
        this.load();
      },
      error: () => {
        this.isSaving = false;
        this.snack.open('Erreur lors de l’enregistrement', 'Fermer', { duration: 3000 });
      }
    });
  }

  edit(el: any) {
    this.contentForm.patchValue({
      page_name: el.page_name,
      section_name: el.section_name,
      content_type: el.content_type,
      content: el.content,
      metadata: el.metadata ? JSON.stringify(el.metadata) : ''
    });
  }

  remove(el: any) {
    if (!confirm('Supprimer ce contenu ?')) return;
    this.api.deleteContent(el.id).subscribe({
      next: () => {
        this.snack.open('Contenu supprimé', 'Fermer', { duration: 3000 });
        this.load();
      },
      error: () => this.snack.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 })
    });
  }

  reset() {
    this.contentForm.reset({ page_name: '', section_name: '', content_type: 'text', content: '', metadata: '' });
  }
}

