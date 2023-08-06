import {
  selectSignal,
  signalStore,
  signalStoreFeature,
  type,
  withHooks,
  withMethods,
  withSignals,
  withState,
} from '@ngrx/signals';
import { Signal, signal } from '@angular/core';

function withX() {
  return signalStoreFeature(withState({ x: 1 }));
}

type Y = { a: string; b: number };
const initialY: Y = { a: '', b: 5 };

function withY<_>() {
  return signalStoreFeature(
    {
      state: type<{ q: string }>(),
      signals: type<{ sig: Signal<boolean> }>(),
    },
    withState({ y: initialY }),
    withSignals(() => ({ sigY: signal('sigY') })),
    withHooks({
      onInit(store) {
        // store.$update({ q: '', y: { a: 'a', b: 2 } });
        // store.$update({ wrong: '', y: { a: 'a', b: 2 } });
        // store.$update({ y: 'wrong' });
      },
    })
  );
}

export const Store = signalStore(
  withSignals(() => ({ sig: signal(1) })),
  withState({ q: 'q', q2: 'q2' }),
  // withState({ q: 1 }),
  withSignals(() => ({ sig: signal(false) })),
  withX(),
  withY(),
  withSignals(() => ({ q: signal(10) })),
  withMethods((store) => ({
    f() {
      store.$update({ x: 1, y: { a: '', b: 0 }, q2: 'q2new' });
      // store.$update({ q: 'wrong' });
      const sig = store.sig.asReadonly();
      const q = store.q.asReadonly();
    },
  }))
);

export const feature = signalStoreFeature(
  { signals: type<{ sig: Signal<boolean> }>() },
  // withSignals(() => ({ sig: signal(1) })),
  withState({ q: 'q' }),
  // withSignals(() => ({ sig: signal(false) })),
  withX(),
  withY(),
  withMethods((store) => ({
    f() {
      store.$update({ x: 1, q: 'marko', y: { a: '', b: 0 } });
    },
  }))
);
