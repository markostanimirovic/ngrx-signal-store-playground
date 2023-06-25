import { Injectable } from '@angular/core';
import { signalStore, withState } from '@ngrx/signals';
import { withLocalStorageSync } from '../shared/local-storage-sync.feature';
import { withImmerUpdate } from '../shared/immer-update.feature';

@Injectable({ providedIn: 'root' })
export class TodosStore extends signalStore(
  withState<{ todos: string[] }>({ todos: [] }),
  withLocalStorageSync('todos'),
  withImmerUpdate()
) {
  addTodo(todo: string): void {
    this.$update((state) => {
      state.todos.push(todo);
    });
  }

  removeTodo(index: number): void {
    this.$update((state) => {
      state.todos.splice(index, 1);
    });
  }
}
