import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Business Info
  getBusinessInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/business-info`);
  }

  updateBusinessInfo(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/business-info`, data);
  }

  // Services
  getServices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/services`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/services/categories`);
  }

  getServicesByCategory(slug: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/services/category/${slug}`);
  }

  createService(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/services`, data);
  }

  updateService(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/services/${id}`, data);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/services/${id}`);
  }

  // Contact
  submitContact(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, data);
  }

  // Auth (Admin)
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  // Content
  listContent(params?: { page?: string; section?: string }): Observable<any> {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    return this.http.get(`${this.apiUrl}/content${query ? `?${query}` : ''}`);
  }

  getContent(page: string, section: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/content/${page}/${section}`);
  }

  saveContent(data: { page_name: string; section_name: string; content_type?: string; content?: string; metadata?: any }): Observable<any> {
    return this.http.put(`${this.apiUrl}/content`, data);
  }

  deleteContent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/content/${id}`);
  }
}
