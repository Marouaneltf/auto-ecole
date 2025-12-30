import { Directive, HostBinding, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[adminInput], textarea[adminInput], select[adminInput]',
  standalone: true
})
export class AdminInputDirective {
  @HostBinding('class.admin-input') base = true;
  @HostBinding('class.is-focused') focused = false;
  @HostBinding('class.is-error') get error() { return !!(this.control && this.control.invalid && (this.control.touched || this.control.dirty)); }
  @HostBinding('class.is-disabled') get disabled() { return !!(this.control && this.control.disabled); }
  @HostBinding('attr.aria-invalid') get ariaInvalid() { return this.error ? 'true' : 'false'; }

  constructor(@Optional() private control: NgControl) {}

  @HostListener('focusin') onFocusIn() { this.focused = true; }
  @HostListener('focusout') onFocusOut() { this.focused = false; }
}

