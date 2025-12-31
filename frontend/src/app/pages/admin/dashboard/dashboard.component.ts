import { Component, OnInit, Injector, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ADMIN_PAGES, AdminPageMeta } from '../../../admin/admin-registry.token';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pages: AdminPageMeta[] = [];
  router = inject(Router);
  injector = inject(Injector);
  stats: Array<{ key: string; name: string; sections: number; route: string }> = [];
  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/admin/login']);
      return;
    }
    this.pages = this.injector.get(ADMIN_PAGES, []);
    this.stats = [
      { key: 'home', name: 'Accueil', sections: 6, route: '/admin/pages/home' },
      { key: 'services', name: 'Services', sections: 4, route: '/admin/pages/services' },
      { key: 'about', name: 'À propos', sections: 2, route: '/admin/pages/about' },
      { key: 'contact', name: 'Contact', sections: 1, route: '/admin/contact' },
      { key: 'legal', name: 'Mentions légales', sections: 1, route: '/admin/pages/legal' }
    ];
  }
}
