import { Signal } from '@angular/core';
import { SignalStateUpdate } from './signal-state-update';

export type SignalStoreState<State extends Record<string, unknown>> = {
  $state: Signal<State>;
};

export type SignalStoreInternals<State extends Record<string, unknown>> =
  SignalStoreState<State> & SignalStateUpdate<State>;
