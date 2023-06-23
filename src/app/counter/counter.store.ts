import { effect, Injectable } from '@angular/core';
import {
  selectSignal,
  signalStore,
  withHooks,
  withMethods,
  withSignals,
  withState,
} from '@ngrx/signals';

const initialState = { count: 0 };

@Injectable()
export class CounterStore extends signalStore(withState(initialState)) {
  readonly doubleCount = selectSignal(() => this.count() * 2);

  readonly #logOnCountChange = effect(() => {
    console.log('count changed', this.count());
  });

  increment(): void {
    this.$update({ count: this.count() + 1 });
  }

  decrement(): void {
    this.$update({ count: this.count() - 1 });
  }
}

// CounterStore can be also defined in the functional way:
export const CounterStore2 = signalStore(
  withState(initialState),
  withSignals(({ count }) => ({
    doubleCount: selectSignal(() => count() * 2),
  })),
  withMethods(({ count, $update }) => ({
    increment: () => $update({ count: count() + 1 }),
    decrement: () => $update({ count: count() - 1 }),
  })),
  withHooks({
    onInit({ count }) {
      effect(() => console.log('count changed', count()));
    },
  })
);
