import {
  signalStoreFeatureFactory,
  withHooks,
  withMethods,
} from '@ngrx/signals';

export function withLocalStorageSync(storageItemKey: string) {
  const localStorageSync = signalStoreFeatureFactory();

  return localStorageSync(
    withMethods(
      ({ $update }) =>
        ({
          $update(...updaters: Parameters<typeof $update>): void {
            $update(...updaters, (state) => {
              const stateStr = JSON.stringify(state);
              localStorage.setItem(storageItemKey, stateStr);

              return state;
            });
          },
        } as {})
    ),
    withHooks({
      onInit({ $update }) {
        const stateStr = localStorage.getItem(storageItemKey);
        if (stateStr) {
          const state = JSON.parse(stateStr);
          $update(state);
        }
      },
    })
  );
}
