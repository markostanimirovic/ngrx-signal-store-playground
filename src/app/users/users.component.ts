import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersStore } from './users.store';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Users</h1>

    <input
      placeholder="Search..."
      [ngModel]="usersStore.filter.query()"
      (ngModelChange)="usersStore.patchFilter({ query: $event })"
    />
    <span *ngIf="usersStore.isLoading()">Loading ...</span>

    <ul>
      <li *ngFor="let user of usersStore.entities()">{{ user.name }}</li>
    </ul>

    <div>
      <button
        *ngFor="let pageSize of [1, 3, 5]"
        [class.active]="pageSize === usersStore.filter.pageSize()"
        (click)="usersStore.patchFilter({ pageSize })"
      >
        {{ pageSize }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  readonly usersStore = inject(UsersStore);
}
