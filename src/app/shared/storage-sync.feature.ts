import { effect, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import {
  EmptyFeatureResult,
  Prettify,
  SignalStoreFeature,
  signalStoreFeature,
  withHooks,
} from '@ngrx/signals';

type NoInfer<T> = T extends infer V ? V : never;

export function withStorageSync<State extends Record<string, unknown>>(
  key: string
): SignalStoreFeature<
  EmptyFeatureResult & { state: State },
  EmptyFeatureResult
>;
export function withStorageSync<
  State extends Record<string, unknown>,
  Slices extends Partial<State>
>(config: {
  key: string;
  select: (state: Prettify<State>) => Slices;
  parse?: (stateStr: string) => NoInfer<Slices>;
  stringify?: (state: Prettify<Slices>) => string;
  storage?: () => Storage;
}): SignalStoreFeature<
  EmptyFeatureResult & { state: State },
  EmptyFeatureResult
>;
export function withStorageSync<State extends Record<string, unknown>>(config: {
  key: string;
  parse?: (stateStr: string) => NoInfer<State>;
  stringify?: (state: Prettify<State>) => string;
  storage?: () => Storage;
}): SignalStoreFeature<
  EmptyFeatureResult & { state: State },
  EmptyFeatureResult
>;
export function withStorageSync<State extends Record<string, unknown>>(
  configOrKey:
    | {
        key: string;
        select?: (state: State) => Partial<State>;
        parse?: (stateStr: string) => State;
        stringify?: (state: State) => string;
        storage?: () => Storage;
      }
    | string
): SignalStoreFeature<
  EmptyFeatureResult & { state: State },
  EmptyFeatureResult
> {
  if (isPlatformServer(PLATFORM_ID)) {
    return (store) => store;
  }

  const {
    key,
    select = (state: State) => state,
    storage: storageFactory = () => localStorage,
    stringify = JSON.stringify,
    parse = JSON.parse,
  } = typeof configOrKey === 'string' ? { key: configOrKey } : configOrKey;

  return signalStoreFeature(
    withHooks({
      onInit(store) {
        const storage = storageFactory();

        const stateStr = storage.getItem(key);
        if (stateStr) {
          const state = parse(stateStr);
          store.$update(select(state));
        }

        effect(() => {
          let state = select(store.$state() as State);
          storage.setItem(key, stringify(state));
        });
      },
    })
  );
}
