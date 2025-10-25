---
marp: true
theme: gaia
_class: lead
paginate: true
backgroundColor: #232126
---

<style scoped>
  h1 strong {
    color: #fbfbfb
  }
  p {
    color: #fff
  }
</style>

![bg left:40% 80%](https://angular.dev/assets/images/press-kit/angular_wordmark_gradient.png)

# **Clase 5**

Rutas en Angular con RouterModule

---

<!-- backgroundColor: #f6f7f9 -->

<style>
  small {
    font-size: 38px;
  }
</style>

<style scoped>
  p {
    text-align: center
  }
  img {
    width: 70%
  }
</style>

# RouterModule

- Sistema de navegación que convierte aplicaciones de una sola página en experiencias multi-página
- Permite navegación sin recargas (SPA)
- Gestiona el estado de la aplicación a través de URLs

---

# Navegación Sin Recargas (SPA)

RouterModule permite que los usuarios naveguen por diferentes vistas sin recargar la página completa:

- **Experiencia fluida**: Similar a aplicaciones nativas
- **Rendimiento optimizado**: No se descarga toda la página
- **Transiciones suaves**: Animaciones entre vistas
- **Estado preservado**: Los datos en memoria se mantienen

---

# RouterOutlet

```html
<div class="app">
  <app-header></app-header>

  <!-- Aquí Angular renderiza el componente de la ruta activa -->
  <router-outlet></router-outlet>
</div>
```

`<router-outlet>` actúa como un contenedor dinámico donde se renderizan los componentes según la ruta actual.

---

# URL Como Estado de la Aplicación

Las URLs representan el estado actual de la aplicación:

- **Route Parameters**: `/team-members/123` → ID del miembro
- **Query Parameters**: `/dashboard?filter=available` → Filtros activos
- **Fragments**: `/dashboard#statistics` → Sección específica

---

# Configuración Básica de Rutas

```typescript
// app.routes.ts
import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'team-members/:id', component: TeamDetailComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', component: NotFoundComponent },
]
```

---

# Navegación Declarativa

```html
<!-- Navegación básica -->
<a routerLink="/dashboard">Dashboard</a>

<!-- Con parámetros -->
<a routerLink="/team-members/{{member.id}}">Ver Perfil</a>

<!-- Con estilos activos -->
<a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
```

**routerLinkActive** aplica clases CSS automáticamente cuando la ruta está activa.

---

# Parámetros de Ruta

```typescript
// En el componente
export class TeamDetailComponent implements OnInit {
  member: TeamMember | null = null

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'))
      // Usar el id para cargar datos
    })
  }
}
```

---

# Navegación Programática

Navegar desde el código TypeScript permite lógica compleja:

```typescript
export class TeamMemberCardComponent {
  constructor(private router: Router) {}

  viewMemberDetail() {
    this.router.navigate(['/team-members', this.member.id])
  }

}
```

---

# ¿Cuándo usar Navegación Programática?

- **Después de acciones**: Submit de formularios exitosos
- **Navegación condicional**: Basada en permisos o estado
- **Con lógica compleja**: Validaciones antes de navegar
- **Dinámicamente**: URLs construidas en runtime

---

# Guards y Resolvers

**Guards** protegen el acceso a rutas:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthorizedGuard implements CanActivate {
  private isAuthorized = false

  constructor(private router: Router) {}

  canActivate(): boolean { }
}
```

---

# Aplicando Guards a Rutas

```typescript
export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthorizedGuard],
  },
]
```

El guard se ejecuta **antes** de activar la ruta.

---

# Resolvers

Los **Resolvers** precargan datos antes de activar una ruta:

```typescript
@Injectable({ providedIn: 'root' })
export class TeamMemberResolver implements Resolve<TeamMember | null> {
  constructor(private teamService: TeamMemberService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): TeamMember | null {
    const id = Number(route.paramMap.get('id'))
    const member = this.teamService.getMemberById(id)
  }
}
```

---

# Usando Resolvers en Rutas

```typescript
export const routes: Routes = [
  {
    path: 'team/:id',
    component: TeamDetailComponent,
    resolve: { member: TeamMemberResolver },
  },
]
```

En el componente, acceder a los datos resueltos:

```typescript
ngOnInit() {
  this.member = this.route.snapshot.data['member'];
}
```
