import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  LucideAngularModule, 
  Car, 
  Users, 
  Award, 
  Star, 
  Calendar, 
  BookOpen, 
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  TrendingUp,
  Heart,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  CheckCircle as CheckCircleIcon,
  AlertCircle
} from 'lucide-angular';
import { ContentService } from '../../services/content.service';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { ServiceCardComponent } from '../../components/shared/service-card/service-card.component';
import { TestimonialCardComponent } from '../../components/shared/testimonial-card/testimonial-card.component';
import { ContactFormComponent } from '../../components/shared/contact-form/contact-form.component';
import { 
  HeroContent, 
  Service, 
  Testimonial, 
  WhyChooseUsItem, 
  LearningStep 
} from '../../models/content.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    ButtonComponent,
    CardComponent,
    ServiceCardComponent,
    TestimonialCardComponent,
    ContactFormComponent
  ],
  template: `
    <!-- Hero Section -->
    <section class="hero relative min-h-screen flex items-center justify-center overflow-hidden">
      <div class="hero-background absolute inset-0 z-0">
        <div class="hero-gradient-overlay"></div>
        <img 
          [src]="heroContent?.backgroundImage || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20driving%20school%20car%20on%20Paris%20street%2C%20professional%20lighting%2C%20high%20quality%2C%20automotive%20photography&image_size=landscape_16_9'" 
          alt="Auto-École CAR 18ème" 
          class="hero-image w-full h-full object-cover">
        <div class="hero-overlay"></div>
      </div>
      
      <div class="hero-content relative z-10 container-modern text-center text-white">
        <div class="hero-badge mb-6 animate-fade-in">
          <span class="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            <lucide-icon name="star" class="w-4 h-4 mr-2 text-yellow-400"></lucide-icon>
            Plus de 15 ans d'expérience
          </span>
        </div>
        
        <h1 class="hero-headline text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
          {{ heroContent?.headline || 'Votre permis de conduire en toute confiance' }}
        </h1>
        
        <p class="hero-subheadline text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up" style="animation-delay: 0.2s">
          {{ heroContent?.subheadline || 'Réussissez votre permis avec notre méthode éprouvée et nos moniteurs certifiés. Taux de réussite exceptionnel et accompagnement personnalisé.' }}
        </p>
        
        <div class="hero-stats flex flex-wrap justify-center gap-8 mb-12 animate-slide-up" style="animation-delay: 0.4s">
          <div class="stat-item">
            <div class="stat-number text-3xl font-bold">95%</div>
            <div class="stat-label text-sm opacity-90">Taux de réussite</div>
          </div>
          <div class="stat-item">
            <div class="stat-number text-3xl font-bold">5000+</div>
            <div class="stat-label text-sm opacity-90">Élèves formés</div>
          </div>
          <div class="stat-item">
            <div class="stat-number text-3xl font-bold">4.8/5</div>
            <div class="stat-label text-sm opacity-90">Avis clients</div>
          </div>
        </div>
        
        <div class="hero-actions flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style="animation-delay: 0.6s">
          <button class="btn-primary hero-cta text-lg px-8 py-4">
            {{ heroContent?.ctaPrimary || 'Commencer maintenant' }}
            <lucide-icon name="chevron-right" class="ml-2"></lucide-icon>
          </button>
          <button class="btn-secondary hero-cta-secondary text-lg px-8 py-4">
            {{ heroContent?.ctaSecondary || 'Nos services' }}
          </button>
        </div>
      </div>
      
      <div class="hero-scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div class="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-choose-us section-padding bg-gradient-to-b from-gray-50 to-white">
      <div class="container-modern">
        <div class="section-header text-center mb-16">
          <span class="section-badge text-primary-600 font-semibold text-sm uppercase tracking-wide mb-4 block">Pourquoi nous choisir</span>
          <h2 class="section-title text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            L'excellence à votre service
          </h2>
          <p class="section-subtitle text-xl text-gray-600 max-w-3xl mx-auto">
            Des milliers d'élèves nous font confiance pour leur réussite au permis de conduire
          </p>
        </div>
        
        <div class="why-choose-grid grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            *ngFor="let item of whyChooseUsItems; let i = index" 
            class="why-choose-card group cursor-pointer"
            [class.animate]="true"
            [style.animation-delay]="i * 0.1 + 's'">
            
            <div class="card-modern p-8 text-center h-full transition-all duration-300 group-hover:scale-105">
              <div class="icon-wrapper w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <lucide-icon [name]="getIconName(item.icon)" class="w-8 h-8 text-white"></lucide-icon>
              </div>
              
              <h3 class="text-xl font-bold text-gray-900 mb-4">
                {{ item.title }}
              </h3>
              
              <p class="text-gray-600 leading-relaxed">
                {{ item.description }}
              </p>
              
              <div class="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-12 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-16">
          <button class="btn-primary">
            Découvrir tous nos avantages
            <lucide-icon name="chevron-right" class="ml-2"></lucide-icon>
          </button>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services section-padding bg-white">
      <div class="container-modern">
        <div class="section-header text-center mb-16">
          <span class="section-badge text-primary-600 font-semibold text-sm uppercase tracking-wide mb-4 block">Nos formations</span>
          <h2 class="section-title text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choisissez votre permis
          </h2>
          <p class="section-subtitle text-xl text-gray-600 max-w-3xl mx-auto">
            Des formations adaptées à vos besoins et à votre rythme
          </p>
        </div>
        
        <div class="services-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <app-service-card 
            *ngFor="let service of services; let i = index" 
            [service]="service"
            class="service-card-item group"
            [class.animate]="true"
            [style.animation-delay]="i * 0.1 + 's'">
          </app-service-card>
        </div>
        
        <div class="services-cta text-center mt-16">
          <div class="inline-flex flex-col sm:flex-row gap-4">
            <button routerLink="/services" class="btn-primary text-lg px-8 py-4">
              Voir tous nos services
              <lucide-icon name="chevron-right" class="ml-2"></lucide-icon>
            </button>
            <button class="btn-secondary text-lg px-8 py-4">
              <lucide-icon name="phone" class="mr-2"></lucide-icon>
              01 42 58 96 32
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Learning Process Section -->
    <section class="learning-process section-padding">
      <div class="container-modern">
        <div class="section-header text-center">
          <h2 class="section-title">Votre parcours d'apprentissage</h2>
          <p class="section-subtitle">Étapes simples vers votre permis de conduire</p>
        </div>
        <div class="process-steps">
          <div 
            *ngFor="let step of learningSteps; let i = index" 
            class="process-step"
            [class.animate]="true"
            [style.animation-delay]="i * 0.2 + 's'">
            <div class="step-number">{{ i + 1 }}</div>
            <div class="step-icon">
              <lucide-icon [name]="getIconName(step.icon)" class="w-8 h-8 text-primary-600"></lucide-icon>
            </div>
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials section-padding bg-gradient-to-br from-primary-50 to-accent-50">
      <div class="container-modern">
        <div class="section-header text-center mb-16">
          <span class="section-badge text-primary-600 font-semibold text-sm uppercase tracking-wide mb-4 block">Témoignages</span>
          <h2 class="section-title text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ils ont réussi avec nous
          </h2>
          <p class="section-subtitle text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les expériences de nos élèves satisfaits
          </p>
        </div>
        
        <div class="testimonials-container relative">
          <div class="testimonials-wrapper flex transition-transform duration-500 ease-in-out" [style.transform]="'translateX(' + (-currentTestimonialIndex * 100) + '%)'">
            <div 
              *ngFor="let testimonial of testimonials; let i = index" 
              class="testimonial-slide w-full flex-shrink-0 px-4">
              <app-testimonial-card 
                [testimonial]="testimonial"
                class="testimonial-item">
              </app-testimonial-card>
            </div>
          </div>
          
          <!-- Carousel Controls -->
          <button 
            (click)="previousTestimonial()" 
            class="testimonial-nav testimonial-nav-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
            <lucide-icon name="chevron-left" class="w-6 h-6"></lucide-icon>
          </button>
          
          <button 
            (click)="nextTestimonial()" 
            class="testimonial-nav testimonial-nav-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
            <lucide-icon name="chevron-right" class="w-6 h-6"></lucide-icon>
          </button>
          
          <!-- Carousel Indicators -->
          <div class="testimonial-indicators flex justify-center gap-2 mt-8">
            <button 
              *ngFor="let testimonial of testimonials; let i = index"
              (click)="goToTestimonial(i)"
              class="indicator-dot"
              [class.active]="i === currentTestimonialIndex">
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta section-padding bg-gradient-to-r from-primary-600 to-primary-700">
      <div class="container-modern text-center">
        <h2 class="cta-title text-3xl md:text-4xl font-bold mb-4">Prêt à commencer votre formation ?</h2>
        <p class="cta-subtitle text-xl mb-8 max-w-2xl mx-auto">Contactez-nous dès aujourd'hui pour planifier votre premier cours</p>
        <div class="cta-actions flex flex-col sm:flex-row gap-4 justify-center">
          <button class="btn-secondary text-lg px-8 py-4">
            <lucide-icon name="phone" class="mr-2"></lucide-icon>
            01 42 58 96 32
          </button>
          <button routerLink="/contact" class="btn-primary text-lg px-8 py-4">
            Prendre rendez-vous
            <lucide-icon name="calendar" class="ml-2"></lucide-icon>
          </button>
        </div>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="contact-form-section section-padding bg-white">
      <div class="container-modern">
        <div class="contact-form-container max-w-4xl mx-auto">
          <div class="section-header text-center mb-16">
            <span class="section-badge text-primary-600 font-semibold text-sm uppercase tracking-wide mb-4 block">Contact</span>
            <h2 class="section-title text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Parlons de votre projet
            </h2>
            <p class="section-subtitle text-xl text-gray-600 max-w-3xl mx-auto">
              Notre équipe est là pour répondre à toutes vos questions et vous accompagner dans votre démarche
            </p>
          </div>

          <div class="contact-form-wrapper bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 md:p-12">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              <div class="contact-info">
                <h3 class="text-2xl font-bold text-gray-900 mb-6">Nos coordonnées</h3>
                
                <div class="contact-item flex items-start mb-6">
                  <div class="contact-icon w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                    <lucide-icon name="map-pin" class="w-6 h-6 text-white"></lucide-icon>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">Adresse</h4>
                    <p class="text-gray-600">18ème arrondissement, Paris</p>
                  </div>
                </div>

                <div class="contact-item flex items-start mb-6">
                  <div class="contact-icon w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                    <lucide-icon name="phone" class="w-6 h-6 text-white"></lucide-icon>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">Téléphone</h4>
                    <p class="text-gray-600">01 42 58 96 32</p>
                    <p class="text-sm text-gray-500">Du lundi au samedi, 8h-20h</p>
                  </div>
                </div>

                <div class="contact-item flex items-start mb-6">
                  <div class="contact-icon w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                    <lucide-icon name="mail" class="w-6 h-6 text-white"></lucide-icon>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">Email</h4>
                    <p class="text-gray-600">contact&#64;autoecole18eme.fr</p>
                  </div>
                </div>

                <div class="contact-item flex items-start">
                  <div class="contact-icon w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                    <lucide-icon name="clock" class="w-6 h-6 text-white"></lucide-icon>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">Horaires</h4>
                    <p class="text-gray-600">Lundi-Vendredi: 8h-19h</p>
                    <p class="text-gray-600">Samedi: 8h-17h</p>
                  </div>
                </div>
              </div>

              <div class="contact-form-component">
                <app-contact-form (formSubmit)="onContactFormSubmit($event)"></app-contact-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  `,
  styles: [`
    .hero {
      @apply relative min-h-screen flex items-center justify-center;
      min-height: 700px;
    }
    
    .hero-background {
      @apply absolute inset-0 z-0;
    }
    
    .hero-gradient-overlay {
      @apply absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 opacity-90 z-10;
    }
    
    .hero-image {
      @apply w-full h-full object-cover;
    }
    
    .hero-overlay {
      @apply absolute inset-0 bg-black/40 z-20;
    }
    
    .hero-content {
      @apply relative z-30 text-center text-white;
    }
    
    .hero-badge {
      @apply animate-fade-in;
    }
    
    .hero-headline {
      @apply text-4xl md:text-6xl lg:text-7xl font-bold mb-6;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      line-height: 1.1;
    }
    
    .hero-subheadline {
      @apply text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .hero-stats {
      @apply animate-slide-up;
    }
    
    .stat-item {
      @apply text-center;
    }
    
    .stat-number {
      @apply text-3xl font-bold text-white mb-1;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .stat-label {
      @apply text-sm text-gray-300 font-medium;
    }
    
    .hero-actions {
      @apply animate-slide-up;
    }
    
    .hero-cta {
      @apply text-lg px-8 py-4 font-semibold;
    }
    
    .hero-cta-secondary {
      @apply text-lg px-8 py-4 font-semibold;
    }
    
    .hero-scroll-indicator {
      @apply animate-bounce;
    }
    
    .section-badge {
      @apply text-primary-600 font-semibold text-sm uppercase tracking-wide mb-4 block;
    }
    
    .section-header {
      @apply mb-16;
    }
    
    .section-title {
      @apply text-4xl md:text-5xl font-bold text-gray-900 mb-6;
      line-height: 1.2;
    }
    
    .section-subtitle {
      @apply text-xl text-gray-600 max-w-3xl mx-auto;
    }
    
    .why-choose-grid {
      @apply grid md:grid-cols-2 lg:grid-cols-4 gap-8;
    }
    
    .why-choose-card {
      @apply animate-scale-in;
    }
    
    .icon-wrapper {
      @apply shadow-lg;
    }
    
    .services-grid {
      @apply grid md:grid-cols-2 lg:grid-cols-3 gap-8;
    }
    
    .service-card-item {
      @apply animate-scale-in h-full;
    }
    
    .process-steps {
      @apply grid md:grid-cols-2 lg:grid-cols-4 gap-8;
    }
    
    .process-step {
      @apply text-center relative;
    }
    
    .process-step:not(:last-child):after {
      content: '';
      @apply absolute top-8 left-full w-full h-0.5 bg-primary-200 hidden lg:block;
      transform: translateX(-50%);
    }
    
    .step-number {
      @apply w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-lg;
    }
    
    .step-icon {
      @apply w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm;
    }
    
    .step-title {
      @apply text-xl font-semibold text-gray-900 mb-2;
    }
    
    .step-description {
      @apply text-gray-600;
    }
    
    .testimonials-container {
      @apply relative overflow-hidden;
    }
    
    .testimonials-wrapper {
      @apply flex transition-transform duration-500 ease-in-out;
    }
    
    .testimonial-slide {
      @apply w-full flex-shrink-0 px-4;
    }
    
    .testimonial-nav {
      @apply w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
    }
    
    .testimonial-nav-prev {
      @apply -left-6;
    }
    
    .testimonial-nav-next {
      @apply -right-6;
    }
    
    .testimonial-indicators {
      @apply flex justify-center gap-2 mt-8;
    }
    
    .indicator-dot {
      @apply w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-300;
    }
    
    .indicator-dot.active {
      @apply bg-primary-600;
    }
    
    .testimonial-item {
      @apply h-full;
    }
    
    .cta {
      @apply text-white bg-gradient-to-r from-primary-600 to-primary-700;
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
      .hero {
        min-height: 600px;
      }
      
      .hero-headline {
        @apply text-3xl md:text-4xl;
      }
      
      .hero-subheadline {
        @apply text-lg;
      }
      
      .hero-stats {
        @apply gap-4;
      }
      
      .stat-number {
        @apply text-2xl;
      }
      
      .section-title {
        @apply text-3xl;
      }
      
      .process-steps {
        @apply grid-cols-1 gap-12;
      }
      
      .process-step:not(:last-child):after {
        @apply top-full left-1/2 w-0.5 h-8;
        transform: translateX(-50%);
      }
      
      .testimonial-nav {
        @apply w-10 h-10;
      }
      
      .testimonial-nav-prev {
        @apply left-2;
      }
      
      .testimonial-nav-next {
        @apply right-2;
      }
    }
    
    @media (max-width: 640px) {
      .hero-actions {
        @apply flex-col;
      }
      
      .hero-cta {
        @apply w-full;
      }
      
      .hero-cta-secondary {
        @apply w-full;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  heroContent: HeroContent | null = null;
  services: Service[] = [];
  testimonials: Testimonial[] = [];
  whyChooseUsItems: WhyChooseUsItem[] = [];
  learningSteps: LearningStep[] = [];
  currentTestimonialIndex = 0;
  testimonialInterval: any;

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.loadContent();
    this.startTestimonialCarousel();
  }

  ngOnDestroy() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  loadContent() {
    this.contentService.getHeroContent().subscribe(content => {
      this.heroContent = content;
    });

    this.contentService.getServices().subscribe(services => {
      this.services = services;
    });

    this.contentService.getTestimonials().subscribe(testimonials => {
      this.testimonials = testimonials;
    });

    this.contentService.getWhyChooseUs().subscribe(items => {
      this.whyChooseUsItems = items;
    });

    this.contentService.getLearningSteps().subscribe(steps => {
      this.learningSteps = steps;
    });
  }

  getIconName(icon: string): string {
    const iconMap: Record<string, string> = {
      'award': 'award',
      'users': 'users',
      'car': 'car',
      'calendar': 'calendar',
      'book-open': 'book-open',
      'steering-wheel': 'car', // fallback since steering-wheel is not available
      'check-circle': 'check-circle',
      'shield': 'shield',
      'trending-up': 'trending-up',
      'heart': 'heart',
      'phone': 'phone',
      'mail': 'mail',
      'map-pin': 'map-pin',
      'clock': 'clock'
    };
    return iconMap[icon] || 'award';
  }

  previousTestimonial() {
    this.currentTestimonialIndex = this.currentTestimonialIndex > 0 
      ? this.currentTestimonialIndex - 1 
      : this.testimonials.length - 1;
  }

  nextTestimonial() {
    this.currentTestimonialIndex = this.currentTestimonialIndex < this.testimonials.length - 1 
      ? this.currentTestimonialIndex + 1 
      : 0;
  }

  goToTestimonial(index: number) {
    this.currentTestimonialIndex = index;
  }

  startTestimonialCarousel() {
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  onContactFormSubmit(formData: any) {
    console.log('Contact form submitted:', formData);
    // Here you would typically send the data to your API
  }
}
