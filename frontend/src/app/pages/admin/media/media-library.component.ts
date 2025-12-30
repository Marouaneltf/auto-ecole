import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';

@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, AdminInputComponent],
  template: `
    <div class="container">
      <h2>Médiathèque</h2>
      <div class="uploader">
        <app-admin-input label="Fichier image" kind="file" [accept]="'image/*'" (fileSelected)="onFilePicked($event)"></app-admin-input>
        <button mat-raised-button color="primary" (click)="upload()" [disabled]="!selectedFile || isUploading">
          {{ isUploading ? 'Téléversement...' : 'Téléverser' }}
        </button>
      </div>

      <div class="grid" *ngIf="items.length > 0; else empty">
        <mat-card class="media-card" *ngFor="let m of items">
          <img [src]="getUrl(m)" (error)="onImgError($event)" [alt]="m.alt_text || m.original_name">
          <div class="actions">
            <button mat-stroked-button color="warn" (click)="remove(m)"><mat-icon>delete</mat-icon> Supprimer</button>
          </div>
        </mat-card>
      </div>
      <ng-template #empty>
        <p class="empty">Aucun média pour le moment.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 20px auto; padding: 0 20px; }
    h2 { margin-bottom: 16px; }
    .uploader { display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: end; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .media-card { overflow: hidden; }
    .media-card img { width: 100%; height: 160px; object-fit: cover; display: block; }
    .actions { display: flex; justify-content: flex-end; padding: 8px; }
    .empty { color: #666; }
  `]
})
export class MediaLibraryComponent implements OnInit {
  items: any[] = [];
  selectedFile: File | null = null;
  isUploading = false;
  isLoading = false;

  constructor(public api: ApiService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.api.listMedia().subscribe({
      next: (data) => { this.items = data; this.isLoading = false; },
      error: () => this.snack.open('Erreur de chargement des médias', 'Fermer', { duration: 3000 })
    });
  }

  onFilePicked(file: File | FileList | null) {
    this.selectedFile = file instanceof File ? file : null;
  }

  upload() {
    if (!this.selectedFile) return;
    this.isUploading = true;
    const form = new FormData();
    form.append('file', this.selectedFile);
    this.api.uploadMedia(form).subscribe({
      next: () => {
        this.snack.open('Média téléversé', 'Fermer', { duration: 3000 });
        this.isUploading = false;
        this.selectedFile = null;
        this.load();
      },
      error: (err) => {
        this.isUploading = false;
        this.snack.open('Échec du téléversement', 'Fermer', { duration: 3000 });
      }
    });
  }

  getUrl(m: any) { return this.api.resolveMediaUrl(m); }
  onImgError(ev: Event) { const el = ev.target as HTMLImageElement; el.style.visibility = 'hidden'; }
  remove(m: any) {
    if (!confirm('Supprimer ce média ?')) return;
    this.api.deleteMedia(m.id).subscribe({
      next: () => { this.snack.open('Média supprimé', 'Fermer', { duration: 3000 }); this.load(); },
      error: () => this.snack.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 })
    });
  }
}
