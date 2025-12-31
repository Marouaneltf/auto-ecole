import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div class="container">
        <h1>{{ title }}</h1>
      </div>
    </div>

    <div class="container content" [innerHTML]="contentHtml"></div>
  `,
  styles: [`
    .page-header {
      background-color: #1E40AF;
      color: white;
      padding: 60px 0;
      text-align: center;
    }
    .page-header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .content {
      padding-top: 60px;
      padding-bottom: 80px;
    }
  `]
})
export class LegalComponent implements OnInit {
  title = 'Mentions Légales';
  contentHtml = '';
  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.api.getContent('legal','title').subscribe({ next: (i) => this.title = i?.content || this.title, error: () => {} });
    this.api.getContent('legal','content_html').subscribe({ next: (i) => this.contentHtml = i?.content || '', error: () => {} });
  }
}
