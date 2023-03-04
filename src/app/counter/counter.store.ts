import { computed, effect } from '@angular/core';
import {
  signalStore,
  withComputed,
  withHooks,
  withState,
  withUpdaters,
} from '@ngrx/signals';

export const [provideCounterStore, injectCounterStore] = signalStore(
  withState({ count: 0 }),
  withComputed(({ count }) => ({
    doubleCount: computed(() => count() * 2),
  })),
  withUpdaters(({ update, count }) => ({
    increment: () => update((state) => ({ count: state.count + 1 })),
    // or we can use signal getter as follows:
    decrement: () => update({ count: count() - 1 }),
  })),
  withHooks({
    onInit: ({ count }) => effect(() => console.log('count changed', count())),
    onDestroy: () => console.log('counter store destroyed'),
  })
);
