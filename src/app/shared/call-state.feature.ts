import {
  selectSignal,
  signalStoreFeatureFactory,
  withSignals,
  withState,
} from '@ngrx/signals';

export type CallState = 'init' | 'loading' | 'loaded' | 'error';

export function withCallState() {
  const callStateFeatureFactory = signalStoreFeatureFactory();

  return callStateFeatureFactory(
    withState({ callState: 'init' as CallState }),
    withSignals(({ callState }) => ({
      isLoading: selectSignal(() => callState() === 'loading'),
      isLoaded: selectSignal(() => callState() === 'loaded'),
      isError: selectSignal(() => callState() === 'error'),
    }))
  );
}

export function setLoading(): { callState: CallState } {
  return { callState: 'loading' };
}

export function setLoaded(): { callState: CallState } {
  return { callState: 'loaded' };
}

export function setError(): { callState: CallState } {
  return { callState: 'error' };
}
