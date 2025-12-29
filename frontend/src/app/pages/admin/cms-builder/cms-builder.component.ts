import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CmsService, CmsPage, CmsComponent } from '../../../services/cms.service';
import { MediaService, Media } from '../../../services/media.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-cms-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  template: `
    <div class="cms-builder-container">
      <div class="builder-header">
        <h2>Page Builder - {{ page?.title }}</h2>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="router.navigate(['/admin/pages'])">
            Back to Pages
          </button>
          <button class="btn btn-primary" (click)="savePage()" [disabled]="isSaving">
            {{ isSaving ? 'Saving...' : 'Save Page' }}
          </button>
          <button class="btn btn-secondary" (click)="previewPage()" [disabled]="!page">
            View Page
          </button>
        </div>
      </div>

      <div class="builder-layout">
        <!-- Component Palette -->
        <div class="component-palette">
          <h3>Components</h3>
          <div class="palette-items">
            <div 
              class="palette-item" 
              *ngFor="let componentType of availableComponents"
              (click)="addComponent(componentType.type)"
            >
              <div class="component-icon">{{ componentType.icon }}</div>
              <div class="component-info">
                <div class="component-name">{{ componentType.name }}</div>
                <div class="component-desc">{{ componentType.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="canvas-area">
          <div class="canvas-header">
            <h3>Page Content</h3>
            <div class="canvas-info">
              <span class="status-badge" [class.draft]="page?.status === 'draft'" [class.published]="page?.status === 'published'">
                {{ page?.status }}
              </span>
              <button class="btn btn-small" (click)="togglePublish()">
                {{ page?.status === 'published' ? 'Unpublish' : 'Publish' }}
              </button>
            </div>
          </div>

          <div class="canvas-content" cdkDropList (cdkDropListDropped)="drop($event)">
            <div 
              class="component-item" 
              *ngFor="let component of components; let i = index; trackBy: trackByComponentId"
              cdkDrag
              [class.selected]="selectedComponent?.id === component.id"
              (click)="selectComponent(component)"
            >
              <div class="component-header">
                <div class="component-title">
                  <span class="drag-handle" cdkDragHandle>⋮⋮</span>
                  {{ getComponentTypeName(component.type) }}
                </div>
                <div class="component-actions">
                  <button class="btn-icon" (click)="editComponent(component)" title="Edit">
                    ✏️
                  </button>
                  <button class="btn-icon delete" (click)="deleteComponent(component.id!)" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
              
              <div class="component-preview">
                <div class="preview-placeholder" *ngIf="!component.fields || component.fields.length === 0">
                  Click edit to configure this component
                </div>
                <div class="preview-content" *ngIf="component.fields && component.fields.length > 0">
                  <div *ngFor="let field of (previewFieldsMap[component.id!] || [])" class="preview-field">
                    <strong>{{ field.field_name }}:</strong> 
                    <span *ngIf="field.field_type === 'media' && field.field_value">
                      <img [src]="field.resolved_url" class="preview-image" *ngIf="field.resolved_url; else noImage">
                      <ng-template #noImage>Image selected</ng-template>
                    </span>
                    <span *ngIf="field.field_type !== 'media'" class="field-value">
                      {{ field.field_value || 'Not set' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="empty-canvas" *ngIf="components.length === 0">
              <div class="empty-message">
                <h4>Start Building Your Page</h4>
                <p>Add components from the palette to create your page content</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Component Editor -->
        <div class="component-editor" *ngIf="selectedComponent">
          <div class="editor-header">
            <h3>Edit Component</h3>
            <button class="close-btn" (click)="selectedComponent = null">&times;</button>
          </div>
          
          <div class="editor-content">
            <form (ngSubmit)="saveComponent()">
              <div *ngFor="let field of currentFields" class="form-group">
                <label>{{ field.label }}</label>
                
                <!-- Text Input -->
                <input 
                  *ngIf="field.type === 'text'"
                  type="text" 
                  [(ngModel)]="fieldValues[field.name]"
                  [name]="field.name"
                  class="form-control"
                  [placeholder]="field.placeholder"
                >

                <!-- Textarea -->
                <textarea 
                  *ngIf="field.type === 'textarea'"
                  [(ngModel)]="fieldValues[field.name]"
                  [name]="field.name"
                  class="form-control"
                  [placeholder]="field.placeholder"
                  rows="4"
                ></textarea>

                <!-- Media Selector -->
                <div *ngIf="field.type === 'media'" class="media-selector">
                  <div class="media-preview" *ngIf="fieldValues[field.name]">
                    <img [src]="getMediaUrl(fieldValues[field.name])" class="selected-media">
                    <button type="button" class="remove-media" (click)="fieldValues[field.name] = null">
                      Remove
                    </button>
                  </div>
                  <button 
                    type="button" 
                    class="btn btn-secondary" 
                    (click)="openMediaSelector(field.name)"
                  >
                    {{ fieldValues[field.name] ? 'Change Image' : 'Select Image' }}
                  </button>
                </div>

                <!-- Select -->
                <select 
                  *ngIf="field.type === 'select'"
                  [(ngModel)]="fieldValues[field.name]"
                  [name]="field.name"
                  class="form-control"
                >
                  <option *ngFor="let option of field.options" [value]="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div class="editor-actions">
                <button type="button" class="btn btn-secondary" (click)="selectedComponent = null">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" (click)="saveComponent()" [disabled]="!selectedComponent">
                  Save Component
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Media Selector Modal -->
      <div class="modal-overlay" *ngIf="showMediaSelector" (click)="showMediaSelector = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Select Image</h3>
            <button class="close-btn" (click)="showMediaSelector = false">&times;</button>
          </div>
          <div class="media-grid">
            <div 
              class="media-item" 
              *ngFor="let media of mediaItems"
              (click)="selectMedia(media.id)"
            >
              <img [src]="media.url" [alt]="media.original_name" class="media-thumbnail">
              <div class="media-name">{{ media.original_name }}</div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="showMediaSelector = false">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cms-builder-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f9fafb;
    }

    .builder-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .builder-header h2 {
      margin: 0;
      color: #1f2937;
      font-size: 20px;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .builder-layout {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .component-palette {
      width: 280px;
      background: white;
      border-right: 1px solid #e5e7eb;
      padding: 20px;
      overflow-y: auto;
    }

    .component-palette h3 {
      margin: 0 0 16px 0;
      color: #1f2937;
      font-size: 16px;
      font-weight: 600;
    }

    .palette-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .palette-item {
      display: flex;
      align-items: center;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #f9fafb;
    }

    .palette-item:hover {
      background: #f3f4f6;
      border-color: #2563eb;
      transform: translateY(-1px);
    }

    .component-icon {
      font-size: 20px;
      margin-right: 12px;
      width: 24px;
      text-align: center;
    }

    .component-info {
      flex: 1;
    }

    .component-name {
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 2px;
    }

    .component-desc {
      font-size: 12px;
      color: #6b7280;
    }

    .canvas-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .canvas-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }

    .canvas-header h3 {
      margin: 0;
      color: #1f2937;
      font-size: 16px;
      font-weight: 600;
    }

    .canvas-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.draft {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.published {
      background: #dcfce7;
      color: #166534;
    }

    .btn-small {
      padding: 4px 8px;
      font-size: 12px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 4px;
      cursor: pointer;
    }

    .canvas-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }

    .component-item {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 16px;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .component-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .component-item.selected {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .component-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f3f4f6;
      background: #f9fafb;
      border-radius: 8px 8px 0 0;
    }

    .component-title {
      display: flex;
      align-items: center;
      font-weight: 500;
      color: #1f2937;
    }

    .drag-handle {
      margin-right: 8px;
      color: #9ca3af;
      cursor: move;
    }

    .component-actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      font-size: 14px;
    }

    .btn-icon:hover {
      background: #f3f4f6;
    }

    .btn-icon.delete:hover {
      background: #fee2e2;
    }

    .component-preview {
      padding: 16px;
      min-height: 60px;
    }

    .preview-placeholder {
      text-align: center;
      color: #6b7280;
      font-style: italic;
      padding: 20px;
    }

    .preview-content {
      font-size: 14px;
    }

    .preview-field {
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }

    .preview-field strong {
      margin-right: 8px;
      color: #374151;
    }

    .field-value {
      color: #6b7280;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .preview-image {
      max-width: 60px;
      max-height: 40px;
      object-fit: cover;
      border-radius: 4px;
      margin-left: 8px;
    }

    .empty-canvas {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 400px;
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      background: #f9fafb;
    }

    .empty-message {
      text-align: center;
      color: #6b7280;
    }

    .empty-message h4 {
      margin-bottom: 8px;
      color: #374151;
    }

    .component-editor {
      width: 320px;
      background: white;
      border-left: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .editor-header h3 {
      margin: 0;
      color: #1f2937;
      font-size: 16px;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #6b7280;
    }

    .close-btn:hover {
      color: #374151;
    }

    .editor-content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      color: #374151;
      font-weight: 500;
      font-size: 14px;
    }

    .form-control {
      width: 100%;
      padding: 10px 12px;
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

    .media-selector {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .media-preview {
      position: relative;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      overflow: hidden;
    }

    .selected-media {
      width: 100%;
      height: 120px;
      object-fit: cover;
    }

    .remove-media {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    }

    .editor-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 20px;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
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

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h3 {
      margin: 0;
      color: #1f2937;
      font-size: 18px;
      font-weight: 600;
    }

    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      padding: 24px;
      max-height: 60vh;
      overflow-y: auto;
    }

    .media-item {
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #f9fafb;
    }

    .media-item:hover {
      border-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .media-thumbnail {
      width: 100%;
      height: 120px;
      object-fit: cover;
    }

    .media-name {
      padding: 8px 12px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 20px 24px;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    /* Drag and Drop Styles */
    .cdk-drag-preview {
      background: white;
      border: 2px solid #2563eb;
      border-radius: 8px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      padding: 16px;
      opacity: 0.9;
    }

    .cdk-drag-placeholder {
      opacity: 0.3;
      background: #f3f4f6;
      border: 2px dashed #d1d5db;
      border-radius: 8px;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class CmsBuilderComponent implements OnInit {
  page: CmsPage | null = null;
  components: CmsComponent[] = [];
  selectedComponent: CmsComponent | null = null;
  fieldValues: { [key: string]: any } = {};
  showMediaSelector = false;
  mediaItems: Media[] = [];
  currentMediaField = '';
  isSaving = false;
  previewFieldsMap: { [key: number]: any[] } = {};
  currentFields: any[] = [];

  availableComponents = [
    {
      type: 'hero',
      name: 'Hero Section',
      icon: '🏠',
      description: 'Large banner with title, subtitle, and call-to-action'
    },
    {
      type: 'text-block',
      name: 'Text Block',
      icon: '📝',
      description: 'Simple text content with formatting options'
    },
    {
      type: 'image-text',
      name: 'Image + Text',
      icon: '🖼️',
      description: 'Side-by-side image and text content'
    },
    {
      type: 'services-list',
      name: 'Services List',
      icon: '🚗',
      description: 'Display driving school services with icons and descriptions'
    },
    {
      type: 'cta',
      name: 'Call to Action',
      icon: '🎯',
      description: 'Prominent button or link for user action'
    },
    {
      type: 'opening-hours',
      name: 'Opening Hours',
      icon: '🕐',
      description: 'Business hours display with schedule'
    },
    {
      type: 'gallery',
      name: 'Image Gallery',
      icon: '🖼️',
      description: 'Grid or carousel of multiple images'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private cmsService: CmsService,
    private mediaService: MediaService
  ) {}

  ngOnInit() {
    const pageId = this.route.snapshot.paramMap.get('id');
    if (pageId) {
      this.loadPage(+pageId);
      this.loadMedia();
    }
  }

  loadPage(pageId: number) {
    this.cmsService.getAllPages().subscribe({
      next: (pages) => {
        this.page = pages.find(p => p.id === pageId) || null;
        if (this.page) {
          this.loadComponents();
        }
      },
      error: (error) => console.error('Error loading page:', error)
    });
  }

  loadComponents() {
    if (!this.page) return;
    
    this.cmsService.getPageBySlug(this.page.slug).subscribe({
      next: (page) => {
        this.components = page.components || [];
        // Precompute preview fields to avoid heavy function calls during change detection
        this.previewFieldsMap = {};
        for (const comp of this.components) {
          this.previewFieldsMap[comp.id!] = this.computePreviewFields(comp);
        }
      },
      error: (error) => console.error('Error loading components:', error)
    });
  }

  loadMedia() {
    this.mediaService.getMedia().subscribe({
      next: (media) => {
        this.mediaItems = media;
        // Recompute preview fields now that media URLs are available
        const newMap: { [key: number]: any[] } = {};
        for (const comp of this.components) {
          newMap[comp.id!] = this.computePreviewFields(comp);
        }
        this.previewFieldsMap = newMap;
      },
      error: (error) => console.error('Error loading media:', error)
    });
  }

  addComponent(type: string) {
    if (!this.page) return;

    const newComponent: Partial<CmsComponent> = {
      page_id: this.page.id,
      type: type,
      name: this.getComponentTypeName(type),
      sort_order: this.components.length,
      is_active: true,
      fields: []
    };

    this.cmsService.addComponent(newComponent).subscribe({
      next: (component) => {
        this.components.push(component);
        this.previewFieldsMap[component.id!] = this.computePreviewFields(component);
        this.selectComponent(component);
      },
      error: (error) => console.error('Error adding component:', error)
    });
  }

  selectComponent(component: CmsComponent) {
    this.selectedComponent = component;
    this.loadComponentFields(component);
    this.currentFields = this.getComponentFields(component.type);
  }

  editComponent(component: CmsComponent) {
    this.selectComponent(component);
  }

  deleteComponent(componentId: number) {
    if (confirm('Are you sure you want to delete this component?')) {
      this.cmsService.deleteComponent(componentId).subscribe({
        next: () => {
          this.components = this.components.filter(c => c.id !== componentId);
          if (this.selectedComponent?.id === componentId) {
            this.selectedComponent = null;
          }
        },
        error: (error) => console.error('Error deleting component:', error)
      });
    }
  }

  drop(event: CdkDragDrop<CmsComponent[]>) {
    moveItemInArray(this.components, event.previousIndex, event.currentIndex);
    
    // Update sort order
    const updatedComponents = this.components.map((comp, index) => ({
      id: comp.id!,
      sort_order: index
    }));

    this.cmsService.reorderComponents(updatedComponents).subscribe({
      error: (error) => console.error('Error reordering components:', error)
    });

    // Recompute preview fields ordering map
    const newMap: { [key: number]: any[] } = {};
    for (const comp of this.components) {
      newMap[comp.id!] = this.previewFieldsMap[comp.id!] || this.computePreviewFields(comp);
    }
    this.previewFieldsMap = newMap;
  }

  loadComponentFields(component: CmsComponent) {
    this.fieldValues = {};
    if (component.fields) {
      component.fields.forEach(field => {
        this.fieldValues[field.field_name] = field.field_value;
      });
    }
    // Ensure defaults for defined schema fields
    for (const field of this.getComponentFields(component.type)) {
      if (!(field.name in this.fieldValues)) {
        this.fieldValues[field.name] = field.type === 'select' ? (field.options?.[0]?.value || '') : '';
      }
    }
  }

  getComponentFields(type: string): any[] {
    const fieldConfigs: { [key: string]: any[] } = {
      'hero': [
        { name: 'title', label: 'Hero Title', type: 'text', placeholder: 'Enter hero title' },
        { name: 'subtitle', label: 'Hero Subtitle', type: 'textarea', placeholder: 'Enter hero subtitle' },
        { name: 'background_image', label: 'Background Image', type: 'media' },
        { name: 'cta_text', label: 'Call to Action Text', type: 'text', placeholder: 'Get Started' },
        { name: 'cta_link', label: 'Call to Action Link', type: 'text', placeholder: '/contact' }
      ],
      'text-block': [
        { name: 'content', label: 'Content', type: 'textarea', placeholder: 'Enter your text content' },
        { name: 'alignment', label: 'Text Alignment', type: 'select', options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' }
        ]}
      ],
      'image-text': [
        { name: 'title', label: 'Title', type: 'text', placeholder: 'Enter title' },
        { name: 'content', label: 'Content', type: 'textarea', placeholder: 'Enter content' },
        { name: 'image', label: 'Image', type: 'media' },
        { name: 'image_position', label: 'Image Position', type: 'select', options: [
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' }
        ]}
      ],
      'services-list': [
        { name: 'title', label: 'Section Title', type: 'text', placeholder: 'Our Services' }
      ],
      'cta': [
        { name: 'title', label: 'Title', type: 'text', placeholder: 'Ready to start?' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description text' },
        { name: 'button_text', label: 'Button Text', type: 'text', placeholder: 'Contact Us' },
        { name: 'button_link', label: 'Button Link', type: 'text', placeholder: '/contact' }
      ],
      'opening-hours': [
        { name: 'title', label: 'Section Title', type: 'text', placeholder: 'Opening Hours' }
      ],
      'gallery': [
        { name: 'layout', label: 'Layout Style', type: 'select', options: [
          { value: 'grid', label: 'Grid' },
          { value: 'carousel', label: 'Carousel' }
        ]}
      ]
    };

    return fieldConfigs[type] || [];
  }

  getComponentTypeName(type: string): string {
    const typeConfig = this.availableComponents.find(c => c.type === type);
    return typeConfig?.name || type;
  }

  computePreviewFields(component: CmsComponent): any[] {
    if (!component || !component.fields) return [];
    return component.fields
      .filter(field => {
        const val = field.field_value;
        if (val === null || val === undefined) return false;
        const str = typeof val === 'string' ? val : String(val);
        return str.trim() !== '';
      })
      .map(field => {
        if (field.field_type === 'media') {
          return { ...field, resolved_url: this.getMediaUrl(field.field_value) };
        }
        return field;
      });
  }

  trackByComponentId(index: number, comp: CmsComponent) {
    return comp.id;
  }

  getMediaUrl(mediaId: string): string {
    if (!mediaId) return '';
    const idNum = typeof mediaId === 'string' ? parseInt(mediaId, 10) : mediaId;
    const media = this.mediaItems?.find(m => m.id === idNum);
    return media?.url || '';
  }

  openMediaSelector(fieldName: string) {
    this.currentMediaField = fieldName;
    this.showMediaSelector = true;
  }

  selectMedia(mediaId: number) {
    this.fieldValues[this.currentMediaField] = mediaId.toString();
    this.showMediaSelector = false;
  }

  saveComponent() {
    if (!this.selectedComponent) return;

    const fields = this.getComponentFields(this.selectedComponent.type).map(field => ({
      field_name: field.name,
      field_type: field.type,
      field_value: this.fieldValues[field.name] || ''
    }));

    const componentData = {
      name: this.selectedComponent.name,
      sort_order: this.selectedComponent.sort_order,
      is_active: this.selectedComponent.is_active,
      fields: fields
    };

    if (this.selectedComponent.id) {
      this.cmsService.updateComponent(this.selectedComponent.id, componentData).subscribe({
        next: (updatedComponent) => {
          const index = this.components.findIndex(c => c.id === updatedComponent.id);
          if (index !== -1) {
            this.components[index] = updatedComponent;
            this.previewFieldsMap[updatedComponent.id!] = this.computePreviewFields(updatedComponent);
          }
          this.selectedComponent = null;
        },
        error: (error) => console.error('Error updating component:', error)
      });
    }
  }

  savePage() {
    if (!this.page) return;
    this.isSaving = true;

    const updatedComponents = this.components.map((comp, index) => ({
      id: comp.id!,
      sort_order: index
    }));

    const ops: any[] = [];

    // Always persist current ordering to backend
    ops.push(this.cmsService.reorderComponents(updatedComponents));

    // Persist currently edited component fields if any
    if (this.selectedComponent) {
      const fields = this.getComponentFields(this.selectedComponent.type).map(field => ({
        field_name: field.name,
        field_type: field.type,
        field_value: this.fieldValues[field.name] || ''
      }));

      const componentData = {
        name: this.selectedComponent.name,
        sort_order: this.selectedComponent.sort_order,
        is_active: this.selectedComponent.is_active,
        fields
      };

      ops.push(this.cmsService.updateComponent(this.selectedComponent.id!, componentData));
    }

    forkJoin(ops).subscribe({
      next: (results) => {
        // If component updated, refresh local cache
        if (this.selectedComponent) {
          const updated = results[results.length - 1];
          const idx = this.components.findIndex(c => c.id === updated.id);
          if (idx !== -1) {
            this.components[idx] = updated;
            this.previewFieldsMap[updated.id!] = this.computePreviewFields(updated);
          }
          this.selectedComponent = null;
        }
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Error saving page:', err);
        this.isSaving = false;
      }
    });
  }

  togglePublish() {
    if (!this.page) return;

    const newStatus = this.page.status === 'published' ? 'draft' : 'published';
    this.cmsService.updatePage(this.page.id, { status: newStatus }).subscribe({
      next: () => {
        if (this.page) {
          this.page.status = newStatus;
        }
      },
      error: (error) => console.error('Error updating page status:', error)
    });
  }

  previewPage() {
    if (!this.page) return;
    const url = `/page/${this.page.slug}`;
    window.open(url, '_blank');
  }
}
