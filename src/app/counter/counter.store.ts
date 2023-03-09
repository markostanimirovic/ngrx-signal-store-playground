import { computed, effect } from '@angular/core';
import {
  createSignalStore,
  withComputed,
  withEffects,
  withHooks,
  withState,
  withUpdaters,
} from '@ngrx/signals';

export const CounterStore = createSignalStore(
  withState({ count: 0 }),
  withComputed(({ count }) => ({
    doubleCount: computed(() => count() * 2),
  })),
  withUpdaters(({ update, count }) => ({
    increment: () => update((state) => ({ count: state.count + 1 })),
    // or we can use signal getter as follows:
    decrement: () => update({ count: count() - 1 }),
  })),
  withEffects(({ count }) => ({
    logCountOnChange() {
      effect(() => console.log('count changed', count()));
    },
  })),
  withHooks({
    onInit: ({ logCountOnChange }) => logCountOnChange(),
    onDestroy: ({ count }) => console.log('count value on destroy', count()),
  })
);
