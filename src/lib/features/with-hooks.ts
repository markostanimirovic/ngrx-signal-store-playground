import { Signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { SignalStoreUpdate, StaticState } from '../models';

export function withHooks<
  State extends Record<string, Signal<any>>,
  Computed extends Record<string, Signal<any>>,
  Updaters extends Record<string, (...args: any[]) => void>,
  Effects extends Record<string, (input: any) => Subscription>
>(hooks: {
  onInit?: (
    store: State &
      Computed &
      Updaters &
      Effects &
      SignalStoreUpdate<StaticState<State>>
  ) => void;
  onDestroy?: (
    store: State &
      Computed &
      Updaters &
      Effects &
      SignalStoreUpdate<StaticState<State>>
  ) => void;
}): (
  feature: {
    state: State;
    computed: Computed;
    updaters: Updaters;
    effects: Effects;
  } & SignalStoreUpdate<StaticState<State>>
) => {
  state: {};
  computed: {};
  updaters: {};
  effects: {};
  hooks: { onInit: () => void; onDestroy: () => void };
} {
  return (feature) => ({
    state: {},
    computed: {},
    updaters: {},
    effects: {},
    hooks: {
      onInit() {
        hooks.onInit?.({
          update: feature.update,
          ...feature.state,
          ...feature.computed,
          ...feature.updaters,
          ...feature.effects,
        });
      },
      onDestroy() {
        hooks.onDestroy?.({
          update: feature.update,
          ...feature.state,
          ...feature.computed,
          ...feature.updaters,
          ...feature.effects,
        });
      },
    },
  });
}
