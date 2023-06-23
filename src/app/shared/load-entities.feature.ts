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
  const loadEntitiesFeatureFactory = signalStoreFeatureFactory<{
    // if some of the expected input state slices that don't exist in the store
    // `withLoadEntities` feature is used, the compilation error will be thrown
    state: { entities: T[]; callState: CallState };
  }>();

  return loadEntitiesFeatureFactory(
    withMethods(({ $update }, entityService = inject(entityServiceClass)) => ({
      // We can use `rxEffect` to create side effects by using RxJS APIs.
      loadEntitiesByFilter: rxEffect<Filter>(
        pipe(
          debounceTime(300),
          tap(() => $update(setLoading())),
          switchMap((filter) => entityService.getByFilter(filter)),
          tap((entities) => $update({ entities }, setLoaded()))
        )
      ),
      // However, that's not mandatory. We can also perform async effects without RxJS:
      async loadAllEntities() {
        $update(setLoading());
        const entities = await entityService.getAll();
        $update({ entities }, setLoaded());
      },
    }))
  );
}
