import { Signal } from '@angular/core';
import {
  EmptyFeatureInput,
  EmptyFeatureResult,
  getEmptyFeatureResult,
  SignalStoreFeature,
  SignalStoreSlices,
} from '../signal-store-feature';

export function withSignals<
  InputState extends Record<string, unknown>,
  InputSignals extends Record<string, Signal<any>>,
  Signals extends Record<string, Signal<any>>
>(
  signalsFactory: (
    props: SignalStoreSlices<InputState> & InputSignals
  ) => Signals
): SignalStoreFeature<
  EmptyFeatureInput & { state: InputState; signals: InputSignals },
  EmptyFeatureResult & { signals: Signals }
> {
  return (store) => ({
    ...getEmptyFeatureResult(),
    signals: signalsFactory({
      ...store.slices,
      ...store.signals,
    }),
  });
}
