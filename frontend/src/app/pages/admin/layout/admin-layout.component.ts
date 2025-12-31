import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="admin-layout">
      <aside class="sidebar" [class.open]="sidebarOpen">
        <div class="brand">
          <lucide-icon name="settings" class="brand-icon"></lucide-icon>
          <span>Administration</span>
        </div>
        <nav class="nav">
          <a [routerLink]="['/admin/dashboard']" routerLinkActive="active">
            <lucide-icon name="layout-dashboard" class="nav-icon"></lucide-icon>
            <span>Dashboard</span>
          </a>
          <a [routerLink]="['/admin/pages/home']" routerLinkActive="active">
            <lucide-icon name="home" class="nav-icon"></lucide-icon>
            <span>Accueil</span>
          </a>
          <a [routerLink]="['/admin/pages/services']" routerLinkActive="active">
            <lucide-icon name="list" class="nav-icon"></lucide-icon>
            <span>Services</span>
          </a>
          <a [routerLink]="['/admin/pages/about']" routerLinkActive="active">
            <lucide-icon name="info" class="nav-icon"></lucide-icon>
            <span>À propos</span>
          </a>
          <a [routerLink]="['/admin/contact']" routerLinkActive="active">
            <lucide-icon name="phone" class="nav-icon"></lucide-icon>
            <span>Contact</span>
          </a>
          <a [routerLink]="['/admin/pages/legal']" routerLinkActive="active">
            <lucide-icon name="scale" class="nav-icon"></lucide-icon>
            <span>Mentions légales</span>
          </a>
          <a [routerLink]="['/admin/header']" routerLinkActive="active"><lucide-icon name="scale" class="nav-icon"></lucide-icon><span>En-tête</span></a>

          <a [routerLink]="['/admin/footer']" routerLinkActive="active">
                      <lucide-icon name="scale" class="nav-icon"></lucide-icon>
  
          <span>Pied de page</span></a>
          
          <a [routerLink]="['/admin/ui']" routerLinkActive="active">
         <lucide-icon name="scale" class="nav-icon"></lucide-icon>
  
          <span>UI & Branding</span></a>

        </nav>
      </aside>
      <main class="main">
        <header class="header">
          <button class="menu" type="button" (click)="sidebarOpen=!sidebarOpen">
            <lucide-icon name="menu" class="menu-icon"></lucide-icon>
          </button>
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
        <footer class="admin-footer">
          <div class="footer-inner">
            <span class="footer-title">Administration — Auto-École</span>
            <span class="footer-meta">© {{year}} • Interface d’administration</span>
          </div>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout{display:grid; grid-template-columns: 260px 1fr; min-height:100vh;}
    .sidebar{background:#111827; color:#fff; padding:16px; position:sticky; top:0; height:100vh;}
    .sidebar .brand{display:flex; align-items:center; gap:8px; font-weight:800; margin-bottom:12px;}
    .brand-icon{width:18px; height:18px;}
    .nav{display:flex; flex-direction:column; gap:6px;}
    .nav a{display:flex; align-items:center; gap:8px; color:#e5e7eb; text-decoration:none; padding:10px 12px; border-radius:8px;}
    .nav a.active, .nav a:hover{background:#1f2937; color:#fff;}
    .nav-icon{width:18px; height:18px;}
    .main{display:flex; flex-direction:column;}
    .header{display:flex; gap:12px; align-items:center; border-bottom:1px solid #e5e7eb; padding:12px 16px; position:sticky; top:0; background:#fff; z-index:10;}
    .menu{background:transparent; border:none; cursor:pointer; padding:6px; border-radius:6px;}
    .menu-icon{width:20px; height:20px; color:#374151;}
    .back{background:#e5e7eb; color:#111827; border:none; border-radius:6px; padding:6px 10px; cursor:pointer;}
    .page-title{font-size:18px; margin:0;}
    .breadcrumb{font-size:12px; color:#6b7280;}
    .breadcrumb a{color:#374151; text-decoration:none;}
    .sep{margin:0 6px;}
    .content{padding:16px;}
    .admin-footer{margin-top:auto; border-top:1px solid #e5e7eb; padding:12px 16px; background:#fafafa}
    .footer-inner{display:flex; align-items:center; justify-content:space-between; color:#6b7280; font-size:12px}
    @media (max-width: 900px){
      .admin-layout{grid-template-columns: 1fr}
      .sidebar{position:fixed; left:0; top:0; bottom:0; width:260px; transform: translateX(-100%); transition: transform .2s ease;}
      .sidebar.open{transform: translateX(0)}
    }
  `]
})
export class AdminLayoutComponent {
  breadcrumb: Array<{ label: string; url: string }> = [];
  currentTitle = '';
  sidebarOpen = false;
  year = new Date().getFullYear();

  constructor(private router: Router, private route: ActivatedRoute) {
    router.events.subscribe(() => this.buildBreadcrumb());
    this.buildBreadcrumb();
  }

  onBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private buildBreadcrumb() {
    const segments = this.router.url.split('?')[0].split('/').filter(Boolean);
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
