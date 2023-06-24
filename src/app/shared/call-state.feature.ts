import {
  selectSignal,
  SignalStateUpdater,
  signalStoreFeatureFactory,
  withSignals,
  withState,
} from '@ngrx/signals';

export type CallState = 'init' | 'loading' | 'loaded' | 'error';

export function withCallState() {
  const callStateFeature = signalStoreFeatureFactory();

  return callStateFeature(
    withState({ callState: 'init' as CallState }),
    withSignals(({ callState }) => ({
      isLoading: selectSignal(() => callState() === 'loading'),
      isLoaded: selectSignal(() => callState() === 'loaded'),
      isError: selectSignal(() => callState() === 'error'),
    }))
  );
}

export function setLoading(): SignalStateUpdater<{ callState: CallState }> {
  return { callState: 'loading' };
}

export function setLoaded(): SignalStateUpdater<{ callState: CallState }> {
  return { callState: 'loaded' };
}

export function setError(): SignalStateUpdater<{ callState: CallState }> {
  return { callState: 'error' };
}
