import { Signal } from '@angular/core';
import {
  SignalStoreFeatureInput,
  SignalStoreSlices,
} from '../signal-store-feature';
import { SignalStateUpdate } from '../signal-state-update';

export function withHooks<
  State extends Record<string, unknown>,
  Signals extends Record<string, Signal<any>>,
  Methods extends Record<string, (...args: any[]) => any>
>(hooks: {
  onInit?: (
    input: SignalStateUpdate<State> &
      SignalStoreSlices<State> &
      Signals &
      Methods
  ) => void;
  onDestroy?: (
    input: SignalStateUpdate<State> &
      SignalStoreSlices<State> &
      Signals &
      Methods
  ) => void;
}): (
  featureInput: SignalStoreFeatureInput<{
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
              $update: featureInput.$update,
              ...featureInput.slices,
              ...featureInput.signals,
              ...featureInput.methods,
            });
          }
        : undefined,
      onDestroy: hooks.onDestroy
        ? () => {
            hooks.onDestroy?.({
              $update: featureInput.$update,
              ...featureInput.slices,
              ...featureInput.signals,
              ...featureInput.methods,
            });
          }
        : undefined,
    },
  });
}
