import {
  SignalStateUpdater,
  signalStoreFeature,
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
    }))
  );
}

function patchFilter(partialFilter: Partial<Filter>): SignalStateUpdater<{
  filter: Filter;
}> {
  return (state) => ({ filter: { ...state.filter, ...partialFilter } });
}
