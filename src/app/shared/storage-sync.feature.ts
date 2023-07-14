import { effect } from '@angular/core';
import { signalStoreFeature, withHooks } from '@ngrx/signals';

export function withStorageSync(
  key: string,
  storageFactory: () => Storage = () => localStorage
) {
  return signalStoreFeature(
    withHooks({
      onInit({ $state, $update }) {
        const storage = storageFactory();

        const stateStr = storage.getItem(key);
        if (stateStr) {
          const state = JSON.parse(stateStr);
          $update(state);
        }

        effect(() => {
          const stateStr = JSON.stringify($state());
          storage.setItem(key, stateStr);
        });
      },
    })
  );
}
