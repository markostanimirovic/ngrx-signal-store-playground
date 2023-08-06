import { signalStoreFeature, type, withState } from '@ngrx/signals';

function withFoo() {
  return withState({ foo: 'foo' });
}

function withBar() {
  return signalStoreFeature(
    { state: type<{ foo: string }>() },
    withState({ bar: 'bar' })
  );
}

export function withBaz() {
  return signalStoreFeature(withFoo(), withState({ count: 0 }), withBar());
}

export function withBaz2() {
  return signalStoreFeature(
    // withFoo() is replaced with withState({ foo: 'foo' })
    withState({ foo: 'foo' }),
    withState({ count: 0 }),
    withBar()
  );
}
