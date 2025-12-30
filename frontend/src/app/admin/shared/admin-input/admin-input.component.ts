import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

type AdminInputKind = 'text' | 'textarea' | 'select' | 'file';

@Component({
  selector: 'app-admin-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="field" [class.disabled]="disabled">
      <div class="surface" [class.focused]="focused" [class.filled]="hasValue" [class.error]="isError">
        <label class="label" [class.floating]="focused || hasValue">{{ label }}</label>

        <input
          *ngIf="kind === 'text'"
          class="control"
          [type]="type"
          [attr.placeholder]="placeholder"
          [attr.autocomplete]="autocomplete"
          [disabled]="disabled"
          [value]="value"
          (input)="onTextInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
        />

        <textarea
          *ngIf="kind === 'textarea'"
          class="control textarea"
          [rows]="rows"
          [attr.placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onTextInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
        ></textarea>

        <select
          *ngIf="kind === 'select'"
          class="control select"
          [disabled]="disabled"
          [value]="value"
          (change)="onSelectChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
        >
          <ng-content select="option, optgroup"></ng-content>
        </select>

        <div *ngIf="kind === 'file'" class="file">
          <button class="fileButton" type="button" [disabled]="disabled" (click)="openFile()">
            Parcourir
          </button>
          <div class="fileName" [class.placeholder]="!fileLabel">{{ fileLabel || filePlaceholder }}</div>
          <input
            #fileInput
            class="fileNative"
            type="file"
            [attr.accept]="accept"
            [attr.multiple]="multiple ? '' : null"
            [disabled]="disabled"
            (change)="onFileChange($event)"
          />
        </div>
      </div>

      <div class="meta" *ngIf="hint || isError">
        <div class="hint" *ngIf="hint && !isError">{{ hint }}</div>
        <div class="errorText" *ngIf="isError">{{ errorText || defaultErrorText }}</div>
      </div>
    </div>
  `,
  styles: [`
    :host{display:block}
    .field{display:block}
    .surface{
      position:relative; border-radius:14px;
      background: linear-gradient(180deg, rgba(255,255,255,0.90), rgba(255,255,255,0.70));
      border:1px solid rgba(17,24,39,0.10);
      box-shadow: 0 10px 22px rgba(17,24,39,0.06);
      padding:18px 14px 10px 14px;
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
      backdrop-filter: blur(10px);
    }
    .surface:hover{border-color:rgba(17,24,39,0.18); box-shadow: 0 12px 26px rgba(17,24,39,0.08)}
    .surface.focused{
      border-color: rgba(30,64,175,0.55);
      box-shadow: 0 14px 32px rgba(30,64,175,0.12), 0 0 0 4px rgba(30,64,175,0.14);
      transform: translateY(-1px);
    }
    .surface.error{
      border-color: rgba(220,38,38,0.55);
      box-shadow: 0 14px 32px rgba(220,38,38,0.10), 0 0 0 4px rgba(220,38,38,0.12);
    }
    .surface.filled .label{color: rgba(55,65,81,0.90)}
    .label{
      position:absolute; left:14px; top:16px;
      font-size:14px; line-height:16px;
      color: rgba(55,65,81,0.78);
      transform-origin: left top;
      transition: transform .18s ease, top .18s ease, color .18s ease;
      pointer-events:none;
      max-width: calc(100% - 28px);
      white-space: nowrap;
      overflow:hidden;
      text-overflow: ellipsis;
    }
    .label.floating{top:8px; transform: scale(0.86)}
    .control{
      width:100%;
      height:44px;
      border:none;
      outline:none;
      background:transparent;
      font-size:15px;
      line-height:22px;
      color:#111827;
      padding:8px 0 0 0;
    }
    .control::placeholder{color: rgba(156,163,175,0.9)}
    .textarea{height:auto; min-height:132px; resize:vertical; padding-top:12px}
    .select{
      appearance:none;
      background-image: linear-gradient(45deg, transparent 50%, rgba(107,114,128,0.9) 50%), linear-gradient(135deg, rgba(107,114,128,0.9) 50%, transparent 50%);
      background-position: calc(100% - 18px) calc(1em + 4px), calc(100% - 12px) calc(1em + 4px);
      background-size: 6px 6px, 6px 6px;
      background-repeat: no-repeat;
      padding-right:34px;
    }
    .file{display:flex; align-items:center; gap:10px; padding-top:10px; height:44px}
    .fileNative{position:absolute; inset:0; opacity:0; pointer-events:none}
    .fileButton{
      border:none; border-radius:999px; padding:10px 14px;
      background: rgba(17,24,39,0.06);
      color:#111827;
      cursor:pointer;
      transition: background .18s ease;
      font-weight:600;
    }
    .fileButton:hover{background: rgba(17,24,39,0.10)}
    .fileButton:disabled{opacity:0.5; cursor:not-allowed}
    .fileName{flex:1; font-size:14px; color:#111827; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
    .fileName.placeholder{color: rgba(107,114,128,0.9)}
    .meta{margin-top:8px; padding:0 6px; display:flex; justify-content:space-between; gap:10px}
    .hint{font-size:12px; color: rgba(107,114,128,0.95)}
    .errorText{font-size:12px; color: rgba(220,38,38,0.95)}
    .disabled .surface{opacity:0.6; filter:saturate(0.9)}
  `]
})
export class AdminInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() kind: AdminInputKind = 'text';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' = 'text';
  @Input() placeholder = '';
  @Input() autocomplete: string | null = null;
  @Input() rows = 4;

  @Input() accept: string | null = null;
  @Input() multiple = false;
  @Input() filePlaceholder = 'Aucun fichier sélectionné';
  @Output() fileSelected = new EventEmitter<File | FileList | null>();

  @Input() hint = '';
  @Input() errorText = '';

  value = '';
  disabled = false;
  focused = false;
  fileLabel = '';
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl | null) {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  get hasValue() {
    if (this.kind === 'file') return !!this.fileLabel;
    return String(this.value ?? '').length > 0;
  }

  get isError() {
    const c = this.ngControl?.control;
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  get defaultErrorText() {
    const c = this.ngControl?.control;
    const e = c?.errors || {};
    if (e['required']) return 'Champ requis';
    if (e['email']) return 'Email invalide';
    return 'Valeur invalide';
  }

  writeValue(obj: any): void {
    this.value = obj ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onTextInput(ev: Event) {
    const target = ev.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onSelectChange(ev: Event) {
    const target = ev.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onFocus() { this.focused = true; }

  onBlur() {
    this.focused = false;
    this.onTouched();
  }

  openFile() {
    this.fileInput?.nativeElement?.click();
  }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) {
      this.fileLabel = '';
      this.fileSelected.emit(null);
      return;
    }
    this.fileLabel = this.multiple ? `${files.length} fichiers` : files[0].name;
    this.fileSelected.emit(this.multiple ? files : files[0]);
  }
}
