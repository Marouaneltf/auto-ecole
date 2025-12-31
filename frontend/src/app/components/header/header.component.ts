// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink, RouterLinkActive } from '@angular/router';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { ApiService } from '../../services/api.service';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [CommonModule, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
//   template: `
//     <mat-toolbar color="primary" class="header">
//       <span class="logo" routerLink="/">
//         <img *ngIf="logoUrl; else nameTpl" [src]="logoUrl" alt="Logo" class="logo-img">
//         <ng-template #nameTpl>{{ businessName || 'Auto-École' }}</ng-template>
//       </span>
//       <span class="spacer"></span>
//       <nav>
//         <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">{{ nav.home }}</a>
//         <a mat-button routerLink="/services" routerLinkActive="active">{{ nav.services }}</a>
//         <a mat-button routerLink="/about" routerLinkActive="active">{{ nav.about }}</a>
//         <a mat-button routerLink="/contact" routerLinkActive="active">{{ nav.contact }}</a>
//         <a mat-icon-button routerLink="/admin/login" aria-label="Admin Login">
//           <mat-icon>admin_panel_settings</mat-icon>
//         </a>
//       </nav>
//     </mat-toolbar>
//   `,
//   styles: [`
//     .header {
//       position: sticky;
//       top: 0;
//       z-index: 1000;
//       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//     }
//     .spacer {
//       flex: 1 1 auto;
//     }
//     .logo {
//       cursor: pointer;
//       font-weight: bold;
//       font-size: 1.2rem;
//     }
//     .logo-img { height: 28px; vertical-align: middle; }
//     nav a {
//       margin-left: 8px;
//     }
//     .active {
//       background: rgba(255,255,255,0.1);
//     }
//   `]
// })
// export class HeaderComponent implements OnInit {
//   businessName = '';
//   logoUrl = '';
//   nav = { home: 'Accueil', services: 'Services', about: "L'Auto-École", contact: 'Contact' };

//   constructor(private api: ApiService) {}

//   ngOnInit(): void {
//     this.api.getBusinessInfo().subscribe({
//       next: (data) => {
//         this.businessName = data?.name || '';
//         const logoId = (data as any)?.logo_media_id;
//         if (logoId) {
//           this.api.listMedia().subscribe({
//             next: (all) => {
//               const media = all.find(m => m.id === Number(logoId));
//               this.logoUrl = media?.url || '';
//             },
//             error: () => {}
//           });
//         }
//       },
//       error: () => {}
//     });
//     this.api.getContent('header','nav_home').subscribe({ next: (i) => this.nav.home = i?.content || this.nav.home, error: () => {} });
//     this.api.getContent('header','nav_services').subscribe({ next: (i) => this.nav.services = i?.content || this.nav.services, error: () => {} });
//     this.api.getContent('header','nav_about').subscribe({ next: (i) => this.nav.about = i?.content || this.nav.about, error: () => {} });
//     this.api.getContent('header','nav_contact').subscribe({ next: (i) => this.nav.contact = i?.content || this.nav.contact, error: () => {} });
//   }
// }
