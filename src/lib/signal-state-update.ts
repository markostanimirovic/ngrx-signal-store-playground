import { WritableSignal } from '@angular/core';

export type SignalStateUpdater<State extends Record<string, unknown>> =
  | Partial<State>
  | ((state: State) => Partial<State>);

export type SignalStateUpdate<State extends Record<string, unknown>> = {
  $update: (...updaters: SignalStateUpdater<State>[]) => void;
};

export function signalStateUpdateFactory<State extends Record<string, unknown>>(
  stateSignal: WritableSignal<State>
): SignalStateUpdate<State>['$update'] {
  return (...updaters) =>
    stateSignal.update((state) =>
      updaters.reduce(
        (currentState: State, updater) => ({
          ...currentState,
          ...(typeof updater === 'function' ? updater(currentState) : updater),
        }),
        state
      )
    );
}
