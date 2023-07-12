import { Signal } from '@angular/core';
import { SignalStateUpdate } from './signal-state-update';

export type SignalStoreState<State> = {
  $state: Signal<State>;
};

export type SignalStoreInternals<State> =
  SignalStoreState<State> & SignalStateUpdate<State>;
