import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" class="header">
      <span class="logo" routerLink="/">Auto-École CAR 18 ème</span>
      <span class="spacer"></span>
      <nav>
        <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Accueil</a>
        <a mat-button routerLink="/services" routerLinkActive="active">Services</a>
        <a mat-button routerLink="/about" routerLinkActive="active">L'Auto-École</a>
        <a mat-button routerLink="/contact" routerLinkActive="active">Contact</a>
        <a mat-icon-button routerLink="/admin/login" aria-label="Admin Login">
          <mat-icon>admin_panel_settings</mat-icon>
        </a>
      </nav>
    </mat-toolbar>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .spacer {
      flex: 1 1 auto;
    }
    .logo {
      cursor: pointer;
      font-weight: bold;
      font-size: 1.2rem;
    }
    nav a {
      margin-left: 8px;
    }
    .active {
      background: rgba(255,255,255,0.1);
    }
  `]
})
export class HeaderComponent {}
