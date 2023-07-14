import {
  EmptyFeatureInput,
  EmptyFeatureResult,
  getEmptyFeatureResult,
  SignalStoreFeature,
} from '../signal-store-feature';

export function withState<State extends Record<string, unknown>>(
  state: State
): SignalStoreFeature<EmptyFeatureInput, EmptyFeatureResult & { state: State }>;
export function withState<State extends Record<string, unknown>>(
  stateFactory: () => State
): SignalStoreFeature<EmptyFeatureInput, EmptyFeatureResult & { state: State }>;
export function withState<State extends Record<string, unknown>>(
  stateOrFactory: State | (() => State)
): SignalStoreFeature<
  EmptyFeatureInput,
  EmptyFeatureResult & { state: State }
> {
  return () => {
    const state =
      typeof stateOrFactory === 'function' ? stateOrFactory() : stateOrFactory;

    return { ...getEmptyFeatureResult(), state };
  };
}
