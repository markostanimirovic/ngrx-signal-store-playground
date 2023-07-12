import { Signal } from '@angular/core';
import {
  SignalStoreSlices,
  InternalSignalStore,
} from '../signal-store-feature-factory';

export function withSignals<
  State extends Record<string, unknown>,
  PreviousSignals extends Record<string, Signal<any>>,
  Signals extends Record<string, Signal<any>>
>(
  signalsFactory: (input: SignalStoreSlices<State> & PreviousSignals) => Signals
): (
  store: InternalSignalStore<{
    state: State;
    signals: PreviousSignals;
  }>
) => { signals: Signals } {
  return (store) => ({
    signals: signalsFactory({
      ...store.slices,
      ...store.signals,
    }),
  });
}
