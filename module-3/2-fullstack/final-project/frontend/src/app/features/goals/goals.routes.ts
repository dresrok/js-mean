import { Routes } from '@angular/router';
import { GoalListComponent } from './goal-list/goal-list.component';
import { GoalCreateComponent } from './goal-create/goal-create.component';

export const goalRoutes: Routes = [
  { path: '', component: GoalListComponent },
  { path: 'nueva', component: GoalCreateComponent }, // Spanish URL as per plan
];
