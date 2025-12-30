import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-modern hover:scale-105 transition-all duration-300">
      <div *ngIf="image" class="card-image">
        <img [src]="image" [alt]="title" class="w-full h-48 object-cover rounded-t-xl">
      </div>
      <div class="p-6">
        <div *ngIf="icon" class="card-icon mb-4">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <ng-content select="[card-icon]"></ng-content>
          </div>
        </div>
        <h3 *ngIf="title" class="text-xl font-semibold text-gray-900 mb-2">{{ title }}</h3>
        <p *ngIf="description" class="text-gray-600">{{ description }}</p>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card-modern {
      @apply bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100;
    }
    
    .card-image img {
      transition: transform 0.3s ease;
    }
    
    .card-modern:hover .card-image img {
      transform: scale(1.05);
    }
    
    .card-icon {
      transition: transform 0.3s ease;
    }
    
    .card-modern:hover .card-icon {
      transform: translateY(-2px);
    }
  `]
})
export class CardComponent {
  @Input() title?: string;
  @Input() description?: string;
  @Input() image?: string;
  @Input() icon?: boolean;
}