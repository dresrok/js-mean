import { Routes } from "@angular/router";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { DashboardResolverComponent } from "./pages/dashboard/resolver/dashboard.component";
import { TeamMemberFormComponent } from "./pages/team-member-form/create/team-member-form.component";
import { TeamMemberFormComponent as TeamMemberFormComponentUpdate } from "./pages/team-member-form/create-update/team-member-form.component"
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { TeamMemberDetailComponent } from "./pages/team-member-detail/team-member-detail.component";
import { TeamMemberDetailResolverComponent } from "./pages/team-member-detail/resolver/team-member-detail.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { AuthorizedGuard } from "./guards/authorized.guard";
import { teamMembersResolver } from "./resolvers/team-members.resolver";
import { teamMemberDetailResolver } from "./resolvers/team-member-detail.resolver";

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  // Dashboard - versión con resolver
  {
    path: 'dashboard-resolver',
    component: DashboardResolverComponent,
    resolve: { members: teamMembersResolver }
  },
  { path: 'team-members/new', component: TeamMemberFormComponent },
  { path: 'team-members/:id/edit', component: TeamMemberFormComponentUpdate },
  { path: 'team-members/:id', component: TeamMemberDetailComponent },

  // Team member detail - versión con resolver
  {
    path: 'team-members-resolver/:id',
    component: TeamMemberDetailResolverComponent,
    resolve: { member: teamMemberDetailResolver }
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthorizedGuard]
  },
  { path: '**', component: NotFoundComponent }
]
