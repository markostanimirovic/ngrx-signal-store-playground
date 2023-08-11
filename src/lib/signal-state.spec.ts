import { effect, isDevMode } from '@angular/core';
import * as angularCore from '@angular/core';
import { testEffects } from '../tests/test-effects';
import { signalState } from './signal-state';
import { selectSignal } from './select-signal';

describe('Signal State', () => {
  interface TestState {
    user: { firstName: string; lastName: string };
    foo: string;
    numbers: number[];
  }

  const getInitialState = () => ({
    user: {
      firstName: 'John',
      lastName: 'Smith',
    },
    foo: 'bar',
    numbers: [1, 2, 3],
  });

  describe('Basics', () => {
    it('should support nested signals', () => {
      const initialState = getInitialState();
      const state = signalState(initialState);

      expect(state()).toBe(initialState);
      expect(state.user()).toBe(initialState.user);
      expect(state.user.firstName()).toBe('John');
    });

    it('should allow updates', () => {
      const initialState = getInitialState();
      const state = signalState(initialState);
      state.$update((state) => ({
        ...state,
        user: { firstName: 'Johannes', lastName: 'Schmidt' },
      }));
      expect(state()).toEqual({
        ...initialState,
        user: { firstName: 'Johannes', lastName: 'Schmidt' },
      });
    });

    it('should update immutably', () => {
      const initialState = getInitialState();
      const state = signalState(initialState);
      state.$update((state) => ({
        ...state,
        foo: 'bar',
        numbers: [3, 2, 1],
      }));
      expect(state.user()).toBe(initialState.user);
      expect(state.foo()).toBe(initialState.foo);
      expect(state.numbers()).not.toBe(initialState.numbers);
    });
  });

  describe('equal checks', () => {
    const setup = () => signalState(getInitialState());

    it(
      'should not fire unchanged signals on update',
      testEffects((runEffects) => {
        const state = setup();

        const numberEffect = jest.fn(() => state.numbers());
        effect(numberEffect);

        const userEffect = jest.fn(() => state.user());
        effect(userEffect);

        expect(numberEffect).toHaveBeenCalledTimes(0);
        expect(userEffect).toHaveBeenCalledTimes(0);

        // run effects for the first time
        runEffects();
        expect(numberEffect).toHaveBeenCalledTimes(1);
        expect(userEffect).toHaveBeenCalledTimes(1);

        // update state with effect run
        state.$update((state) => ({ ...state, numbers: [4, 5, 6] }));
        runEffects();
        expect(numberEffect).toHaveBeenCalledTimes(2);
        expect(userEffect).toHaveBeenCalledTimes(1);
      })
    );

    it(
      'should not fire for unchanged derived signals',
      testEffects((runEffects) => {
        const state = setup();

        const numberCount = selectSignal(
          state,
          (state) => state.numbers.length
        );

        const numberEffect = jest.fn(() => numberCount());
        effect(numberEffect);

        // run effects for the first time
        runEffects();
        expect(numberEffect).toHaveBeenCalledTimes(1);

        // update user
        state.$update({
          user: { firstName: 'Susanne', lastName: 'Taylor' },
        });
        runEffects();
        expect(numberEffect).toHaveBeenCalledTimes(1);

        // update numbers
        state.$update({ numbers: [1] });
        runEffects();
        expect(numberEffect).toHaveBeenCalledTimes(2);
        expect(numberCount()).toBe(1);
      })
    );
  });

  describe('immutability', () => {
    const setup = (immutabilityCheck = false) =>
      signalState(getInitialState(), { immutabilityCheck });

    it(
      'should run nested-based effects on mutable updates',
      testEffects((runEffects) => {
        let numberCounter = 0;
        const state = setup();
        const effectFn = jest.fn(() => state.user());
        effect(effectFn);
        runEffects();

        // mutable update
        state.$update((state) => {
          (state as any).user = { firstName: 'John', lastName: 'Smith' };
          return state;
        });

        runEffects();
        expect(effectFn).toHaveBeenCalledTimes(2);
      })
    );

    it(
      'should run selectSignal-based effects on mutable updates',
      testEffects((runEffects) => {
        let numberCounter = 0;
        const state = setup();
        const userSignal = selectSignal(state, (state) => state.user);
        const effectFn = jest.fn(() => userSignal());
        effect(effectFn);
        runEffects();

        // mutable update
        state.$update((state) => {
          (state as any).user = { firstName: 'John', lastName: 'Smith' };
          return state;
        });
        runEffects();
        expect(effectFn).toHaveBeenCalledTimes(2);
      })
    );

    it(
      'should not freeze on mutable updates',
      testEffects(() => {
        const state = setup();

        expect(() =>
          state.$update((state) => {
            (state as any).foo = 'bar';
            return { ...state };
          })
        ).not.toThrow();
      })
    );

    it(
      'should freeze on mutable updates with immutability check',
      testEffects(() => {
        const state = setup(true);

        expect(() =>
          state.$update((state) => {
            (state as any).foo = 'bar';
            return state;
          })
        ).toThrow();
      })
    );

    it(
      'should freeze on consecutive mutable updates with immutability check',
      testEffects(() => {
        const state = setup(true);

        state.$update((state) => ({ ...state, foo: 'foobar' }));

        expect(() =>
          state.$update((state) => {
            (state as any).foo = 'barfoo';
            return state;
          })
        ).toThrow();
      })
    );
  });
});
