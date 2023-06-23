import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { signalState } from '@ngrx/signals';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, JsonPipe],
  template: `
    <div>
      <a routerLink="/counter">Counter</a> |
      <a routerLink="/users">Users</a>
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
    setInterval(() => {
      this.state.$update({
        user: {
          ...this.state.user(),
          lastName: `Stanimirovic${Math.random()}`,
        },
      });
    }, 1000);
  }
}
