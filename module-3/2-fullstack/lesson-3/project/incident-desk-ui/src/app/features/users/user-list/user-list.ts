import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/api.service';
import { User } from '../user.model';

// Componente que muestra el listado de usuarios del sistema en una tabla.
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [MatTableModule, MatCardModule, AsyncPipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UsersList implements OnInit {
  private readonly api = inject(ApiService);

  users$!: Observable<User[]>;
  // Define las columnas visibles en la tabla de usuarios.
  readonly displayedColumns = ['fullName', 'email', 'role', 'isActive'];

  // Carga la lista de usuarios desde el backend.
  ngOnInit(): void {
    this.users$ = this.api.getUsers();
  }
}
