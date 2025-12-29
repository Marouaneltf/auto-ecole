import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CmsService, CmsPage } from '../../../services/cms.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cms-pages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="cms-pages-container">
      <div class="header">
        <h2>CMS Pages</h2>
        <button class="btn btn-primary" (click)="showCreateModal = true">+ New Page</button>
      </div>

      <div class="pages-grid" *ngIf="pages.length > 0; else emptyState">
        <div class="page-card" *ngFor="let page of pages">
          <div class="page-header">
            <h3>{{ page.title }}</h3>
            <span [class]="'status-badge ' + page.status">{{ page.status }}</span>
          </div>
          <div class="page-meta">
            <p><strong>Slug:</strong> {{ page.slug }}</p>
            <p><strong>Created:</strong> {{ page.created_at | date:'short' }}</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-secondary" [routerLink]="['/admin/cms-builder', page.id]">
              Edit Content
            </button>
            <button class="btn btn-secondary" (click)="toggleStatus(page)">
              {{ page.status === 'published' ? 'Unpublish' : 'Publish' }}
            </button>
            <button class="btn btn-danger" (click)="deletePage(page.id)">
              Delete
            </button>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <h3>No pages found</h3>
          <p>Create your first page to get started</p>
        </div>
      </ng-template>

      <!-- Create Page Modal -->
      <div class="modal-overlay" *ngIf="showCreateModal" (click)="showCreateModal = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Create New Page</h3>
            <button class="close-btn" (click)="showCreateModal = false">&times;</button>
          </div>
          <form (ngSubmit)="createPage()">
            <div class="form-group">
              <label for="title">Page Title</label>
              <input 
                id="title"
                type="text" 
                [(ngModel)]="newPage.title" 
                name="title"
                class="form-control"
                placeholder="Enter page title"
                required
              >
            </div>
            <div class="form-group">
              <label for="slug">Page Slug</label>
              <input 
                id="slug"
                type="text" 
                [(ngModel)]="newPage.slug" 
                name="slug"
                class="form-control"
                placeholder="enter-page-slug"
                required
              >
              <small class="form-help">URL-friendly identifier (lowercase, hyphens only)</small>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="showCreateModal = false">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!newPage.title || !newPage.slug">
                Create Page
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cms-pages-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .header h2 {
      margin: 0;
      color: #1f2937;
      font-size: 24px;
      font-weight: 600;
    }

    .pages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .page-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 24px;
      transition: all 0.2s ease;
      border: 1px solid #f3f4f6;
    }

    .page-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .page-header h3 {
      margin: 0;
      color: #1f2937;
      font-size: 18px;
      font-weight: 600;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.published {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.draft {
      background: #fef3c7;
      color: #92400e;
    }

    .page-meta {
      margin-bottom: 20px;
      color: #6b7280;
      font-size: 14px;
    }

    .page-meta p {
      margin: 4px 0;
    }

    .page-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #6b7280;
    }

    .empty-state h3 {
      margin-bottom: 8px;
      color: #374151;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h3 {
      margin: 0;
      color: #1f2937;
      font-size: 18px;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
      padding: 4px;
    }

    .close-btn:hover {
      color: #374151;
    }

    form {
      padding: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #374151;
      font-weight: 500;
      font-size: 14px;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-help {
      display: block;
      margin-top: 4px;
      color: #6b7280;
      font-size: 12px;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 24px;
      border-top: 1px solid #e5e7eb;
    }
  `]
})
export class CmsPagesComponent implements OnInit {
  pages: CmsPage[] = [];
  showCreateModal = false;
  newPage: any = { title: '', slug: '' };

  constructor(private cmsService: CmsService) { }

  ngOnInit() {
    this.loadPages();
  }

  loadPages() {
    this.cmsService.getAllPages().subscribe({
      next: (data) => this.pages = data,
      error: (error) => console.error('Error loading pages:', error)
    });
  }

  createPage() {
    if (!this.newPage.title || !this.newPage.slug) {
      return;
    }

    this.cmsService.createPage(this.newPage).subscribe({
      next: () => {
        this.loadPages();
        this.showCreateModal = false;
        this.newPage = { title: '', slug: '' };
      },
      error: (error) => console.error('Error creating page:', error)
    });
  }

  toggleStatus(page: CmsPage) {
    const newStatus = page.status === 'published' ? 'draft' : 'published';
    this.cmsService.updatePage(page.id, { status: newStatus }).subscribe({
      next: () => {
        page.status = newStatus;
      },
      error: (error) => console.error('Error updating page status:', error)
    });
  }

  deletePage(id: number) {
    if (confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      this.cmsService.deletePage(id).subscribe({
        next: () => {
          this.loadPages();
        },
        error: (error) => console.error('Error deleting page:', error)
      });
    }
  }
}
