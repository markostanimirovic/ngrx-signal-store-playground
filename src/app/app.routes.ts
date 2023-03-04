import { Route } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
import { UsersComponent } from './users/users.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/counter', pathMatch: 'full' },
  { path: 'counter', component: CounterComponent },
  { path: 'users', component: UsersComponent },
];
