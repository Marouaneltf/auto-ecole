import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="brand">Administration</div>
        <nav class="nav">
          <a [routerLink]="['/admin/dashboard']" routerLinkActive="active"><span>Dashboard</span></a>
          <a [routerLink]="['/admin/services']" routerLinkActive="active"><span>Services / Offres</span></a>
          <a [routerLink]="['/admin/media']" routerLinkActive="active"><span>Médiathèque</span></a>
          <a [routerLink]="['/admin/home']" routerLinkActive="active"><span>Home Page Content</span></a>
          <a [routerLink]="['/admin/contact']" routerLinkActive="active"><span>Contact Info</span></a>
          <a [routerLink]="['/admin/header']" routerLinkActive="active"><span>En-tête</span></a>
          <a [routerLink]="['/admin/footer']" routerLinkActive="active"><span>Pied de page</span></a>
          <a [routerLink]="['/admin/about']" routerLinkActive="active"><span>À propos</span></a>
          <a [routerLink]="['/admin/ui']" routerLinkActive="active"><span>UI & Branding</span></a>
          <a [routerLink]="['/admin/dashboard', 'home-hero']" routerLinkActive="active"><span>Accueil — Hero</span></a>
          <a [routerLink]="['/admin/dashboard', 'home-services']" routerLinkActive="active"><span>Accueil — Services</span></a>
        </nav>
      </aside>
      <main class="main">
        <header class="header">
          <button class="back" type="button" (click)="onBack()">Retour</button>
          <div class="titles">
            <h1 class="page-title">{{ currentTitle }}</h1>
            <div class="breadcrumb">
              <ng-container *ngFor="let bc of breadcrumb; let i = index">
                <a *ngIf="i < breadcrumb.length - 1" [routerLink]="bc.url">{{ bc.label }}</a>
                <span *ngIf="i === breadcrumb.length - 1">{{ bc.label }}</span>
                <span *ngIf="i < breadcrumb.length - 1" class="sep">/</span>
              </ng-container>
            </div>
          </div>
        </header>
        <section class="content">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout{display:grid; grid-template-columns: 240px 1fr; min-height:100vh;}
    .sidebar{background:#111827; color:#fff; padding:16px;}
    .brand{font-weight:600; margin-bottom:12px;}
    .nav{display:flex; flex-direction:column; gap:8px;}
    .nav a{color:#e5e7eb; text-decoration:none; padding:8px 10px; border-radius:6px;}
    .nav a.active, .nav a:hover{background:#1f2937; color:#fff;}
    .main{display:flex; flex-direction:column;}
    .header{display:flex; gap:12px; align-items:center; border-bottom:1px solid #e5e7eb; padding:12px 16px;}
    .back{background:#e5e7eb; color:#111827; border:none; border-radius:6px; padding:6px 10px; cursor:pointer;}
    .page-title{font-size:18px; margin:0;}
    .breadcrumb{font-size:12px; color:#6b7280;}
    .breadcrumb a{color:#374151; text-decoration:none;}
    .sep{margin:0 6px;}
    .content{padding:16px;}
  `]
})
export class AdminLayoutComponent {
  breadcrumb: Array<{ label: string; url: string }> = [];
  currentTitle = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    router.events.subscribe(() => this.buildBreadcrumb());
    this.buildBreadcrumb();
  }

  onBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private buildBreadcrumb() {
    const segments = this.router.url.split('?')[0].split('/').filter(Boolean);
    const base = '/';
    let acc = '';
    this.breadcrumb = segments.map((seg) => {
      acc += `/${seg}`;
      return { label: this.pretty(seg), url: acc };
    });
    this.currentTitle = this.pretty(segments[segments.length - 1] || 'dashboard');
  }

  private pretty(seg: string) {
    const map: Record<string,string> = {
      admin: 'Administration',
      dashboard: 'Dashboard',
      services: 'Services',
      testimonials: 'Témoignages',
      home: 'Accueil',
      contact: 'Contact',
      settings: 'Paramètres',
      new: 'Nouveau',
      edit: 'Édition'
    };
    return map[seg] || seg.replace(/-/g,' ').replace(/\b\w/g, (m) => m.toUpperCase());
  }
}
