import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Componente raíz de la aplicación que actúa como contenedor principal del enrutador.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App { }
