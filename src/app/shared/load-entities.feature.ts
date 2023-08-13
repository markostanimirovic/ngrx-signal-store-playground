import { inject, Injector, runInInjectionContext } from '@angular/core';
import { debounceTime, Observable, pipe, switchMap, tap } from 'rxjs';
import { rxMethod, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { Filter } from './filter.feature';
import {
  CallState,
  setError,
  setLoaded,
  setLoading,
} from './call-state.feature';

export function withLoadEntitiesByFilter<T>(
  geyByFilter: (filter: Filter) => Observable<T[]>
) {
  return signalStoreFeature(
    { state: type<{ entities: T[]; callState: CallState }>() },
    withMethods((store, injector = inject(Injector)) => ({
      loadByFilter: rxMethod<Filter>(
        pipe(
          debounceTime(300),
          tap(() => store.$update(setLoading())),
          switchMap((filter) =>
            runInInjectionContext(injector, () => geyByFilter(filter))
          ),
          tap({
            next: (entities) => store.$update({ entities }, setLoaded()),
            error: (error) => store.$update(setError(error.message)),
          })
        )
      ),
    }))
  );
}

export function withLoadEntities<T>(getAll: () => Promise<T[]>) {
  return signalStoreFeature(
    { state: type<{ entities: T[]; callState: CallState }>() },
    withMethods((store, injector = inject(Injector)) => ({
      async loadAll() {
        store.$update(setLoading());
        const entities = await runInInjectionContext(injector, () => getAll());
        store.$update({ entities }, setLoaded());
      },
    }))
  );
}
