import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Paramètres</h2>
      <p>Paramètres généraux (à compléter).</p>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 20px auto; padding: 0 20px; }
  `]
})
export class SettingsComponent {}

