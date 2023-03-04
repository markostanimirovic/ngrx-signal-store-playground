import { Component, OnInit } from '@angular/core';
import { interval, tap } from 'rxjs';
import { rxEffect } from '@ngrx/signals';
import { injectCounterStore, provideCounterStore } from './counter.store';

@Component({
  standalone: true,
  template: `
    <h1>Counter</h1>
    <p>Count: {{ counterStore.count() }}</p>
    <p>Double Count: {{ counterStore.doubleCount() }}</p>
    <button (click)="counterStore.increment()">Increment</button>
    <button (click)="counterStore.decrement()">Decrement</button>
  `,
  providers: [provideCounterStore()],
})
export class CounterComponent implements OnInit {
  readonly counterStore = injectCounterStore();

  // rxEffect can be also used independently
  private readonly logDoubleCount = rxEffect(
    tap(() => console.log('double count:', this.counterStore.doubleCount()))
  );

  ngOnInit(): void {
    this.logDoubleCount(interval(2000));
  }
}
