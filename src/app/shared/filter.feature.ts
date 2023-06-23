import {
  signalStoreFeatureFactory,
  withMethods,
  withState,
} from '@ngrx/signals';

export type Filter = { query: string; pageSize: number };
const initialFilter: Filter = { query: '', pageSize: 5 };

export function withFilter() {
  const filterFeatureFactory = signalStoreFeatureFactory();

  return filterFeatureFactory(
    withState({ filter: initialFilter }),
    withMethods(({ $update }) => ({
      patchFilter(partialFilter: Partial<Filter>) {
        $update((state) => ({
          ...state,
          filter: { ...state.filter, ...partialFilter },
        }));
      },
    }))
  );
}
