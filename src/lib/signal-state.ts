import { isDevMode, signal, WritableSignal } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';
import { defaultEqualityFn } from './select-signal';
import { DeepReadonly } from './deep-readonly';
import { deepFreeze } from './deep-freeze';

export type SignalState<State extends Record<string, unknown>> =
  DeepSignal<State> & SignalStateUpdate<State>;

export type UpdatedState<T> = T extends ReadonlyArray<infer A>
  ? Array<A> | ReadonlyArray<A>
  : T extends Record<string, unknown>
  ? { [Key in keyof T]: UpdatedState<T[Key]> }
  : T;

export type SignalStateUpdater<State extends Record<string, unknown>> =
  | Partial<State>
  | ((state: DeepReadonly<State>) => UpdatedState<State>);

export type SignalStateUpdate<State extends Record<string, unknown>> = {
  $update: (...updaters: SignalStateUpdater<State>[]) => void;
};

export function signalState<State extends Record<string, unknown>>(
  initialState: State,
  options: { immutabilityCheck: boolean } = { immutabilityCheck: false }
): SignalState<State> {
  const freezeState = isDevMode() && options.immutabilityCheck;
  if (freezeState) {
    deepFreeze(initialState);
  }
  const stateSignal = signal(initialState, { equal: defaultEqualityFn });
  const deepSignal = toDeepSignal(stateSignal.asReadonly());
  (deepSignal as SignalState<State>).$update = signalStateUpdateFactory(
    stateSignal,
    freezeState
  );

  return deepSignal as SignalState<State>;
}

export function signalStateUpdateFactory<State extends Record<string, unknown>>(
  stateSignal: WritableSignal<State>,
  freezeState: boolean
): SignalStateUpdate<State>['$update'] {
  return (...updaters) => {
    stateSignal.update((state) => {
      const updatedState = updaters.reduce(
        (currentState: State, updater) => ({
          ...currentState,
          ...(typeof updater === 'function'
            ? updater(currentState as DeepReadonly<State>)
            : updater),
        }),
        state
      );

      if (freezeState) {
        deepFreeze(updatedState);
      }

      return updatedState;
    });
  };
}
