import { Routes } from "@angular/router";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { TeamMemberFormComponent } from "./pages/team-member-form/team-member-form.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { TeamMemberDetailComponent } from "./pages/team-member-detail/team-member-detail.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { AuthorizedGuard } from "./guards/authorized.guard";
import { teamMembersResolver } from "./resolvers/team-members.resolver";
import { teamMemberDetailResolver } from "./resolvers/team-member-detail.resolver";

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve: { members: teamMembersResolver }
  },
  { path: 'team-members/new', component: TeamMemberFormComponent },
  {
    path: 'team-members/:id/edit',
    component: TeamMemberFormComponent,
  },
  {
    path: 'team-members/:id',
    component: TeamMemberDetailComponent,
    resolve: { member: teamMemberDetailResolver }
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthorizedGuard]
  },
  { path: '**', component: NotFoundComponent }
]
