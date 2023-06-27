import { debounceTime, Observable, pipe, switchMap, tap } from 'rxjs';
import {
  rxEffect,
  signalStoreFeatureFactory,
  withMethods,
} from '@ngrx/signals';
import { Filter } from './filter.feature';
import { CallState, setLoaded, setLoading } from './call-state.feature';
import { inject, Type } from '@angular/core';

export interface EntityService<T> {
  getAll(): Promise<T[]>;
  getByFilter(filter: Filter): Observable<T[]>;
}

export function withLoadEntities<T>(
  entityServiceClass: Type<EntityService<T>>
) {
  const loadEntitiesFeature = signalStoreFeatureFactory<{
    // if some of the specified input state slices don't exist in the store where
    // `withLoadEntities` feature is used, the compilation error will be thrown
    state: { entities: T[]; callState: CallState };
  }>();

  return loadEntitiesFeature(
    withMethods(({ $update }, entityService = inject(entityServiceClass)) => ({
      // We can use `rxEffect` to create side effects by using RxJS APIs.
      loadByFilter: rxEffect<Filter>(
        pipe(
          debounceTime(300),
          tap(() => $update(setLoading())),
          switchMap((filter) => entityService.getByFilter(filter)),
          tap((entities) => $update({ entities }, setLoaded()))
        )
      ),
      // However, that's not mandatory. We can also perform async effects without RxJS:
      async loadAll() {
        $update(setLoading());
        const entities = await entityService.getAll();
        $update({ entities }, setLoaded());
      },
    }))
  );
}
