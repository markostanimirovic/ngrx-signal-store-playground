import { Component, inject } from '@angular/core';
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
      [ngModel]="usersStore.query()"
      (ngModelChange)="usersStore.update({ query: $event })"
    />
    <span *ngIf="usersStore.loading()">Loading ...</span>

    <ul>
      <li *ngFor="let user of usersStore.users()">{{ user.name }}</li>
    </ul>

    <div>
      <button
        *ngFor="let pageSize of [1, 3, 5]"
        [class.active]="pageSize === usersStore.pageSize()"
        (click)="usersStore.update({ pageSize })"
      >
        {{ pageSize }}
      </button>
    </div>
  `,
})
export class UsersComponent {
  readonly usersStore = inject(UsersStore);
}
