import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Star, Calendar, MessageCircle } from 'lucide-angular';

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  image?: string;
  date?: string;
}

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="testimonial-card bg-white rounded-xl shadow-lg p-6 relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div class="testimonial-quote absolute top-4 left-4 opacity-10">
        <lucide-icon name="message-circle" class="w-12 h-12 text-blue-600"></lucide-icon>
      </div>
      
      <div class="testimonial-header flex items-center mb-6">
        <div class="avatar-wrapper relative">
          <img 
            *ngIf="testimonial.image" 
            [src]="testimonial.image" 
            [alt]="testimonial.name" 
            class="avatar w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg">
          <div 
            *ngIf="!testimonial.image" 
            class="avatar-placeholder w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
            [style.background]="'linear-gradient(135deg, ' + getAvatarColor() + ')'">
            {{ testimonial.name.charAt(0).toUpperCase() }}
          </div>
          <div class="avatar-status absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        <div class="testimonial-info ml-4">
          <h4 class="testimonial-name text-lg font-bold text-gray-900 mb-1">
            {{ testimonial.name }}
          </h4>
          <div class="rating flex items-center">
            <lucide-icon 
              *ngFor="let star of stars" 
              name="star" 
              class="star-icon w-4 h-4 text-yellow-400 fill-current">
            </lucide-icon>
            <span class="rating-text text-sm text-gray-600 ml-2">
              {{ testimonial.rating }}/5
            </span>
          </div>
        </div>
      </div>
      
      <blockquote class="testimonial-comment text-gray-700 italic text-base leading-relaxed mb-6 relative z-10">
        <span class="quote-mark text-blue-600 font-bold text-2xl mr-2">“</span>
        {{ testimonial.comment }}
      </blockquote>
      
      <div *ngIf="testimonial.date" class="testimonial-date text-sm text-gray-500 flex items-center">
        <lucide-icon name="calendar" class="w-4 h-4 mr-2"></lucide-icon>
        {{ formatDate(testimonial.date) }}
      </div>
    </div>
  `,
  styles: [`
    .testimonial-card {
      min-height: 280px;
      display: flex;
      flex-direction: column;
    }
    
    .testimonial-quote {
      position: absolute;
      top: 1rem;
      left: 1rem;
    }
    
    .testimonial-header {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .avatar-wrapper {
      position: relative;
    }
    
    .avatar {
      width: 4rem;
      height: 4rem;
      border-radius: 9999px;
      object-fit: cover;
      border: 4px solid white;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .avatar-placeholder {
      width: 4rem;
      height: 4rem;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.25rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .avatar-status {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 1rem;
      height: 1rem;
      background-color: #10b981;
      border: 2px solid white;
      border-radius: 9999px;
    }
    
    .testimonial-info {
      margin-left: 1rem;
      flex: 1;
    }
    
    .testimonial-name {
      font-size: 1.125rem;
      font-weight: bold;
      color: #111827;
      margin-bottom: 0.25rem;
    }
    
    .rating {
      display: flex;
      align-items: center;
    }
    
    .star-icon {
      width: 1rem;
      height: 1rem;
      color: #fbbf24;
      fill: currentColor;
      margin-right: 0.125rem;
    }
    
    .rating-text {
      font-size: 0.875rem;
      color: #6b7280;
      margin-left: 0.5rem;
    }
    
    .testimonial-comment {
      color: #374151;
      font-style: italic;
      font-size: 1rem;
      line-height: 1.625;
      flex: 1;
      position: relative;
      z-index: 10;
      margin: 0;
      padding: 0;
      border-left: none;
    }
    
    .quote-mark {
      color: #2563eb;
      font-weight: bold;
      font-size: 1.5rem;
      margin-right: 0.5rem;
    }
    
    .testimonial-date {
      font-size: 0.875rem;
      color: #6b7280;
      display: flex;
      align-items: center;
      margin-top: 1.5rem;
    }
    
    .testimonial-card:hover {
      transform: translateY(-0.25rem) scale(1.02);
    }
    
    .testimonial-card:hover .avatar-placeholder {
      transform: scale(1.1);
    }
  `]
})
export class TestimonialCardComponent {
  @Input() testimonial!: Testimonial;

  get stars(): number[] {
    return Array(this.testimonial.rating).fill(0);
  }

  getAvatarColor(): string {
    const colors = [
      '#FF6B6B, #FF8E8E',
      '#4ECDC4, #44A08D',
      '#45B7D1, #96C93D',
      '#F093FB, #F5576C',
      '#4FACFE, #00F2FE',
      '#43E97B, #38F9D7',
      '#FA709A, #FEE140',
      '#A8EDEA, #FED6E3'
    ];
    
    const hash = this.testimonial.name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  }
}