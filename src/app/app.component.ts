import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { interval } from 'rxjs';
import { signalState } from '@ngrx/signals';
import { immerUpdater } from './shared/immer-update.feature';

import * as test1 from '../tests/test1';
import * as test2 from '../tests/test2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, JsonPipe],
  template: `
    <div>
      <a routerLink="/counter">Counter</a> | <a routerLink="/users">Users</a> |
      <a routerLink="/todos">Todos</a>
    </div>
    <router-outlet></router-outlet>

    <br />
    <p>{{ state.user.firstName() }} {{ state.user.lastName() }}</p>
    <p>{{ state.user() | json }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly state = signalState({
    user: {
      firstName: 'Marko',
      lastName: 'Stanimirovic',
    },
  });

  constructor() {
    interval(1000).subscribe((i) => {
      this.state.$update(
        immerUpdater((state) => {
          state.user.lastName = `Stanimirovic${i + 1}`;
        })
      );
    });
  }
}
