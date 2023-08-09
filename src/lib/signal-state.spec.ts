import { effect } from '@angular/core';
import { testEffects } from '../tests/test-effects';
import { signalState } from './signal-state';
import { selectSignal } from './select-signal';

describe('Signal State', () => {
  const initialState = {
    user: {
      firstName: 'John',
      lastName: 'Smith',
    },
    foo: 'bar',
    numbers: [1, 2, 3],
  };

  const setup = () => signalState(initialState);

  it('should support nested signals', () => {
    const state = setup();

    expect(state()).toBe(initialState);
    expect(state.user()).toBe(initialState.user);
    expect(state.user.firstName()).toBe(initialState.user.firstName);
  });

  it('should allow updates', () => {
    const state = setup();
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
    const state = setup();
    state.$update((state) => ({
      ...state,
      foo: 'bar',
      numbers: [3, 2, 1],
    }));
    expect(state.user()).toBe(initialState.user);
    expect(state.foo()).toBe(initialState.foo);
    expect(state.numbers()).not.toBe(initialState.numbers);
  });

  describe('equal checks', () => {
    it(
      'should not fire unchanged signals on update',
      testEffects((detectChanges) => {
        const state = setup();

        const numberEffect = jest.fn(() => state.numbers());
        effect(numberEffect);

        const userEffect = jest.fn(() => state.user());
        effect(userEffect);

        expect(numberEffect).toHaveBeenCalledTimes(0);
        expect(userEffect).toHaveBeenCalledTimes(0);

        // run effects for the first time
        detectChanges();
        expect(numberEffect).toHaveBeenCalledTimes(1);
        expect(userEffect).toHaveBeenCalledTimes(1);

        // update state with effect run
        state.$update((state) => ({ ...state, numbers: [4, 5, 6] }));
        detectChanges();
        expect(numberEffect).toHaveBeenCalledTimes(2);
        expect(userEffect).toHaveBeenCalledTimes(1);
      })
    );

    it(
      'should not fire for unchanged derived signals',
      testEffects((detectChanges) => {
        const state = setup();

        const numberCount = selectSignal(
          state,
          (state) => state.numbers.length
        );

        const numberEffect = jest.fn(() => numberCount());
        effect(numberEffect);

        // run effects for the first time
        detectChanges();
        expect(numberEffect).toHaveBeenCalledTimes(1);

        // update user
        state.$update({
          user: { firstName: 'Susanne', lastName: 'Taylor' },
        });
        detectChanges();
        expect(numberEffect).toHaveBeenCalledTimes(1);

        // update numbers
        state.$update({ numbers: [1] });
        detectChanges();
        expect(numberEffect).toHaveBeenCalledTimes(2);
        expect(numberCount()).toBe(1);
      })
    );
  });

  describe('immutability', () => {
    it(
      'should throw on mutable changes',
      testEffects((detectChanges) => {
        let numberCounter = 0;
        const state = setup();
        const effectFn = jest.fn(() => state.numbers());
        effect(effectFn);
        detectChanges();
        expect(effectFn).toHaveBeenCalledTimes(1);

        expect(() =>
          state.$update((state) => {
            const { numbers } = state;
            numbers.push(4);
            return { ...state };
          })
        ).toThrow();
      })
    );

    it(
      'should throw on a single mutable change',
      testEffects((detectChanges) => {
        let numberCounter = 0;
        const state = setup();
        const effectFn = jest.fn(() => state.numbers());
        effect(effectFn);
        detectChanges();
        expect(effectFn).toHaveBeenCalledTimes(1);

        expect(() =>
          state.$update({ foo: 'foobar' }, (state) => {
            const { numbers } = state;
            numbers.push(4);
            return { ...state };
          })
        ).toThrow();
      })
    );
  });
});
