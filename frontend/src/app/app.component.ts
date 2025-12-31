import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { ApiService } from './services/api.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Auto-École CAR 18 ème';
  showPublicLayout = true;

  constructor(private api: ApiService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showPublicLayout = !event.urlAfterRedirects.startsWith('/admin');
    });
  }
  ngOnInit(): void {
    this.api.getContent('ui','primary_color').subscribe({
      next: (i) => {
        const v = i?.content;
        if (v) document.documentElement.style.setProperty('--primary', v);
      },
      error: () => {}
    });
    this.api.getContent('ui','accent_color').subscribe({
      next: (i) => {
        const v = i?.content;
        if (v) document.documentElement.style.setProperty('--accent', v);
      },
      error: () => {}
    });
  }
}
