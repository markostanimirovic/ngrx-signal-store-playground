import { Signal } from '@angular/core';
import { SignalStoreInternals } from '../signal-store-internals';
import {
  EmptyFeatureResult,
  getEmptyFeatureResult,
  SignalStoreFeature,
  SignalStoreSlices,
} from '../signal-store-feature';

export function withMethods<
  InputState extends Record<string, unknown>,
  InputSignals extends Record<string, Signal<any>>,
  InputMethods extends Record<string, (...args: any[]) => any>,
  Methods extends Record<string, (...args: any[]) => any>
>(
  methodsFactory: (
    props: SignalStoreInternals<InputState> &
      SignalStoreSlices<InputState> &
      InputSignals &
      InputMethods
  ) => Methods
): SignalStoreFeature<
  {
    state: InputState;
    signals: InputSignals;
    methods: InputMethods;
  },
  EmptyFeatureResult & { methods: Methods }
> {
  return (store) => ({
    ...getEmptyFeatureResult(),
    methods: methodsFactory({
      ...store.internals,
      ...store.slices,
      ...store.signals,
      ...store.methods,
    }),
  });
}
