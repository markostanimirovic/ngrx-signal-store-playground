import { Signal } from '@angular/core';
import {
  InternalSignalStore,
  SignalStoreSlices,
} from '../signal-store-feature-factory';
import { SignalStoreInternals } from '../signal-store-internals';

export function withHooks<
  State extends Record<string, unknown>,
  Signals extends Record<string, Signal<any>>,
  Methods extends Record<string, (...args: any[]) => any>
>(hooks: {
  onInit?: (
    input: SignalStoreInternals<State> &
      SignalStoreSlices<State> &
      Signals &
      Methods
  ) => void;
  onDestroy?: (input: SignalStoreSlices<State> & Signals & Methods) => void;
}): (
  featureInput: InternalSignalStore<{
    state: State;
    signals: Signals;
    methods: Methods;
  }>
) => {
  hooks: { onInit?: () => void; onDestroy?: () => void };
} {
  return (featureInput) => ({
    hooks: {
      onInit: hooks.onInit
        ? () => {
            hooks.onInit?.({
              ...featureInput.internals,
              ...featureInput.slices,
              ...featureInput.signals,
              ...featureInput.methods,
            });
          }
        : undefined,
      onDestroy: hooks.onDestroy
        ? () => {
            hooks.onDestroy?.({
              ...featureInput.internals,
              ...featureInput.slices,
              ...featureInput.signals,
              ...featureInput.methods,
            });
          }
        : undefined,
    },
  });
}
