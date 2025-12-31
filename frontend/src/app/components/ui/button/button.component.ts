import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled"
      [type]="type"
      class="focus-ring"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  get buttonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
    
    const variantClasses = {
      primary: 'bg-accent-500 hover:bg-accent-600 text-white',
      secondary: 'bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-500',
      outline: 'bg-transparent hover:bg-primary-50 text-primary-600 border-2 border-primary-500'
    };

    const sizeClasses = {
      sm: 'py-2 px-4 text-sm',
      md: 'py-3 px-6 text-base',
      lg: 'py-4 px-8 text-lg'
    };

    const disabledClasses = this.disabled ? 'opacity-50 cursor-not-allowed' : '';

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]} ${disabledClasses}`;
  }
}