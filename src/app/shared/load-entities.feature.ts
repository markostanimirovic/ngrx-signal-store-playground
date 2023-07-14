import { inject, Type } from '@angular/core';
import { debounceTime, Observable, pipe, switchMap, tap } from 'rxjs';
import { rxMethod, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { Filter } from './filter.feature';
import { CallState, setLoaded, setLoading } from './call-state.feature';

export interface EntityService<T> {
  getAll(): Promise<T[]>;
  getByFilter(filter: Filter): Observable<T[]>;
}

export function withLoadEntities<T>(
  entityServiceClass: Type<EntityService<T>>
) {
  return signalStoreFeature(
    { state: type<{ entities: T[]; callState: CallState }>() },
    withMethods((store, entityService = inject(entityServiceClass)) => ({
      // We can use `rxMethod` to create side effects by using RxJS APIs.
      loadByFilter: rxMethod<Filter>(
        pipe(
          debounceTime(300),
          tap(() => store.$update(setLoading())),
          switchMap((filter) => entityService.getByFilter(filter)),
          tap((entities) => store.$update({ entities }, setLoaded()))
        )
      ),
      // However, that's not mandatory. We can also perform async effects without RxJS:
      async loadAll() {
        store.$update(setLoading());
        const entities = await entityService.getAll();
        store.$update({ entities }, setLoaded());
      },
    }))
  );
}
