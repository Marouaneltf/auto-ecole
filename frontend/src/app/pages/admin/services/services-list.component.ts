import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-services-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="header-row">
        <h2>Services</h2>
        <button class="btn" (click)="create()">Ajouter un service</button>
      </div>
      <ul class="list">
        <li class="item" *ngFor="let s of services">
          <div class="info">
            <div class="name">{{ s.name }}</div>
            <div class="meta">{{ s.price }} € • {{ s.duration }}</div>
          </div>
          <div class="actions">
            <button class="btn-secondary" (click)="edit(s.id)">Modifier</button>
            <button class="btn-danger" (click)="remove(s)">Supprimer</button>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .container{max-width:900px; margin:16px auto; padding:0 16px;}
    .header-row{display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;}
    .list{list-style:none; padding:0; margin:0; display:grid; gap:8px;}
    .item{display:flex; justify-content:space-between; align-items:center; border:1px solid #e5e7eb; border-radius:10px; padding:12px 14px; background:#ffffff;}
    .name{font-weight:600;}
    .meta{color:#6b7280; font-size:12px;}
    .actions{display:flex; gap:8px;}
    .btn{background:#1E40AF; color:#fff; border:none; border-radius:999px; padding:8px 16px; cursor:pointer;}
    .btn-secondary{background:#e5e7eb; color:#111827; border:none; border-radius:999px; padding:8px 16px; cursor:pointer;}
    .btn-danger{background:#dc2626; color:#fff; border:none; border-radius:999px; padding:8px 16px; cursor:pointer;}
  `]
})
export class AdminServicesListComponent implements OnInit {
  services: any[] = [];
  constructor(private api: ApiService, private router: Router) {}
  ngOnInit() { this.reload(); }
  reload() { this.api.getServices().subscribe({ next: (s) => this.services = s, error: () => {} }); }
  edit(id: number) { this.router.navigate(['/admin/services', id]); }
  create() { this.router.navigate(['/admin/services/new']); }
  remove(s: any) {
    if (!confirm(`Supprimer ${s.name} ?`)) return;
    this.api.deleteService(s.id).subscribe({ next: () => this.reload(), error: () => {} });
  }
}
