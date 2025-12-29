import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div class="container">
        <h1>Mentions Légales</h1>
      </div>
    </div>

    <div class="container content">
      <section>
        <h2>1. Éditeur du site</h2>
        <p>
          Le site Auto-École CAR 18 ème est édité par l'Auto-École CAR 18 ème, 
          située au 6, rue Joseph Dijon, 75018 Paris.
        </p>
        <p><strong>Téléphone :</strong> 01 42 58 74 12</p>
        <p><strong>Email :</strong> contact&#64;autoecole18.fr</p>
        <p><strong>SIRET :</strong> 123 456 789 00012</p>
      </section>

      <section>
        <h2>2. Hébergement</h2>
        <p>
          Ce site est hébergé par [Nom de l'hébergeur], 
          [Adresse de l'hébergeur].
        </p>
      </section>

      <section>
        <h2>3. Propriété intellectuelle</h2>
        <p>
          L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
          Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
        </p>
      </section>

      <section>
        <h2>4. Données personnelles</h2>
        <p>
          Conformément à la loi « Informatique et Libertés », vous disposez d'un droit d'accès, de modification et de suppression des données qui vous concernent.
          Pour l'exercer, adressez-vous à l'Auto-École CAR 18 ème.
        </p>
      </section>
    </div>
  `,
  styles: [`
    .page-header {
      background-color: #1E40AF;
      color: white;
      padding: 60px 0;
      text-align: center;
    }
    .page-header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .content {
      padding-top: 60px;
      padding-bottom: 80px;
    }
    section {
      margin-bottom: 40px;
    }
    h2 {
      color: #1E40AF;
      border-bottom: 2px solid #F3F4F6;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
  `]
})
export class LegalComponent {}
