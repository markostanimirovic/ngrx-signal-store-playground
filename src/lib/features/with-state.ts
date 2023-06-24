export function withState<State extends Record<string, unknown>>(
  state: State
): () => { state: State };
export function withState<State extends Record<string, unknown>>(
  stateFactory: () => State
): () => { state: State };
export function withState<State extends Record<string, unknown>>(
  stateOrFactory: State | (() => State)
): () => { state: State } {
  return () => ({
    state:
      typeof stateOrFactory === 'function' ? stateOrFactory() : stateOrFactory,
  });
}
