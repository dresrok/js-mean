import { Component } from '@angular/core';

import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: []
})
export class AppComponent {
  companyName = 'DevSenior';
  currentName = 'Diego Ortiz';
}
