import { Routes } from "@angular/router";
import { DashboardFormControlComponent } from "./pages/dashboard/form-control/dashboard.component";
import { DashboardFormGroupComponent } from "./pages/dashboard/form-group/dashboard.component";
import { DashboardValidatorsComponent } from "./pages/dashboard/validators/dashboard.component";
import { TeamMemberFormComponent } from "./pages/team-member-form/create/team-member-form.component";
import { TeamMemberFormComponent as TeamMemberFormComponentUpdate } from "./pages/team-member-form/create-update/team-member-form.component"
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { TeamMemberDetailComponent } from "./pages/team-member-detail/team-member-detail.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { AuthorizedGuard } from "./guards/authorized.guard";

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard/form-control', pathMatch: 'full' },
  { path: 'dashboard', redirectTo: '/dashboard/form-control', pathMatch: 'full' },

  // Paso 1: FormControl básico
  { path: 'dashboard/form-control', component: DashboardFormControlComponent },

  // Paso 2: FormGroup simple
  { path: 'dashboard/form-group', component: DashboardFormGroupComponent },

  // Paso 3: Validadores built-in (default)
  { path: 'dashboard/validators', component: DashboardValidatorsComponent },

  // Paso 5: Formulario simplificado - Información básica (Crear/Editar)
  { path: 'team-members/new', component: TeamMemberFormComponent },
  { path: 'team-members/:id/edit', component: TeamMemberFormComponentUpdate },

  { path: 'team-members/:id', component: TeamMemberDetailComponent },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthorizedGuard]
  },
  { path: '**', component: NotFoundComponent }
]
