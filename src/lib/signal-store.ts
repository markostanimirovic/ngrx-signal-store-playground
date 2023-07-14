import {
  DestroyRef,
  inject,
  Injectable,
  Signal,
  signal,
  Type,
} from '@angular/core';
import {
  EmptyFeatureInput,
  InnerSignalStore,
  NestedStoreFeatures,
  SignalStoreFeature,
  SignalStoreSlices,
  StoreFeatureResult,
  toFlatFeatures,
} from './signal-store-feature';
import { SignalStoreInternals } from './signal-store-internals';
import { signalStateUpdateFactory } from './signal-state-update';
import { toDeepSignal } from './deep-signal';
import { selectSignal } from './select-signal';
import { defaultEqualityFn } from './helpers';
import { ToIntersection } from './models';

type SignalStoreConfig = { providedIn: 'root' };

type SignalStore<
  FeatureResults extends StoreFeatureResult[],
  State extends Record<string, unknown>
> = SignalStoreInternals<State> &
  ToIntersection<{
    [Key in keyof FeatureResults]: SignalStoreSlices<
      FeatureResults[Key]['state']
    > &
      FeatureResults[Key]['signals'] &
      FeatureResults[Key]['methods'];
  }>;

export function signalStore<F1 extends StoreFeatureResult>(
  f1: SignalStoreFeature<EmptyFeatureInput, F1>
): Type<SignalStore<[F1], F1['state']>>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): Type<SignalStore<[F1, F2], F1['state'] & F2['state']>>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>
): Type<SignalStore<[F1, F2, F3], F1['state'] & F2['state'] & F3['state']>>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>,
  f4: SignalStoreFeature<{} & F1 & F2 & F3, F4>
): Type<
  SignalStore<
    [F1, F2, F3, F4],
    F1['state'] & F2['state'] & F3['state'] & F4['state']
  >
>;
export function signalStore<
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
): Type<
  SignalStore<
    [F1, F2, F3, F4, F5],
    F1['state'] & F2['state'] & F3['state'] & F4['state'] & F5['state']
  >
>;
export function signalStore<
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
): Type<
  SignalStore<
    [F1, F2, F3, F4, F5, F6],
    F1['state'] &
      F2['state'] &
      F3['state'] &
      F4['state'] &
      F5['state'] &
      F6['state']
  >
>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult,
  F5 extends StoreFeatureResult,
  F6 extends StoreFeatureResult,
  F7 extends StoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>,
  f4: SignalStoreFeature<{} & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<{} & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5 & F6, F7>
): Type<
  SignalStore<
    [F1, F2, F3, F4, F5, F6, F7],
    F1['state'] &
      F2['state'] &
      F3['state'] &
      F4['state'] &
      F5['state'] &
      F6['state'] &
      F7['state']
  >
>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult,
  F5 extends StoreFeatureResult,
  F6 extends StoreFeatureResult,
  F7 extends StoreFeatureResult,
  F8 extends StoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>,
  f4: SignalStoreFeature<{} & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<{} & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>
): Type<
  SignalStore<
    [F1, F2, F3, F4, F5, F6, F7, F8],
    F1['state'] &
      F2['state'] &
      F3['state'] &
      F4['state'] &
      F5['state'] &
      F6['state'] &
      F7['state'] &
      F8['state']
  >
>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult,
  F5 extends StoreFeatureResult,
  F6 extends StoreFeatureResult,
  F7 extends StoreFeatureResult,
  F8 extends StoreFeatureResult,
  F9 extends StoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>,
  f4: SignalStoreFeature<{} & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<{} & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>
): Type<
  SignalStore<
    [F1, F2, F3, F4, F5, F6, F7, F8, F9],
    F1['state'] &
      F2['state'] &
      F3['state'] &
      F4['state'] &
      F5['state'] &
      F6['state'] &
      F7['state'] &
      F8['state'] &
      F9['state']
  >
>;

export function signalStore<F1 extends StoreFeatureResult>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureInput, F1>
): Type<SignalStore<[F1], F1['state']>>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): Type<SignalStore<[F1, F2], F1['state'] & F2['state']>>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>
): Type<SignalStore<[F1, F2, F3], F1['state'] & F2['state'] & F3['state']>>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>,
  f4: SignalStoreFeature<{} & F1 & F2 & F3, F4>
): Type<
  SignalStore<
    [F1, F2, F3, F4],
    F1['state'] & F2['state'] & F3['state'] & F4['state']
  >
>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult,
  F5 extends StoreFeatureResult
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>,
  f4: SignalStoreFeature<{} & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<{} & F1 & F2 & F3 & F4, F5>
): Type<
  SignalStore<
    [F1, F2, F3, F4, F5],
    F1['state'] & F2['state'] & F3['state'] & F4['state'] & F5['state']
  >
>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult,
  F5 extends StoreFeatureResult,
  F6 extends StoreFeatureResult
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>,
  f4: SignalStoreFeature<{} & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<{} & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5, F6>
): Type<
  SignalStore<
    [F1, F2, F3, F4, F5, F6],
    F1['state'] &
      F2['state'] &
      F3['state'] &
      F4['state'] &
      F5['state'] &
      F6['state']
  >
>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult,
  F5 extends StoreFeatureResult,
  F6 extends StoreFeatureResult,
  F7 extends StoreFeatureResult
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>,
  f4: SignalStoreFeature<{} & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<{} & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5 & F6, F7>
): Type<
  SignalStore<
    [F1, F2, F3, F4, F5, F6, F7],
    F1['state'] &
      F2['state'] &
      F3['state'] &
      F4['state'] &
      F5['state'] &
      F6['state'] &
      F7['state']
  >
>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult,
  F5 extends StoreFeatureResult,
  F6 extends StoreFeatureResult,
  F7 extends StoreFeatureResult,
  F8 extends StoreFeatureResult
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>,
  f4: SignalStoreFeature<{} & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<{} & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>
): Type<
  SignalStore<
    [F1, F2, F3, F4, F5, F6, F7, F8],
    F1['state'] &
      F2['state'] &
      F3['state'] &
      F4['state'] &
      F5['state'] &
      F6['state'] &
      F7['state'] &
      F8['state']
  >
>;
export function signalStore<
  F1 extends StoreFeatureResult,
  F2 extends StoreFeatureResult,
  F3 extends StoreFeatureResult,
  F4 extends StoreFeatureResult,
  F5 extends StoreFeatureResult,
  F6 extends StoreFeatureResult,
  F7 extends StoreFeatureResult,
  F8 extends StoreFeatureResult,
  F9 extends StoreFeatureResult
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureInput, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<{} & F1 & F2, F3>,
  f4: SignalStoreFeature<{} & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<{} & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<{} & F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>
): Type<
  SignalStore<
    [F1, F2, F3, F4, F5, F6, F7, F8, F9],
    F1['state'] &
      F2['state'] &
      F3['state'] &
      F4['state'] &
      F5['state'] &
      F6['state'] &
      F7['state'] &
      F8['state'] &
      F9['state']
  >
>;

export function signalStore(
  ...args: [SignalStoreConfig, ...NestedStoreFeatures] | NestedStoreFeatures
): Type<SignalStore<any, Record<string, unknown>>> {
  const signalStoreArgs = [...args];

  const config: Partial<SignalStoreConfig> =
    'providedIn' in signalStoreArgs[0]
      ? (signalStoreArgs.shift() as SignalStoreConfig)
      : {};
  const nestedFeatures = signalStoreArgs as NestedStoreFeatures;
  const features = toFlatFeatures(nestedFeatures);

  @Injectable({ providedIn: config.providedIn || null })
  class SignalStore {
    constructor() {
      const signalStore = signalStoreFactory(features);
      for (const key in signalStore) {
        (this as any)[key] = signalStore[key];
      }
    }
  }

  return SignalStore;
}

function signalStoreFactory(
  features: SignalStoreFeature[]
): SignalStore<any, Record<string, unknown>> {
  const stateSignal = signal<Record<string, unknown>>(
    {},
    { equal: defaultEqualityFn }
  );
  const store: InnerSignalStore<
    Record<string, unknown>,
    Record<string, Signal<any>>,
    Record<string, (...args: any[]) => any>
  > = {
    internals: {
      $state: stateSignal.asReadonly(),
      $update: signalStateUpdateFactory(stateSignal),
    },
    slices: {},
    signals: {},
    methods: {},
  };
  const onInits: Array<() => void> = [];
  const onDestroys: Array<() => void> = [];

  for (const feature of features) {
    const featureResult = feature(store);

    if (Object.keys(featureResult.state).length > 0) {
      stateSignal.update((state) => ({ ...state, ...featureResult.state }));
    }

    for (const key in featureResult.state) {
      const slice = selectSignal(() => stateSignal()[key]);
      store.slices[key] = toDeepSignal(slice);
    }

    for (const key in featureResult.signals) {
      store.signals[key] = featureResult.signals[key];
    }

    for (const key in featureResult.methods) {
      store.methods[key] = featureResult.methods[key];
    }

    if (featureResult.hooks) {
      featureResult.hooks.onInit && onInits.push(featureResult.hooks.onInit);
      featureResult.hooks.onDestroy &&
        onDestroys.push(featureResult.hooks.onDestroy);
    }
  }

  onInits.forEach((onInit) => onInit());

  if (onDestroys.length > 0) {
    inject(DestroyRef).onDestroy(() =>
      onDestroys.forEach((onDestroy) => onDestroy())
    );
  }

  return {
    ...store.internals,
    ...store.slices,
    ...store.signals,
    ...store.methods,
  };
}
