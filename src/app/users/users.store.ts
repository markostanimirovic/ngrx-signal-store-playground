import { inject } from '@angular/core';
import { signalStore, withHooks, withState } from '@ngrx/signals';
import { UsersService } from './users.service';
import { User } from './user.model';
import { withCallState } from '../shared/call-state.feature';
import { withFilter } from '../shared/filter.feature';
import { withLoadEntitiesByFilter } from '../shared/load-entities.feature';
import { withStorageSync } from '../shared/storage-sync.feature';

// creating a store using generic features
export const UsersStore = signalStore(
  withState({ entities: [] as User[] }),
  withCallState(),
  withFilter(),
  withStorageSync({
    key: 'users-store',
    select: ({ entities }) => ({ entities }),
  }),
  withLoadEntitiesByFilter((filter) =>
    inject(UsersService).getByFilter(filter)
  ),
  withHooks({
    onInit: ({ loadByFilter, filter }) => loadByFilter(filter),
  })
);
