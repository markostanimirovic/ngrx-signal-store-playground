import { Signal } from '@angular/core';
import { SignalStoreInternals } from './signal-store-internals';
import { DeepSignal } from './deep-signal';

export type SignalStoreFeature = {
  state?: Record<string, unknown>;
  signals?: Record<string, Signal<any>>;
  methods?: Record<string, (...args: any[]) => any>;
  hooks?: {
    onInit?: () => void;
    onDestroy?: () => void;
  };
};

export type SignalStoreSlices<State> = {
  [Key in keyof State]: DeepSignal<State[Key]>;
};

export type InternalSignalStore<
  Feature extends SignalStoreFeature,
  State = 'state' extends keyof Feature ? Feature['state'] : {},
  Signals = 'signals' extends keyof Feature ? Feature['signals'] : {},
  Methods = 'methods' extends keyof Feature ? Feature['methods'] : {}
> = {
  internals: SignalStoreInternals<State>;
  slices: SignalStoreSlices<State>;
  signals: Signals;
  methods: Methods;
};

export type SignalStoreFeatureFactory<
  PreviousFeature extends SignalStoreFeature = SignalStoreFeature,
  Feature extends SignalStoreFeature = SignalStoreFeature
> = (
  store: InternalSignalStore<
    EmptySignalStoreFeature & PreviousFeature
  >
) => Feature;

type EmptySignalStoreFeature = {
  state: {};
  signals: {};
  methods: {};
  hooks: {};
};

export function signalStoreFeatureFactory<
  InputFeature extends SignalStoreFeature = {}
>() {
  function signalStoreFeature<F1 extends SignalStoreFeature>(
    f1: SignalStoreFeatureFactory<InputFeature, F1>
  ): (store: InternalSignalStore<InputFeature>) => F1;
  function signalStoreFeature<
    F1 extends SignalStoreFeature,
    F2 extends SignalStoreFeature
  >(
    f1: SignalStoreFeatureFactory<InputFeature, F1>,
    f2: SignalStoreFeatureFactory<InputFeature & F1, F2>
  ): (store: InternalSignalStore<InputFeature>) => F1 & F2;
  function signalStoreFeature<
    F1 extends SignalStoreFeature,
    F2 extends SignalStoreFeature,
    F3 extends SignalStoreFeature
  >(
    f1: SignalStoreFeatureFactory<InputFeature, F1>,
    f2: SignalStoreFeatureFactory<InputFeature & F1, F2>,
    f3: SignalStoreFeatureFactory<InputFeature & F1 & F2, F3>
  ): (store: InternalSignalStore<InputFeature>) => F1 & F2 & F3;
  function signalStoreFeature<
    F1 extends SignalStoreFeature,
    F2 extends SignalStoreFeature,
    F3 extends SignalStoreFeature,
    F4 extends SignalStoreFeature
  >(
    f1: SignalStoreFeatureFactory<InputFeature, F1>,
    f2: SignalStoreFeatureFactory<InputFeature & F1, F2>,
    f3: SignalStoreFeatureFactory<InputFeature & F1 & F2, F3>,
    f4: SignalStoreFeatureFactory<InputFeature & F1 & F2 & F3, F4>
  ): (store: InternalSignalStore<InputFeature>) => F1 & F2 & F3 & F4;
  function signalStoreFeature<
    F1 extends SignalStoreFeature,
    F2 extends SignalStoreFeature,
    F3 extends SignalStoreFeature,
    F4 extends SignalStoreFeature,
    F5 extends SignalStoreFeature
  >(
    f1: SignalStoreFeatureFactory<InputFeature, F1>,
    f2: SignalStoreFeatureFactory<InputFeature & F1, F2>,
    f3: SignalStoreFeatureFactory<InputFeature & F1 & F2, F3>,
    f4: SignalStoreFeatureFactory<InputFeature & F1 & F2 & F3, F4>,
    f5: SignalStoreFeatureFactory<InputFeature & F1 & F2 & F3 & F4, F5>
  ): (
    store: InternalSignalStore<InputFeature>
  ) => F1 & F2 & F3 & F4 & F5;
  function signalStoreFeature<
    F1 extends SignalStoreFeature,
    F2 extends SignalStoreFeature,
    F3 extends SignalStoreFeature,
    F4 extends SignalStoreFeature,
    F5 extends SignalStoreFeature,
    F6 extends SignalStoreFeature
  >(
    f1: SignalStoreFeatureFactory<InputFeature, F1>,
    f2: SignalStoreFeatureFactory<InputFeature & F1, F2>,
    f3: SignalStoreFeatureFactory<InputFeature & F1 & F2, F3>,
    f4: SignalStoreFeatureFactory<InputFeature & F1 & F2 & F3, F4>,
    f5: SignalStoreFeatureFactory<InputFeature & F1 & F2 & F3 & F4, F5>,
    f6: SignalStoreFeatureFactory<InputFeature & F1 & F2 & F3 & F4 & F5, F6>
  ): (
    store: InternalSignalStore<InputFeature>
  ) => F1 & F2 & F3 & F4 & F5 & F6;
  function signalStoreFeature(
    ...featureFactories: SignalStoreFeatureFactory[]
  ): SignalStoreFeatureFactory | SignalStoreFeatureFactory[] {
    return featureFactories;
  }

  return signalStoreFeature;
}
