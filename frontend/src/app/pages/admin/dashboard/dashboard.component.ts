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
  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/admin/login']);
      return;
    }
    this.pages = this.injector.get(ADMIN_PAGES, []);
  }
}
