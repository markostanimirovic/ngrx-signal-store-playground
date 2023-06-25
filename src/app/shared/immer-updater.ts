import { SignalStateUpdater } from '@ngrx/signals';
import { produce } from 'immer';

type ImmerUpdater<State> = (state: State) => void;

export function immerUpdater<State extends Record<string, unknown>>(
  updater: ImmerUpdater<State>
): SignalStateUpdater<State> {
  return (state) => produce(state, (draft) => updater(draft as State));
}
