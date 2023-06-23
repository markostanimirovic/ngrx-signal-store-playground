import { signalStore, withHooks, withState } from '@ngrx/signals';
import { UsersService } from './users.service';
import { User } from './user.model';
import { withCallState } from '../shared/call-state.feature';
import { withFilter } from '../shared/filter.feature';
import { withLoadEntities } from '../shared/load-entities.feature';

// creating a store using generic features
export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState({ entities: [] as User[] }),
  withCallState(),
  withFilter(),
  withLoadEntities(UsersService),
  withHooks({
    // re-fetch users every time when filter signal changes
    onInit: ({ loadEntitiesByFilter, filter }) => loadEntitiesByFilter(filter),
  })
);
