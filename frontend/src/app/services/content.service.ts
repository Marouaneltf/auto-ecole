import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { HeroContent, Service, Testimonial, ContactInfo, AboutContent, WhyChooseUsItem, LearningStep } from '../models/content.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(private api: ApiService) {}

  getHeroContent(): Observable<HeroContent> {
    return of({
      headline: 'Votre permis de conduire en toute confiance',
      subheadline: 'Réussissez votre permis avec notre méthode éprouvée et nos moniteurs certifiés. Taux de réussite exceptionnel et accompagnement personnalisé.',
      ctaPrimary: 'Commencer maintenant',
      ctaSecondary: 'Nos services',
      backgroundImage: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20driving%20school%20car%20on%20Paris%20street%2C%20professional%20lighting%2C%20high%20quality%2C%20automotive%20photography&image_size=landscape_16_9'
    }).pipe(delay(300));
  }

  getServices(): Observable<Service[]> {
    return of([
      {
        id: '1',
        title: 'Permis B - Manuel',
        description: 'Formation complète au permis B avec conduite manuelle. Apprenez à conduire avec nos moniteurs certifiés et notre méthode éprouvée.',
        category: 'permis-b',
        icon: 'car',
        features: ['20h de conduite', 'Code inclus', 'Examen blanc', 'Support numérique'],
        price: '899€',
        duration: '3 mois'
      },
      {
        id: '2',
        title: 'Permis B - Automatique',
        description: 'Formation au permis B avec véhicule automatique. Parfait pour une apprentissage rapide et sans stress.',
        category: 'permis-b',
        icon: 'car',
        features: ['15h de conduite', 'Code inclus', 'Véhicule automatique', 'Assurance comprise'],
        price: '999€',
        duration: '2 mois'
      },
      {
        id: '3',
        title: 'Permis A1 - Moto Légère',
        description: 'Formation au permis A1 pour motos jusqu\'à 125cc. Apprenez à piloter en toute sécurité.',
        category: 'permis-a',
        icon: 'car',
        features: ['12h de conduite', 'Équipement fourni', 'Circuit privé', 'Assurance comprise'],
        price: '699€',
        duration: '1 mois'
      },
      {
        id: '4',
        title: 'Code Accéléré',
        description: 'Préparation intensive au code de la route. Réussissez votre examen du premier coup avec notre méthode.',
        category: 'code',
        icon: 'file-text',
        features: ['40h de cours', 'Tests blancs illimités', 'Application mobile', 'Support 7j/7'],
        price: '299€',
        duration: '2 semaines'
      },
      {
        id: '5',
        title: 'Permis AM - BSR',
        description: 'Formation au Permis AM (anciennement BSR) pour cyclomoteurs. Accessible dès 14 ans.',
        category: 'permis-a',
        icon: 'award',
        features: ['Formation théorique', 'Examen inclus', 'Valable 15 ans', 'Support pédagogique'],
        price: '199€',
        duration: '1 semaine'
      },
      {
        id: '6',
        title: 'Conduite Accompagnée',
        description: 'Apprentissage progressif de la conduite avec un accompagnant. Méthode idéale pour gagner en confiance.',
        category: 'permis-b',
        icon: 'car',
        features: ['1 an de formation', '20h minimum', 'Accompagnement personnalisé', 'Taux de réussite élevé'],
        price: '1299€',
        duration: '1 an'
      }
    ] as Service[]).pipe(delay(400));
  }

  getTestimonials(): Observable<Testimonial[]> {
    return of([
      {
        id: '1',
        name: 'Marie Dubois',
        rating: 5,
        comment: 'Excellente auto-école ! J\'ai réussi mon permis du premier coup grâce à la pédagogie exceptionnelle de mon moniteur. Très professionnels et à l\'écoute.',
        date: '2024-11-15'
      },
      {
        id: '2',
        name: 'Jean Martin',
        rating: 5,
        comment: 'Une équipe formidable qui m\'a accompagné tout au long de ma formation. Les moniteurs sont patients et très pédagogues. Je recommande vivement !',
        date: '2024-10-28'
      },
      {
        id: '3',
        name: 'Sophie Bernard',
        rating: 4,
        comment: 'Très satisfaite de mon expérience. L\'organisation est parfaite, les horaires flexibles et la méthode d\'apprentissage très efficace.',
        date: '2024-10-12'
      },
      {
        id: '4',
        name: 'Thomas Leroy',
        rating: 5,
        comment: 'Professionnalisme et sérieux sont les maîtres mots de cette auto-école. J\'ai obtenu mon permis rapidement et en toute sérénité.',
        date: '2024-09-30'
      },
      {
        id: '5',
        name: 'Claire Petit',
        rating: 5,
        comment: 'Superbe auto-école avec des moniteurs très compétents et sympathiques. La formation au code était excellente et la conduite aussi.',
        date: '2024-09-15'
      }
    ]).pipe(delay(500));
  }

  getWhyChooseUs(): Observable<WhyChooseUsItem[]> {
    return of([
      {
        id: '1',
        title: 'Taux de Réussite Exceptionnel',
        description: '95% de réussite à l\'examen grâce à notre méthode pédagogique éprouvée et nos moniteurs certifiés.',
        icon: 'award'
      },
      {
        id: '2',
        title: 'Moniteurs Certifiés',
        description: 'Une équipe de professionnels expérimentés et passionnés, formés aux dernières techniques d\'enseignement.',
        icon: 'users'
      },
      {
        id: '3',
        title: 'Véhicules Modernes',
        description: 'Flotte de véhicules récents et bien entretenus, équipés des dernières technologies de sécurité.',
        icon: 'car'
      },
      {
        id: '4',
        title: 'Horaires Flexibles',
        description: 'Des créneaux adaptés à votre emploi du temps, du lundi au samedi, même en soirée.',
        icon: 'calendar'
      },
      {
        id: '5',
        title: 'Accompagnement Personnalisé',
        description: 'Un suivi individualisé tout au long de votre formation avec des conseils adaptés à vos besoins.',
        icon: 'heart'
      },
      {
        id: '6',
        title: 'Formules Tout Compris',
        description: 'Des forfaits transparents sans frais cachés, incluant code, conduite et examen.',
        icon: 'shield'
      },
      {
        id: '7',
        title: 'Support Numérique',
        description: 'Accès à notre plateforme d\'apprentissage en ligne et application mobile pour réviser partout.',
        icon: 'book-open'
      },
      {
        id: '8',
        title: 'Résultats Rapides',
        description: 'Obtenez votre permis rapidement grâce à notre organisation optimisée et nos disponibilités.',
        icon: 'trending-up'
      }
    ]).pipe(delay(600));
  }

  getLearningSteps(): Observable<LearningStep[]> {
    return of([
      {
        id: '1',
        title: 'Inscription & Planning',
        description: 'Inscrivez-vous en ligne et planifiez vos cours selon votre disponibilité.',
        icon: 'calendar'
      },
      {
        id: '2',
        title: 'Code de la Route',
        description: 'Préparez et réussissez votre examen du code avec notre plateforme interactive.',
        icon: 'book-open'
      },
      {
        id: '3',
        title: 'Conduite Accompagnée',
        description: 'Apprenez à conduire avec nos moniteurs certifiés et notre flotte moderne.',
        icon: 'car'
      },
      {
        id: '4',
        title: 'Examen du Permis',
        description: 'Passez votre examen en toute confiance avec notre accompagnement personnalisé.',
        icon: 'award'
      }
    ]).pipe(delay(700));
  }

  getAboutContent(): Observable<AboutContent> {
    return this.api.getContent('about','story_text').pipe(map(storyItem => ({ storyItem })), map(state => ({
      title: 'Auto-École CAR 18ème',
      description: '',
      story: state.storyItem?.content || '',
      timeline: []
    })));
  }

  getContactInfo(): Observable<ContactInfo> {
    return this.api.getBusinessInfo().pipe(map(b => ({
      address: b?.address || '',
      phone: b?.phone || '',
      email: b?.email || '',
      hours: (b as any)?.opening_hours || ''
    })));
  }
}
