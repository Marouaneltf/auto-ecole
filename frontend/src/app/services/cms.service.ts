import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Media {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  path: string;
  url: string;
  created_at: string;
}

export interface CmsComponentField {
  id?: number;
  component_id?: number;
  field_name: string;
  field_type: string;
  field_value: any;
}

export interface CmsComponent {
  id?: number;
  page_id?: number;
  type: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  fields?: CmsComponentField[];
}

export interface CmsPage {
  id: number;
  slug: string;
  title: string;
  meta_description: string;
  status: 'draft' | 'published';
  components?: CmsComponent[];
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  private apiUrl = `${environment.apiUrl}/cms`;

  constructor(private http: HttpClient) { }

  // Public
  getPageBySlug(slug: string): Observable<CmsPage> {
    return this.http.get<CmsPage>(`${this.apiUrl}/pages/${slug}`);
  }

  // Admin - Pages
  getAllPages(): Observable<CmsPage[]> {
    return this.http.get<CmsPage[]>(`${this.apiUrl}/admin/pages`);
  }

  createPage(data: Partial<CmsPage>): Observable<CmsPage> {
    return this.http.post<CmsPage>(`${this.apiUrl}/admin/pages`, data);
  }

  updatePage(id: number, data: Partial<CmsPage>): Observable<CmsPage> {
    return this.http.put<CmsPage>(`${this.apiUrl}/admin/pages/${id}`, data);
  }

  deletePage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/pages/${id}`);
  }

  // Admin - Components
  addComponent(data: Partial<CmsComponent>): Observable<CmsComponent> {
    return this.http.post<CmsComponent>(`${this.apiUrl}/admin/components`, data);
  }

  updateComponent(id: number, data: Partial<CmsComponent>): Observable<CmsComponent> {
    return this.http.put<CmsComponent>(`${this.apiUrl}/admin/components/${id}`, data);
  }

  deleteComponent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/components/${id}`);
  }

  reorderComponents(items: { id: number; sort_order: number }[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/components/reorder`, { items });
  }
}
