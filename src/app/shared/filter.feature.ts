import { effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SignalStateUpdater,
  signalStoreFeature,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

export type Filter = { query: string; pageSize: number };
const initialFilter: Filter = { query: '', pageSize: 5 };

export function withFilter() {
  return signalStoreFeature(
    withState({ filter: initialFilter }),
    withMethods(({ $update }) => ({
      updateFilter(partialFilter: Partial<Filter>): void {
        $update(patchFilter(partialFilter));
      },
    })),
    withHooks({
      onInit(store, route = inject(ActivatedRoute), router = inject(Router)) {
        const { queryParams } = route.snapshot;
        const query = queryParams['query'] ?? '';
        const pageSize = Number(queryParams['pageSize'] ?? 5);

        store.updateFilter({ query, pageSize });

        effect(() => {
          router.navigate([], {
            relativeTo: route,
            queryParams: store.filter(),
            queryParamsHandling: 'merge',
          });
        });
      },
    })
  );
}

function patchFilter(partialFilter: Partial<Filter>): SignalStateUpdater<{
  filter: Filter;
}> {
  return (state) => ({ filter: { ...state.filter, ...partialFilter } });
}
