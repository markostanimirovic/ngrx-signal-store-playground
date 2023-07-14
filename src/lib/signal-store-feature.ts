import { Signal } from '@angular/core';
import { SignalStoreInternals } from './signal-store-internals';
import { DeepSignal } from './deep-signal';

export type SignalStoreSlices<State extends Record<string, unknown>> = {
  [Key in keyof State]: DeepSignal<State[Key]>;
};

export type StoreFeatureInput = {
  state: Record<string, unknown>;
  signals: Record<string, Signal<any>>;
  methods: Record<string, (...args: any[]) => any>;
};

export type StoreFeatureResult = StoreFeatureInput & {
  hooks: {
    onInit?: () => void;
    onDestroy?: () => void;
  };
};

export type EmptyFeatureInput = { state: {}; signals: {}; methods: {} };

export type EmptyFeatureResult = EmptyFeatureInput & { hooks: {} };

export type InnerSignalStore<
  State extends Record<string, unknown>,
  Signals extends Record<string, Signal<any>>,
  Methods extends Record<string, (...args: any[]) => any>
> = {
  internals: SignalStoreInternals<State>;
  slices: SignalStoreSlices<State>;
  signals: Signals;
  methods: Methods;
};

export type SignalStoreFeature<
  FeatureInput extends StoreFeatureInput = StoreFeatureInput,
  FeatureResult extends StoreFeatureResult = StoreFeatureResult
> = (
  store: InnerSignalStore<
    FeatureInput['state'],
    FeatureInput['signals'],
    FeatureInput['methods']
  >
) => FeatureResult;

export type NestedStoreFeatures = Array<
  SignalStoreFeature | NestedStoreFeatures
>;

export function signalStoreFeature<F1 extends StoreFeatureResult>(
  f1: SignalStoreFeature<EmptyFeatureInput, F1>
): SignalStoreFeature<EmptyFeatureInput, F1>;
export function signalStoreFeature<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): SignalStoreFeature<EmptyFeatureInput, F1 & F2>;
export function signalStoreFeature<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>
): SignalStoreFeature<EmptyFeatureInput, F1 & F2 & F3>;
export function signalStoreFeature<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>,
  f4: SignalStoreFeature<{} & F1 & F2 & F3, F4>
): SignalStoreFeature<EmptyFeatureInput, F1 & F2 & F3 & F4>;
export function signalStoreFeature<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult,
  F5 extends StoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>,
  f4: SignalStoreFeature<{} & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<{} & F1 & F2 & F3 & F4, F5>
): SignalStoreFeature<EmptyFeatureInput, F1 & F2 & F3 & F4 & F5>;
export function signalStoreFeature<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult,
  F5 extends StoreFeatureResult,
  F6 extends StoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>,
  f4: SignalStoreFeature<{} & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<{} & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5, F6>
): SignalStoreFeature<EmptyFeatureInput, F1 & F2 & F3 & F4 & F5 & F6>;

export function signalStoreFeature<
  FeatureInput extends Partial<StoreFeatureInput>,
  F1 extends StoreFeatureResult
>(
  featureInput: FeatureInput,
  f1: SignalStoreFeature<EmptyFeatureInput & FeatureInput, F1>
): SignalStoreFeature<EmptyFeatureInput & FeatureInput, F1>;
export function signalStoreFeature<
  FeatureInput extends Partial<StoreFeatureInput>,
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult
>(
  featureInput: FeatureInput,
  f1: SignalStoreFeature<EmptyFeatureInput & FeatureInput, F1>,
  f2: SignalStoreFeature<FeatureInput & F1, F2>
): SignalStoreFeature<EmptyFeatureInput & FeatureInput, F1 & F2>;
export function signalStoreFeature<
  FeatureInput extends Partial<StoreFeatureInput>,
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult
>(
  featureInput: FeatureInput,
  f1: SignalStoreFeature<EmptyFeatureInput & FeatureInput, F1>,
  f2: SignalStoreFeature<FeatureInput & F1, F2>,
  f3: SignalStoreFeature<FeatureInput & F1 & F2, F3>
): SignalStoreFeature<EmptyFeatureInput & FeatureInput, F1 & F2 & F3>;
export function signalStoreFeature<
  FeatureInput extends Partial<StoreFeatureInput>,
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult
>(
  featureInput: FeatureInput,
  f1: SignalStoreFeature<EmptyFeatureInput & FeatureInput, F1>,
  f2: SignalStoreFeature<FeatureInput & F1, F2>,
  f3: SignalStoreFeature<FeatureInput & F1 & F2, F3>,
  f4: SignalStoreFeature<FeatureInput & F1 & F2 & F3, F4>
): SignalStoreFeature<EmptyFeatureInput & FeatureInput, F1 & F2 & F3 & F4>;
export function signalStoreFeature<
  FeatureInput extends Partial<StoreFeatureInput>,
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult,
  F5 extends StoreFeatureResult
>(
  featureInput: FeatureInput,
  f1: SignalStoreFeature<EmptyFeatureInput & FeatureInput, F1>,
  f2: SignalStoreFeature<FeatureInput & F1, F2>,
  f3: SignalStoreFeature<FeatureInput & F1 & F2, F3>,
  f4: SignalStoreFeature<FeatureInput & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<FeatureInput & F1 & F2 & F3 & F4, F5>
): SignalStoreFeature<EmptyFeatureInput & FeatureInput, F1 & F2 & F3 & F4 & F5>;
export function signalStoreFeature<
  FeatureInput extends Partial<StoreFeatureInput>,
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult,
  F5 extends StoreFeatureResult,
  F6 extends StoreFeatureResult
>(
  featureInput: FeatureInput,
  f1: SignalStoreFeature<EmptyFeatureInput & FeatureInput, F1>,
  f2: SignalStoreFeature<FeatureInput & F1, F2>,
  f3: SignalStoreFeature<FeatureInput & F1 & F2, F3>,
  f4: SignalStoreFeature<FeatureInput & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<FeatureInput & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<FeatureInput & F1 & F2 & F3 & F4 & F5, F6>
): SignalStoreFeature<
  EmptyFeatureInput & FeatureInput,
  F1 & F2 & F3 & F4 & F5 & F6
>;

export function signalStoreFeature(
  featureOrInput: SignalStoreFeature | Partial<StoreFeatureInput>,
  ...features: SignalStoreFeature[]
): unknown {
  // featureInput is only used for typing, so ignore its value
  // return features itself, they will be merged within the signalStore
  return typeof featureOrInput === 'function'
    ? [featureOrInput, ...features]
    : features;
}

export function type<T = {}>(): T {
  return undefined as T;
}

export function getEmptyFeatureResult(): EmptyFeatureResult {
  return {
    state: {},
    signals: {},
    hooks: {},
    methods: {},
  };
}

export function toFlatFeatures(
  nestedFeatures: NestedStoreFeatures
): SignalStoreFeature[] {
  const flatFeatures: SignalStoreFeature[] = [];

  for (const feature of nestedFeatures) {
    if (Array.isArray(feature)) {
      flatFeatures.push(...toFlatFeatures(feature));
    } else {
      flatFeatures.push(feature);
    }
  }

  return flatFeatures;
}
