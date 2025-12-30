import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminInputComponent } from '../../../admin/shared/admin-input/admin-input.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ui-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSnackBarModule, AdminInputComponent],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>UI & Branding</mat-card-title>
          <mat-card-subtitle>Couleurs principales</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="sectionTitle">Color board</div>
            <div class="board">
              <button
                type="button"
                class="palette"
                *ngFor="let p of palettes"
                (click)="applyPalette(p)"
                [class.selected]="isSelectedPalette(p)"
              >
                <div class="paletteTop">
                  <div class="paletteName">{{ p.name }}</div>
                  <div class="paletteMeta">{{ p.primary }} • {{ p.accent }}</div>
                </div>
                <div class="swatches">
                  <div class="swatch" [style.background]="p.primary"></div>
                  <div class="swatch" [style.background]="p.accent"></div>
                </div>
              </button>
            </div>

            <div class="sectionTitle">Custom</div>
            <div class="custom">
              <div class="colorRow">
                <div class="colorLabel">Primaire</div>
                <input class="colorInput" type="color" [value]="primaryValue" (input)="onColorPick('primary', $event)" />
                <div class="colorValue">{{ primaryValue }}</div>
              </div>
              <div class="colorRow">
                <div class="colorLabel">Accent</div>
                <input class="colorInput" type="color" [value]="accentValue" (input)="onColorPick('accent', $event)" />
                <div class="colorValue">{{ accentValue }}</div>
              </div>
            </div>

            <div class="grid">
              <app-admin-input label="Couleur primaire" placeholder="#1E40AF" formControlName="primary"></app-admin-input>
              <app-admin-input label="Couleur accent" placeholder="#F59E0B" formControlName="accent"></app-admin-input>
            </div>
            <div class="actions">
              <button mat-raised-button color="primary" type="submit">Enregistrer</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 20px auto; padding: 0 20px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .actions{margin-top:14px}
    .sectionTitle{
      margin: 6px 0 10px 0;
      font-weight: 900;
      color:#111827;
      letter-spacing: -0.02em;
    }
    .board{
      display:grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 14px;
    }
    .palette{
      border:none;
      text-align:left;
      cursor:pointer;
      border-radius: 18px;
      padding: 12px 12px 10px 12px;
      background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72));
      border: 1px solid rgba(17,24,39,0.10);
      box-shadow: 0 12px 24px rgba(17,24,39,0.08);
      transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
      backdrop-filter: blur(10px);
    }
    .palette:hover{
      transform: translateY(-1px);
      box-shadow: 0 16px 30px rgba(17,24,39,0.10);
      border-color: rgba(17,24,39,0.18);
    }
    .palette.selected{
      border-color: rgba(30,64,175,0.55);
      box-shadow: 0 16px 34px rgba(30,64,175,0.14), 0 0 0 4px rgba(30,64,175,0.14);
    }
    .paletteTop{display:flex; align-items:baseline; justify-content:space-between; gap:10px}
    .paletteName{font-weight:900; color:#111827}
    .paletteMeta{font-size:12px; color: rgba(107,114,128,0.95); white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
    .swatches{
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 10px;
    }
    .swatch{
      height: 46px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.55);
      box-shadow: inset 0 0 0 1px rgba(17,24,39,0.10);
    }
    .custom{
      border-radius: 18px;
      padding: 12px 12px 10px 12px;
      background: rgba(17,24,39,0.03);
      border: 1px solid rgba(17,24,39,0.08);
      margin-bottom: 14px;
      display:grid;
      gap: 10px;
    }
    .colorRow{
      display:grid;
      grid-template-columns: 90px auto 1fr;
      align-items:center;
      gap: 12px;
    }
    .colorLabel{font-weight:800; color:#111827}
    .colorInput{
      width: 54px;
      height: 40px;
      border-radius: 12px;
      border: 1px solid rgba(17,24,39,0.10);
      background: transparent;
      padding: 0;
      cursor: pointer;
    }
    .colorValue{font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 12px; color: rgba(107,114,128,0.95)}
    @media (max-width: 860px){
      .board{grid-template-columns: repeat(2, 1fr)}
    }
    @media (max-width: 520px){
      .board{grid-template-columns: 1fr}
      .grid{grid-template-columns: 1fr}
      .colorRow{grid-template-columns: 1fr auto 1fr}
      .colorLabel{font-size: 13px}
    }
  `]
})
export class UiSettingsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private sub = new Subscription();

  palettes = [
    { name: 'Blue / Amber', primary: '#1E40AF', accent: '#F59E0B' },
    { name: 'Emerald / Amber', primary: '#059669', accent: '#F59E0B' },
    { name: 'Indigo / Pink', primary: '#4F46E5', accent: '#EC4899' },
    { name: 'Slate / Sky', primary: '#0F172A', accent: '#38BDF8' },
    { name: 'Purple / Mint', primary: '#7C3AED', accent: '#34D399' },
    { name: 'Rose / Slate', primary: '#E11D48', accent: '#0F172A' },
  ];

  constructor(private fb: FormBuilder, private api: ApiService, private snack: MatSnackBar) {
    this.form = this.fb.group({ primary: ['#1E40AF'], accent: ['#F59E0B'] });
  }
  ngOnInit(): void {
    this.sub.add(this.form.valueChanges.subscribe(() => this.applyPreview()));
    this.api.getContent('ui','primary_color').subscribe({
      next: (i) => { this.form.patchValue({ primary: this.normalizeHex(i?.content) || '#1E40AF' }, { emitEvent: false }); this.applyPreview(); },
      error: () => {}
    });
    this.api.getContent('ui','accent_color').subscribe({
      next: (i) => { this.form.patchValue({ accent: this.normalizeHex(i?.content) || '#F59E0B' }, { emitEvent: false }); this.applyPreview(); },
      error: () => {}
    });
    this.applyPreview();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get primaryValue() {
    return this.normalizeHex(this.form.get('primary')?.value) || '#1E40AF';
  }

  get accentValue() {
    return this.normalizeHex(this.form.get('accent')?.value) || '#F59E0B';
  }

  normalizeHex(v: any): string {
    const raw = String(v ?? '').trim();
    const withHash = raw.startsWith('#') ? raw : `#${raw}`;
    const m = /^#[0-9a-fA-F]{6}$/.test(withHash);
    return m ? withHash.toUpperCase() : '';
  }

  applyPalette(p: { name: string; primary: string; accent: string }) {
    this.form.patchValue({ primary: p.primary, accent: p.accent });
    this.applyPreview();
  }

  isSelectedPalette(p: { primary: string; accent: string }) {
    return this.primaryValue === this.normalizeHex(p.primary) && this.accentValue === this.normalizeHex(p.accent);
  }

  onColorPick(control: 'primary' | 'accent', ev: Event) {
    const input = ev.target as HTMLInputElement;
    const next = this.normalizeHex(input.value) || input.value;
    this.form.patchValue({ [control]: next });
  }

  applyPreview() {
    const primary = this.primaryValue;
    const accent = this.accentValue;
    document.documentElement.style.setProperty('--primary', primary);
    document.documentElement.style.setProperty('--accent', accent);
  }

  save() {
    const primary = this.primaryValue;
    const accent = this.accentValue;
    this.form.patchValue({ primary, accent }, { emitEvent: false });
    this.api.saveContent({ page_name: 'ui', section_name: 'primary_color', content_type: 'text', content: primary }).subscribe({ next: () => {}, error: () => {} });
    this.api.saveContent({ page_name: 'ui', section_name: 'accent_color', content_type: 'text', content: accent }).subscribe({ next: () => {}, error: () => {} });
    this.applyPreview();
    this.snack.open('UI enregistrée', 'Fermer', { duration: 3000 });
  }
}
