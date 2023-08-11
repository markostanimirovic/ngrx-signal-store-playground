import { testEffects } from '../tests/test-effects';
import { enableProdMode } from '@angular/core';
import { signalState } from './signal-state';

// needs a separate file because we can't revert the prod mode.
it(
  'should not freeze state with immutability check in prod mode',
  testEffects(() => {
    enableProdMode();
    const state = signalState(
      {
        person: { firstName: 'John', lastName: 'Smith' },
      },
      { immutabilityCheck: true }
    );

    expect(() =>
      state.$update((state) => {
        (state as any).person.firstName = 'Johannes';
        return state;
      })
    ).not.toThrow();
  })
);
