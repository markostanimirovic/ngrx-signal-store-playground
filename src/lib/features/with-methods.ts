import { Signal } from '@angular/core';
import {
  InternalSignalStore,
  SignalStoreSlices,
} from '../signal-store-feature-factory';
import { SignalStoreInternals } from '../signal-store-internals';

export function withMethods<
  State extends Record<string, unknown>,
  Signals extends Record<string, Signal<any>>,
  PreviousMethods extends Record<string, (...args: any[]) => any>,
  Methods extends Record<string, (...args: any[]) => any>
>(
  methodsFactory: (
    input: SignalStoreInternals<State> &
      SignalStoreSlices<State> &
      Signals &
      PreviousMethods
  ) => Methods
): (
  store: InternalSignalStore<{
    state: State;
    signals: Signals;
    methods: PreviousMethods;
  }>
) => { methods: Methods } {
  return (store) => ({
    methods: methodsFactory({
      ...store.internals,
      ...store.slices,
      ...store.signals,
      ...store.methods,
    }),
  });
}
