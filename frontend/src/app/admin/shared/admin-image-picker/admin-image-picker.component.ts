import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AdminInputComponent } from '../admin-input/admin-input.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

type Mode = 'choose' | 'upload';

@Component({
  selector: 'app-admin-image-picker',
  standalone: true,
  imports: [CommonModule, AdminInputComponent, MatSnackBarModule],
  template: `
    <div class="wrap">
      <div class="top">
        <div class="title">{{ label }}</div>
        <button class="btn" type="button" (click)="open()">Ajouter une image</button>
      </div>

      <div class="previewCard" [class.empty]="!selectedUrl">
        <div class="previewInner">
          <div class="placeholder" *ngIf="!selectedUrl">
            <div class="phTitle">Aucune image sélectionnée</div>
            <div class="phSub">Sélectionnez une image pour la prévisualiser ici</div>
          </div>
          <div class="imgWrap" *ngIf="selectedUrl">
            <div class="imgSkeleton" *ngIf="previewLoading"></div>
            <img
              class="img"
              [class.hidden]="previewLoading || previewError"
              [src]="selectedUrl"
              (load)="onPreviewLoad()"
              (error)="onPreviewError()"
              alt=""
            />
            <div class="imgError" *ngIf="previewError">Image introuvable</div>
          </div>
        </div>
      </div>
    </div>

    <div class="overlay" *ngIf="opened">
      <div class="backdrop" (click)="close()"></div>
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modalHeader">
          <div class="modalTitle">Ajouter une image</div>
          <button class="x" type="button" (click)="close()">✕</button>
        </div>

        <div class="tabs">
          <button type="button" class="tab" [class.active]="mode==='upload'" (click)="mode='upload'">📤 Upload</button>
          <button type="button" class="tab" [class.active]="mode==='choose'" (click)="mode='choose'">🖼 Choisir existante</button>
        </div>

        <div class="modalBody">
          <div *ngIf="mode==='upload'" class="upload">
            <app-admin-input
              label="Fichier image"
              kind="file"
              [accept]="'image/*'"
              (fileSelected)="onFilePicked($event)"
            ></app-admin-input>
            <div class="uploadRow">
              <button class="btn" type="button" [disabled]="!pickedFile || uploading" (click)="upload()">
                {{ uploading ? 'Téléversement...' : 'Téléverser' }}
              </button>
              <div class="small" *ngIf="uploading">Ne fermez pas cette fenêtre</div>
            </div>
          </div>

          <div *ngIf="mode==='choose'" class="choose">
            <div class="chooseTop">
              <div class="small">Cliquez une image pour la sélectionner</div>
              <button class="btnGhost" type="button" (click)="reload()" [disabled]="loading">Rafraîchir</button>
            </div>
            <div class="grid" [class.loading]="loading">
              <div class="thumb" *ngFor="let m of media" [class.selected]="m.id===tempSelectedId" (click)="selectTemp(m)">
                <div class="thumbSkeleton" *ngIf="loadingIds[m.id]"></div>
                <img
                  class="thumbImg"
                  [class.hidden]="loadingIds[m.id] || errorIds[m.id]"
                  [src]="getUrl(m)"
                  (load)="onThumbLoad(m.id)"
                  (error)="onThumbError(m.id)"
                  alt=""
                />
                <div class="thumbError" *ngIf="errorIds[m.id]">Indisponible</div>
              </div>
            </div>
          </div>
        </div>

        <div class="modalFooter">
          <button class="btnGhost" type="button" (click)="close()">Annuler</button>
          <button class="btn" type="button" (click)="confirm()" [disabled]="!tempSelectedId">Confirmer</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host{display:block}
    .wrap{display:grid; gap:10px}
    .top{display:flex; align-items:center; justify-content:space-between; gap:10px}
    .title{font-weight:700; color:#111827}
    .btn{border:none; border-radius:999px; padding:10px 16px; background:#1E40AF; color:#fff; cursor:pointer; font-weight:700; transition: transform .18s ease, box-shadow .18s ease, background .18s ease}
    .btn:hover{background:#16308a; box-shadow:0 10px 22px rgba(30,64,175,0.20); transform: translateY(-1px)}
    .btn:disabled{opacity:0.55; cursor:not-allowed; transform:none; box-shadow:none}
    .btnGhost{border:1px solid rgba(17,24,39,0.10); border-radius:999px; padding:10px 14px; background:rgba(255,255,255,0.7); color:#111827; cursor:pointer; font-weight:600}
    .btnGhost:disabled{opacity:0.55; cursor:not-allowed}
    .previewCard{border-radius:18px; background:linear-gradient(180deg, rgba(255,255,255,0.90), rgba(255,255,255,0.65)); border:1px solid rgba(17,24,39,0.08); box-shadow:0 14px 32px rgba(17,24,39,0.08); overflow:hidden}
    .previewInner{padding:14px}
    .placeholder{padding:22px; border-radius:14px; background:rgba(17,24,39,0.03); border:1px dashed rgba(17,24,39,0.12); text-align:center}
    .phTitle{font-weight:800; color:#111827}
    .phSub{margin-top:6px; font-size:13px; color:rgba(107,114,128,0.95)}
    .imgWrap{position:relative; border-radius:14px; overflow:hidden; border:1px solid rgba(17,24,39,0.08); background:rgba(17,24,39,0.03)}
    .img{width:100%; height:220px; object-fit:cover; display:block}
    .img.hidden{opacity:0}
    .imgSkeleton{position:absolute; inset:0; background:linear-gradient(90deg, rgba(17,24,39,0.04), rgba(17,24,39,0.10), rgba(17,24,39,0.04)); background-size:200% 100%; animation: shimmer 1.2s infinite}
    .imgError{position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:rgba(220,38,38,0.95); font-weight:700}
    @keyframes shimmer{0%{background-position:0% 0}100%{background-position:-200% 0}}

    .overlay{position:fixed; inset:0; z-index:50}
    .backdrop{position:absolute; inset:0; background:rgba(17,24,39,0.55); backdrop-filter: blur(6px)}
    .modal{position:relative; margin:40px auto; width:min(920px, calc(100% - 28px)); border-radius:20px;
      background:linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.82));
      border:1px solid rgba(255,255,255,0.55);
      box-shadow:0 30px 80px rgba(17,24,39,0.35);
      overflow:hidden;
      max-height: calc(100vh - 80px);
      display:flex; flex-direction:column;
    }
    .modalHeader{display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border-bottom:1px solid rgba(17,24,39,0.08)}
    .modalTitle{font-weight:900; color:#111827}
    .x{border:none; background:rgba(17,24,39,0.06); width:36px; height:36px; border-radius:999px; cursor:pointer}
    .tabs{display:flex; gap:10px; padding:12px 18px; border-bottom:1px solid rgba(17,24,39,0.08)}
    .tab{border:1px solid rgba(17,24,39,0.10); background:rgba(255,255,255,0.7); color:#111827; padding:10px 14px; border-radius:999px; cursor:pointer; font-weight:700}
    .tab.active{border-color:rgba(30,64,175,0.45); box-shadow:0 0 0 4px rgba(30,64,175,0.12)}
    .modalBody{padding:16px 18px; overflow:auto}
    .modalFooter{display:flex; justify-content:flex-end; gap:10px; padding:14px 18px; border-top:1px solid rgba(17,24,39,0.08)}
    .upload{display:grid; gap:12px}
    .uploadRow{display:flex; align-items:center; gap:12px}
    .small{font-size:12px; color:rgba(107,114,128,0.95)}
    .choose{display:grid; gap:12px}
    .chooseTop{display:flex; align-items:center; justify-content:space-between; gap:10px}
    .grid{display:grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap:10px}
    .thumb{position:relative; border-radius:14px; overflow:hidden; border:1px solid rgba(17,24,39,0.10); background:rgba(17,24,39,0.03); cursor:pointer; transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease}
    .thumb:hover{transform: translateY(-1px); box-shadow:0 14px 24px rgba(17,24,39,0.10)}
    .thumb.selected{border-color:rgba(30,64,175,0.55); box-shadow:0 0 0 4px rgba(30,64,175,0.14)}
    .thumbImg{width:100%; height:96px; object-fit:cover; display:block}
    .thumbImg.hidden{opacity:0}
    .thumbSkeleton{position:absolute; inset:0; background:linear-gradient(90deg, rgba(17,24,39,0.04), rgba(17,24,39,0.10), rgba(17,24,39,0.04)); background-size:200% 100%; animation: shimmer 1.2s infinite}
    .thumbError{position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:12px; color:rgba(220,38,38,0.95); font-weight:800}
  `]
})
export class AdminImagePickerComponent implements OnChanges {
  @Input() label = 'Image';
  @Input() selectedId: number | null = null;
  @Output() selectedIdChange = new EventEmitter<number | null>();

  opened = false;
  mode: Mode = 'choose';

  media: any[] = [];
  loading = false;
  uploading = false;
  pickedFile: File | null = null;

  tempSelectedId: number | null = null;
  selectedUrl = '';
  previewLoading = false;
  previewError = false;

  loadingIds: Record<number, boolean> = {};
  errorIds: Record<number, boolean> = {};

  constructor(public api: ApiService, private snack: MatSnackBar) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedId']) {
      this.hydratePreview();
    }
  }

  open() {
    this.opened = true;
    this.mode = 'choose';
    this.tempSelectedId = this.selectedId;
    this.reload();
  }

  close() {
    this.opened = false;
    this.pickedFile = null;
    this.uploading = false;
  }

  reload() {
    this.loading = true;
    this.loadingIds = {};
    this.errorIds = {};
    this.api.listMedia().subscribe({
      next: (items) => {
        this.media = items;
        this.loading = false;
        for (const m of items) this.loadingIds[m.id] = true;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Erreur chargement des médias', 'Fermer', { duration: 3000 });
      }
    });
  }

  onFilePicked(file: File | FileList | null) {
    this.pickedFile = file instanceof File ? file : null;
  }

  upload() {
    if (!this.pickedFile) return;
    this.uploading = true;
    const form = new FormData();
    form.append('file', this.pickedFile);
    this.api.uploadMedia(form).subscribe({
      next: (created) => {
        this.uploading = false;
        const id = Number(created?.id);
        if (id) {
          this.tempSelectedId = id;
          this.selectedId = id;
          this.selectedIdChange.emit(id);
          this.selectedUrl = this.api.resolveMediaUrl(created);
          this.previewLoading = true;
          this.previewError = false;
          this.mode = 'choose';
          this.reload();
        }
      },
      error: () => {
        this.uploading = false;
        this.snack.open('Échec du téléversement', 'Fermer', { duration: 3000 });
      }
    });
  }

  selectTemp(m: any) {
    this.tempSelectedId = Number(m.id);
  }

  confirm() {
    if (!this.tempSelectedId) return;
    this.selectedId = this.tempSelectedId;
    this.selectedIdChange.emit(this.tempSelectedId);
    const m = this.media.find(x => Number(x.id) === Number(this.tempSelectedId));
    this.selectedUrl = m ? this.getUrl(m) : '';
    this.previewLoading = !!this.selectedUrl;
    this.previewError = false;
    this.opened = false;
  }

  hydratePreview() {
    if (!this.selectedId) {
      this.selectedUrl = '';
      this.previewLoading = false;
      this.previewError = false;
      return;
    }
    this.previewLoading = true;
    this.previewError = false;
    this.api.listMedia().subscribe({
      next: (items) => {
        const m = items.find(x => Number(x.id) === Number(this.selectedId));
        this.selectedUrl = m ? this.getUrl(m) : '';
        this.previewLoading = !!this.selectedUrl;
        if (!this.selectedUrl) {
          this.previewLoading = false;
          this.previewError = true;
        }
      },
      error: () => {
        this.previewLoading = false;
        this.previewError = true;
      }
    });
  }

  getUrl(m: any) { return this.api.resolveMediaUrl(m); }
  onPreviewLoad() { this.previewLoading = false; }
  onPreviewError() { this.previewLoading = false; this.previewError = true; }
  onThumbLoad(id: number) { this.loadingIds[id] = false; }
  onThumbError(id: number) { this.loadingIds[id] = false; this.errorIds[id] = true; }
}

