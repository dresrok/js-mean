import { Routes } from "@angular/router";
import { DashboardComponent } from "./pages/dashboard/dashboard/dashboard.component";
import { NotFoundComponent } from "./pages/not-found/not-found/not-found.component";
import { TeamMemberDetailComponent } from "./pages/team-member-detail/team-member-detail/team-member-detail.component";
import { SettingsComponent } from "./pages/settings/settings/settings.component";
import { AuthorizedGuard } from "./guards/authorized.guard";

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'team-members/:id', component: TeamMemberDetailComponent },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthorizedGuard]
  },
  { path: '**', component: NotFoundComponent }
]
