import { DestroyRef, inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

export function injectDestroy(): Observable<void> {
  const destroy$ = new ReplaySubject<void>(1);

  try {
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => {
      destroy$.next();
      destroy$.complete();
    });
  } catch {
    // ignore error when `injectDestroy` is called out of injection context
  }

  return destroy$;
}
