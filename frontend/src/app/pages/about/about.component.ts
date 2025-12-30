import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Award, Users, Car, Clock, CheckCircle, MapPin, Phone, Mail } from 'lucide-angular';
import { ContentService } from '../../services/content.service';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { FooterComponent } from '../../components/layout/footer/footer.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { AboutContent } from '../../models/content.models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    HeaderComponent,
    FooterComponent,
    ButtonComponent
  ],
  template: `
    <app-header></app-header>
    
    <!-- Hero Section -->
    <section class="page-hero">
      <div class="container-modern text-center">
        <h1 class="page-title">À propos de nous</h1>
        <p class="page-subtitle">Découvrez l'histoire et les valeurs de l'Auto-École CAR 18ème</p>
      </div>
    </section>

    <!-- Story Section -->
    <section class="story-section section-padding">
      <div class="container-modern">
        <div class="story-content">
          <div class="story-text">
            <h2 class="section-title">Notre histoire</h2>
            <p class="story-description">{{ aboutContent?.story }}</p>
            <div class="story-stats">
              <div class="stat-item">
                <div class="stat-number">5000+</div>
                <div class="stat-label">Permis délivrés</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">95%</div>
                <div class="stat-label">Taux de réussite</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">14</div>
                <div class="stat-label">Années d'expérience</div>
              </div>
            </div>
          </div>
          <div class="story-image">
            <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Auto-école" class="story-img">
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section section-padding bg-gray-50">
      <div class="container-modern">
        <div class="section-header text-center">
          <h2 class="section-title">Nos valeurs</h2>
          <p class="section-subtitle">Ce qui nous guide chaque jour</p>
        </div>
        <div class="values-grid">
          <div class="value-item">
            <div class="value-icon">
              <lucide-icon name="award" class="w-8 h-8"></lucide-icon>
            </div>
            <h3 class="value-title">Excellence</h3>
            <p class="value-description">Nous visons l'excellence dans chaque aspect de notre enseignement, avec des instructeurs hautement qualifiés et une méthode pédagogique éprouvée.</p>
          </div>
          <div class="value-item">
            <div class="value-icon">
              <lucide-icon name="users" class="w-8 h-8"></lucide-icon>
            </div>
            <h3 class="value-title">Personnalisation</h3>
            <p class="value-description">Chaque élève est unique, nous adaptons notre enseignement à vos besoins spécifiques et à votre rythme d'apprentissage.</p>
          </div>
          <div class="value-item">
            <div class="value-icon">
              <lucide-icon name="car" class="w-8 h-8"></lucide-icon>
            </div>
            <h3 class="value-title">Sécurité</h3>
            <p class="value-description">La sécurité est notre priorité absolue. Nous formons des conducteurs responsables et consciencieux.</p>
          </div>
          <div class="value-item">
            <div class="value-icon">
              <lucide-icon name="clock" class="w-8 h-8"></lucide-icon>
            </div>
            <h3 class="value-title">Flexibilité</h3>
            <p class="value-description">Nous nous adaptons à vos disponibilités avec des horaires flexibles et des formules adaptées à votre emploi du temps.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="timeline-section section-padding">
      <div class="container-modern">
        <div class="section-header text-center">
          <h2 class="section-title">Notre parcours</h2>
          <p class="section-subtitle">Les étapes marquantes de notre histoire</p>
        </div>
        <div class="timeline">
          <div 
            *ngFor="let item of aboutContent?.timeline; let i = index" 
            class="timeline-item"
            [class.timeline-item-left]="i % 2 === 0"
            [class.timeline-item-right]="i % 2 === 1">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-year">{{ item.year }}</div>
              <h3 class="timeline-title">{{ item.title }}</h3>
              <p class="timeline-description">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section section-padding bg-gray-50">
      <div class="container-modern">
        <div class="section-header text-center">
          <h2 class="section-title">Notre équipe</h2>
          <p class="section-subtitle">Des professionnels passionnés à votre service</p>
        </div>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Instructeur" class="avatar-img">
            </div>
            <h3 class="member-name">Jean Dupont</h3>
            <p class="member-role">Instructeur principal</p>
            <p class="member-description">15 ans d'expérience, spécialiste permis B</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">
              <img src="https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Instructrice" class="avatar-img">
            </div>
            <h3 class="member-name">Marie Martin</h3>
            <p class="member-role">Instructrice moto</p>
            <p class="member-description">Spécialiste permis A et formation accélérée</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Instructeur" class="avatar-img">
            </div>
            <h3 class="member-name">Pierre Bernard</h3>
            <p class="member-role">Instructeur code</p>
            <p class="member-description">Expert en pédagogie et formation en ligne</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section section-padding bg-primary-600">
      <div class="container-modern text-center">
        <h2 class="cta-title">Prêt à nous rejoindre ?</h2>
        <p class="cta-subtitle">Commencez votre formation dès aujourd'hui</p>
        <div class="cta-actions">
          <button routerLink="/contact" class="btn-primary">
            Prendre rendez-vous
            <lucide-icon name="chevron-right" class="ml-2"></lucide-icon>
          </button>
          <button class="btn-secondary">
            <lucide-icon name="phone" class="mr-2"></lucide-icon>
            01 42 58 96 32
          </button>
        </div>
      </div>
    </section>

    <app-footer></app-footer>
  `,
  styles: [`
    .page-hero {
      @apply bg-gradient-to-br from-primary-600 to-primary-700 text-white py-24;
    }
    
    .page-title {
      @apply text-4xl md:text-5xl font-bold mb-4;
    }
    
    .page-subtitle {
      @apply text-xl md:text-2xl text-primary-100 max-w-2xl mx-auto;
    }
    
    .story-section {
      @apply py-16;
    }
    
    .story-content {
      @apply grid lg:grid-cols-2 gap-12 items-center;
    }
    
    .story-text {
      @apply space-y-6;
    }
    
    .section-title {
      @apply text-3xl md:text-4xl font-bold text-gray-900 mb-4;
    }
    
    .story-description {
      @apply text-lg text-gray-600 leading-relaxed;
    }
    
    .story-stats {
      @apply grid grid-cols-3 gap-6 mt-8;
    }
    
    .stat-item {
      @apply text-center;
    }
    
    .stat-number {
      @apply text-3xl font-bold text-primary-600 mb-2;
    }
    
    .stat-label {
      @apply text-sm text-gray-600;
    }
    
    .story-image {
      @apply rounded-xl overflow-hidden shadow-xl;
    }
    
    .story-img {
      @apply w-full h-auto object-cover;
    }
    
    .values-section {
      @apply py-16;
    }
    
    .section-header {
      @apply mb-12 text-center;
    }
    
    .section-subtitle {
      @apply text-lg text-gray-600 max-w-2xl mx-auto;
    }
    
    .values-grid {
      @apply grid md:grid-cols-2 lg:grid-cols-4 gap-8;
    }
    
    .value-item {
      @apply text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300;
    }
    
    .value-icon {
      @apply w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600;
    }
    
    .value-title {
      @apply text-xl font-semibold text-gray-900 mb-3;
    }
    
    .value-description {
      @apply text-gray-600;
    }
    
    .timeline-section {
      @apply py-16;
    }
    
    .timeline {
      @apply relative max-w-4xl mx-auto;
    }
    
    .timeline:before {
      content: '';
      @apply absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-200;
      transform: translateX(-50%);
    }
    
    .timeline-item {
      @apply relative mb-12;
    }
    
    .timeline-item-left {
      @apply pr-8;
    }
    
    .timeline-item-right {
      @apply pl-8 text-right;
    }
    
    .timeline-item-left .timeline-content {
      @apply text-right;
    }
    
    .timeline-item-right .timeline-content {
      @apply text-left;
    }
    
    .timeline-marker {
      @apply absolute top-6 w-4 h-4 bg-primary-600 rounded-full;
      left: 50%;
      transform: translateX(-50%);
    }
    
    .timeline-content {
      @apply bg-white p-6 rounded-xl shadow-lg;
    }
    
    .timeline-year {
      @apply text-lg font-bold text-primary-600 mb-2;
    }
    
    .timeline-title {
      @apply text-xl font-semibold text-gray-900 mb-2;
    }
    
    .timeline-description {
      @apply text-gray-600;
    }
    
    .team-section {
      @apply py-16;
    }
    
    .team-grid {
      @apply grid md:grid-cols-2 lg:grid-cols-3 gap-8;
    }
    
    .team-member {
      @apply text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300;
    }
    
    .member-avatar {
      @apply w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden;
    }
    
    .avatar-img {
      @apply w-full h-full object-cover;
    }
    
    .member-name {
      @apply text-xl font-semibold text-gray-900 mb-1;
    }
    
    .member-role {
      @apply text-primary-600 font-medium mb-2;
    }
    
    .member-description {
      @apply text-gray-600;
    }
    
    .cta-section {
      @apply text-white py-16;
    }
    
    .cta-title {
      @apply text-3xl md:text-4xl font-bold mb-4;
    }
    
    .cta-subtitle {
      @apply text-xl mb-8 max-w-2xl mx-auto;
    }
    
    .cta-actions {
      @apply flex flex-col sm:flex-row gap-4 justify-center;
    }
    
    @media (max-width: 768px) {
      .page-hero {
        @apply py-16;
      }
      
      .page-title {
        @apply text-3xl;
      }
      
      .page-subtitle {
        @apply text-lg;
      }
      
      .story-content {
        @apply grid-cols-1 gap-8;
      }
      
      .story-stats {
        @apply grid-cols-1 gap-4;
      }
      
      .values-grid {
        @apply grid-cols-1 gap-6;
      }
      
      .timeline:before {
        @apply left-4;
      }
      
      .timeline-item {
        @apply pl-12 pr-0 text-left;
      }
      
      .timeline-item-left,
      .timeline-item-right {
        @apply pl-12 pr-0 text-left;
      }
      
      .timeline-marker {
        @apply left-4;
        transform: none;
      }
      
      .timeline-content {
        @apply text-left;
      }
      
      .team-grid {
        @apply grid-cols-1 gap-6;
      }
    }
  `]
})
export class AboutComponent implements OnInit {
  aboutContent: AboutContent | null = null;

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.contentService.getAboutContent().subscribe(content => {
      this.aboutContent = content;
    });
  }
}