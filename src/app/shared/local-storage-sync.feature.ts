import { effect } from '@angular/core';
import { signalStoreFeatureFactory, withHooks } from '@ngrx/signals';

export function withLocalStorageSync(storageItemKey: string) {
  const localStorageSync = signalStoreFeatureFactory();

  return localStorageSync(
    withHooks({
      onInit({ $state, $update }) {
        const stateStr = localStorage.getItem(storageItemKey);
        if (stateStr) {
          const state = JSON.parse(stateStr);
          $update(state);
        }

        effect(() => {
          const stateStr = JSON.stringify($state());
          localStorage.setItem(storageItemKey, stateStr);
        });
      },
    })
  );
}
