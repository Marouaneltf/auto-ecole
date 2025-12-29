import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CmsService, CmsPage } from '../../services/cms.service';
import { ApiService } from '../../services/api.service';
import { CmsRendererComponent } from '../../components/cms-renderer/cms-renderer.component';

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [CommonModule, CmsRendererComponent],
  template: `
    <div class="dynamic-page">
      <ng-container *ngIf="page; else loading">
        <ng-container *ngIf="page.components && page.components.length > 0; else empty">
          <app-cms-renderer
            *ngFor="let comp of page.components"
            [component]="comp"
            [businessInfo]="businessInfo"
            [services]="services"
          ></app-cms-renderer>
        </ng-container>
      </ng-container>

      <ng-template #loading>
        <div class="loading">Chargement de la page...</div>
      </ng-template>

      <ng-template #empty>
        <div class="empty">Aucun contenu n'est configuré pour cette page.</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .dynamic-page { min-height: 60vh; }
    .loading, .empty { text-align: center; padding: 60px 20px; color: #6b7280; }
  `]
})
export class DynamicPageComponent implements OnInit {
  page: CmsPage | null = null;
  businessInfo: any;
  services: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private cmsService: CmsService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    if (slug) {
      this.cmsService.getPageBySlug(slug).subscribe({
        next: (p) => this.page = p,
        error: () => this.page = null
      });

      this.apiService.getBusinessInfo().subscribe({
        next: (data) => this.businessInfo = data,
        error: () => {}
      });

      this.apiService.getServices().subscribe({
        next: (data) => this.services = data,
        error: () => {}
      });
    }
  }
}

