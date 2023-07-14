import {
  assertInInjectionContext,
  inject,
  Injector,
  isSignal,
  Signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  isObservable,
  Observable,
  of,
  OperatorFunction,
  Subject,
  takeUntil,
  Unsubscribable,
} from 'rxjs';
import { injectDestroy } from './inject-destroy';

type RxMethodInput<Input> = Input | Observable<Input> | Signal<Input>;
type RxMethod<Input> = ((input: RxMethodInput<Input>) => Unsubscribable) &
  Unsubscribable;

export function rxMethod<Input>(
  generator: OperatorFunction<Input, unknown>
): RxMethod<Input> {
  assertInInjectionContext(rxMethod);

  const injector = inject(Injector);
  const destroy$ = injectDestroy();
  const source$ = new Subject<Input>();

  const sourceSubscription = generator(source$)
    .pipe(takeUntil(destroy$))
    .subscribe();

  const rxMethodFn = (input: RxMethodInput<Input>) => {
    let input$: Observable<Input>;

    if (isSignal(input)) {
      input$ = toObservable(input, { injector });
    } else if (isObservable(input)) {
      input$ = input.pipe(takeUntil(destroy$));
    } else {
      input$ = of(input);
    }

    const instanceSubscription = input$.subscribe((value) =>
      source$.next(value)
    );
    sourceSubscription.add(instanceSubscription);

    return instanceSubscription;
  };
  rxMethodFn.unsubscribe =
    sourceSubscription.unsubscribe.bind(sourceSubscription);

  return rxMethodFn;
}
