import {
  rxEffect,
  signalStore,
  signalStoreFeatureFactory,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Observable, pipe, switchMap, tap } from 'rxjs';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  CallState,
  setLoaded,
  setLoading,
  withCallState,
} from './call-state.feature';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';

// filter.feature.ts
type Filter = { query: string; page: number; pageSize: number };

export function withFilter() {
  return withState<{ filter: Filter }>({
    filter: {
      query: '',
      page: 1,
      pageSize: 10,
    },
  });
}

// load-entities-by-filter.feature.ts
type GetByFilter<T> = (filter: Filter) => Observable<T[]>;

export function withLoadEntitiesByFilter<T>(getByFilter: GetByFilter<T>) {
  const loadEntitiesByFilterFeature = signalStoreFeatureFactory<{
    state: { entities: T[]; filter: Filter; callState: CallState };
  }>();

  return loadEntitiesByFilterFeature(
    withMethods(({ $update }, injector = inject(Injector)) => ({
      loadByFilter: rxEffect<Filter>(
        pipe(
          tap(() => $update(setLoading())),
          switchMap((filter) =>
            runInInjectionContext(injector, () => getByFilter(filter))
          ),
          tap((entities) => $update({ entities }, setLoaded()))
        )
      ),
    })),
    // optionally, we can also initialize the loadByFilter effect on store init,
    // so it will be re-executed every time when filter signal changes
    withHooks({
      // we can access state signals here
      onInit: ({ filter, loadByFilter }) => loadByFilter(filter),
    })
  );
}

const UsersStore = signalStore(
  withState<{ entities: User[] }>({ entities: [] }),
  withCallState(),
  withFilter(),
  withLoadEntitiesByFilter((filter) => inject(UsersService).getByFilter(filter))
);
