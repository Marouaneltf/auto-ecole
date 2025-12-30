import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Auto-École CAR 18 ème';
  constructor(private api: ApiService) {}
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
