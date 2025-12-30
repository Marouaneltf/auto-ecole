import { Component, OnDestroy, Injector, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ADMIN_PAGES, AdminPageMeta } from '../../../admin/admin-registry.token';
import { NgComponentOutlet } from '@angular/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-admin-page-host',
  standalone: true,
  imports: [CommonModule, RouterModule, NgComponentOutlet],
  template: `
    <div class="container">
      <ng-container *ngIf="componentType; else notFound">
        <ng-container *ngComponentOutlet="componentType"></ng-container>
      </ng-container>
      <ng-template #notFound>
        <p>Page d'administration introuvable.</p>
      </ng-template>
    </div>
  `,
  styles: [`.container{padding:16px}`]
})
export class AdminPageHostComponent implements OnDestroy {
  componentType: any;
  private injector = inject(Injector);
  private sub = this.route.paramMap.subscribe(async (pm) => {
    const key = pm.get('pageKey') || '';
    const pages: AdminPageMeta[] = this.injector.get(ADMIN_PAGES, []);
    const meta = pages.find(p => p.key === key);
    if (meta) {
      this.componentType = await meta.load();
    } else {
      this.componentType = null;
    }
  });

  constructor(private route: ActivatedRoute) {}
  ngOnDestroy() { this.sub.unsubscribe(); }
}
