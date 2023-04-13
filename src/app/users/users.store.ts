import {
  rxEffect,
  signalStore,
  SignalStoreUpdate,
  withComputed,
  withEffects,
  withHooks,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { UsersService } from './users.service';
import { User } from './user.model';

type UsersState = {
  users: User[];
  loading: boolean;
  query: string;
  pageSize: number;
};

const initialState: UsersState = {
  users: [],
  loading: false,
  query: '',
  pageSize: 5,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ query, pageSize }) => ({
    filter: computed(() => ({ query: query(), pageSize: pageSize() })),
  })),
  // larger features can be moved to a separate function and/or file
  withUsersEffects(),
  withHooks({
    // re-fetch users every time when filter signal changes
    onInit: ({ loadUsersByFilter, filter }) => loadUsersByFilter(filter),
  })
);

function withUsersEffects() {
  return withEffects(
    (
      { update }: SignalStoreUpdate<UsersState>,
      { getByFilter, getAll } = inject(UsersService)
    ) => ({
      // We can use `rxEffect` to create side effects by using RxJS APIs.
      // However, that's not mandatory. We can also create effects without RxJS:
      async loadAllUsers() {
        update({ loading: true });
        const users = await getAll();
        update({ users, loading: false });
      },
      loadUsersByFilter: rxEffect<{ query: string; pageSize: number }>(
        pipe(
          debounceTime(300),
          tap(() => update({ loading: true })),
          switchMap((filter) => getByFilter(filter)),
          tap((users) => update({ users, loading: false }))
        )
      ),
    })
  );
}
