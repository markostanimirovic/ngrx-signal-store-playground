import {
  DestroyRef,
  inject,
  Injectable,
  Signal,
  signal,
  Type,
} from '@angular/core';
import {
  SignalStoreFeature,
  SignalStoreFeatureFactory,
  SignalStoreFeatureInput,
} from './signal-store-feature';
import {
  SignalStateUpdate,
  signalStateUpdateFactory,
} from './signal-state-update';
import { toDeepSignal } from './deep-signal';
import { selectSignal } from './select-signal';
import { defaultEqualityFn } from './helpers';
import { ToIntersection } from './models';

type SignalStoreConfig = { providedIn: 'root' };

type SignalStore<Features extends SignalStoreFeature[]> = SignalStateUpdate<
  ToIntersection<{ [Key in keyof Features]: Features[Key]['state'] }>
> &
  ToIntersection<{
    [Key in keyof Features]: SignalStoreFeatureResult<Features[Key]>;
  }>;

type SignalStoreFeatureResult<
  Feature extends SignalStoreFeature,
  FeatureInput extends SignalStoreFeatureInput<Feature> = SignalStoreFeatureInput<Feature>
> = FeatureInput['slices'] & FeatureInput['signals'] & FeatureInput['methods'];

export function signalStore<F1 extends SignalStoreFeature>(
  f1: SignalStoreFeatureFactory<{}, F1>
): Type<SignalStore<[F1]>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature
>(
  f1: SignalStoreFeatureFactory<{}, F1>,
  f2: SignalStoreFeatureFactory<F1, F2>
): Type<SignalStore<[F1, F2]>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature
>(
  f1: SignalStoreFeatureFactory<{}, F1>,
  f2: SignalStoreFeatureFactory<F1, F2>,
  f3: SignalStoreFeatureFactory<F1 & F2, F3>
): Type<SignalStore<[F1, F2, F3]>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature
>(
  f1: SignalStoreFeatureFactory<{}, F1>,
  f2: SignalStoreFeatureFactory<F1, F2>,
  f3: SignalStoreFeatureFactory<F1 & F2, F3>,
  f4: SignalStoreFeatureFactory<F1 & F2 & F3, F4>
): Type<SignalStore<[F1, F2, F3, F4]>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature,
  F5 extends SignalStoreFeature
>(
  f1: SignalStoreFeatureFactory<{}, F1>,
  f2: SignalStoreFeatureFactory<F1, F2>,
  f3: SignalStoreFeatureFactory<F1 & F2, F3>,
  f4: SignalStoreFeatureFactory<F1 & F2 & F3, F4>,
  f5: SignalStoreFeatureFactory<F1 & F2 & F3 & F4, F5>
): Type<SignalStore<[F1, F2, F3, F4, F5]>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature,
  F5 extends SignalStoreFeature,
  F6 extends SignalStoreFeature
>(
  f1: SignalStoreFeatureFactory<{}, F1>,
  f2: SignalStoreFeatureFactory<F1, F2>,
  f3: SignalStoreFeatureFactory<F1 & F2, F3>,
  f4: SignalStoreFeatureFactory<F1 & F2 & F3, F4>,
  f5: SignalStoreFeatureFactory<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeatureFactory<F1 & F2 & F3 & F4 & F5, F6>
): Type<SignalStore<[F1, F2, F3, F4, F5, F6]>>;

export function signalStore<F1 extends SignalStoreFeature>(
  config: SignalStoreConfig,
  f1: SignalStoreFeatureFactory<{}, F1>
): Type<SignalStore<[F1]>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeatureFactory<{}, F1>,
  f2: SignalStoreFeatureFactory<F1, F2>
): Type<SignalStore<[F1, F2]>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeatureFactory<{}, F1>,
  f2: SignalStoreFeatureFactory<F1, F2>,
  f3: SignalStoreFeatureFactory<F1 & F2, F3>
): Type<SignalStore<[F1, F2, F3]>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeatureFactory<{}, F1>,
  f2: SignalStoreFeatureFactory<F1, F2>,
  f3: SignalStoreFeatureFactory<F1 & F2, F3>,
  f4: SignalStoreFeatureFactory<F1 & F2 & F3, F4>
): Type<SignalStore<[F1, F2, F3, F4]>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature,
  F5 extends SignalStoreFeature
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeatureFactory<{}, F1>,
  f2: SignalStoreFeatureFactory<F1, F2>,
  f3: SignalStoreFeatureFactory<F1 & F2, F3>,
  f4: SignalStoreFeatureFactory<F1 & F2 & F3, F4>,
  f5: SignalStoreFeatureFactory<F1 & F2 & F3 & F4, F5>
): Type<SignalStore<[F1, F2, F3, F4, F5]>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature,
  F5 extends SignalStoreFeature,
  F6 extends SignalStoreFeature
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeatureFactory<{}, F1>,
  f2: SignalStoreFeatureFactory<F1, F2>,
  f3: SignalStoreFeatureFactory<F1 & F2, F3>,
  f4: SignalStoreFeatureFactory<F1 & F2 & F3, F4>,
  f5: SignalStoreFeatureFactory<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeatureFactory<F1 & F2 & F3 & F4 & F5, F6>
): Type<SignalStore<[F1, F2, F3, F4, F5, F6]>>;

export function signalStore(
  ...args:
    | [
        SignalStoreConfig,
        ...Array<SignalStoreFeatureFactory | SignalStoreFeatureFactory[]>
      ]
    | Array<SignalStoreFeatureFactory | SignalStoreFeatureFactory[]>
) {
  const [config, ...featureFactories] =
    'providedIn' in args[0]
      ? [
          args[0],
          ...(args.slice(1) as Array<
            SignalStoreFeatureFactory | SignalStoreFeatureFactory[]
          >),
        ]
      : [
          {},
          ...(args as Array<
            SignalStoreFeatureFactory | SignalStoreFeatureFactory[]
          >),
        ];

  @Injectable({ providedIn: config.providedIn || null })
  class SignalStore {
    constructor() {
      const props = signalStoreFactory(featureFactories);
      for (const key in props) {
        (this as any)[key] = props[key];
      }
    }
  }

  return SignalStore;
}

function signalStoreFactory(
  featureFactories: Array<
    SignalStoreFeatureFactory[] | SignalStoreFeatureFactory
  >
): Record<string, unknown> {
  const stateSignal = signal<Record<string, unknown>>(
    {},
    { equal: defaultEqualityFn }
  );
  const $update = signalStateUpdateFactory(stateSignal);
  const featureInput: SignalStoreFeatureInput<{
    state: Record<string, unknown>;
    signals: Record<string, Signal<any>>;
    methods: Record<string, (...args: any[]) => any>;
  }> = {
    $update,
    slices: {},
    signals: {},
    methods: {},
  };
  const onInits: Array<() => void> = [];
  const onDestroys: Array<() => void> = [];

  for (const featureFactory of featureFactories.flat()) {
    const feature = featureFactory(featureInput);

    if (feature.state && Object.keys(feature.state).length > 0) {
      stateSignal.update((state) => ({ ...state, ...feature.state }));
    }

    for (const key in feature.state) {
      const slice = selectSignal(() => stateSignal()[key]);
      featureInput.slices[key] = toDeepSignal(slice);
    }

    for (const key in feature.signals) {
      featureInput.signals[key] = feature.signals[key];
    }

    for (const key in feature.methods) {
      featureInput.methods[key] = feature.methods[key];
    }

    if (feature.hooks) {
      feature.hooks.onInit && onInits.push(feature.hooks.onInit);
      feature.hooks.onDestroy && onDestroys.push(feature.hooks.onDestroy);
    }
  }

  onInits.forEach((onInit) => onInit());

  if (onDestroys.length > 0) {
    inject(DestroyRef).onDestroy(() =>
      onDestroys.forEach((onDestroy) => onDestroy())
    );
  }

  return {
    $update,
    ...featureInput.slices,
    ...featureInput.signals,
    ...featureInput.methods,
  };
}
