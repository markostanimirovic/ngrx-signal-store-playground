import { Signal } from '@angular/core';
import { SignalStoreInternals } from '../signal-store-internals';
import {
  EmptyFeatureResult,
  getEmptyFeatureResult,
  SignalStoreFeature,
  SignalStoreSlices,
} from '../signal-store-feature';

type HooksFactory<
  InputState extends Record<string, unknown>,
  InputSignals extends Record<string, Signal<any>>,
  InputMethods extends Record<string, (...args: any[]) => any>
> = (
  props: SignalStoreInternals<InputState> &
    SignalStoreSlices<InputState> &
    InputSignals &
    InputMethods
) => void;

export function withHooks<
  InputState extends Record<string, unknown>,
  InputSignals extends Record<string, Signal<any>>,
  InputMethods extends Record<string, (...args: any[]) => any>
>(hooks: {
  onInit?: HooksFactory<InputState, InputSignals, InputMethods>;
  onDestroy?: HooksFactory<InputState, InputSignals, InputMethods>;
}): SignalStoreFeature<
  {
    state: InputState;
    signals: InputSignals;
    methods: InputMethods;
  },
  EmptyFeatureResult & {
    hooks: { onInit?: () => void; onDestroy?: () => void };
  }
> {
  return (store) => {
    const createHook = (name: keyof typeof hooks) =>
      hooks[name]
        ? () => {
            hooks[name]?.({
              ...store.internals,
              ...store.slices,
              ...store.signals,
              ...store.methods,
            });
          }
        : undefined;

    return {
      ...getEmptyFeatureResult(),
      hooks: {
        onInit: createHook('onInit'),
        onDestroy: createHook('onDestroy'),
      },
    };
  };
}
