import { Signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { SignalStoreUpdate, StaticState } from '../models';

export function withEffects<
  State extends Record<string, Signal<any>>,
  Computed extends Record<string, Signal<any>>,
  Updaters extends Record<string, (...args: any[]) => void>,
  PreviousEffects extends Record<string, (input: any) => Subscription>,
  Effects extends Record<string, (input: any) => Subscription>
>(
  effectsFactory: (
    input: State &
      Computed &
      Updaters &
      PreviousEffects &
      SignalStoreUpdate<StaticState<State>>
  ) => Effects
): (
  feature: {
    state: State;
    computed: Computed;
    updaters: Updaters;
    effects: PreviousEffects;
  } & SignalStoreUpdate<StaticState<State>>
) => {
  state: {};
  computed: {};
  updaters: {};
  effects: Effects;
  hooks: { onInit: () => void; onDestroy: () => void };
} {
  return (feature) => ({
    state: {},
    computed: {},
    updaters: {},
    effects: effectsFactory({
      ...feature.state,
      ...feature.computed,
      ...feature.updaters,
      ...feature.effects,
      update: feature.update,
    } as State & Computed & Updaters & PreviousEffects & SignalStoreUpdate<StaticState<State>>),
    hooks: {
      onInit() {},
      onDestroy() {},
    },
  });
}
