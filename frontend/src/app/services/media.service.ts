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

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private apiUrl = `${environment.apiUrl}/media`;

  constructor(private http: HttpClient) { }

  getMedia(): Observable<Media[]> {
    return this.http.get<Media[]>(this.apiUrl);
  }

  uploadMedia(file: File, altText: string = ''): Observable<Media> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', altText);
    return this.http.post<Media>(`${this.apiUrl}/upload`, formData);
  }

  deleteMedia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
