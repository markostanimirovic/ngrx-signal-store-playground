import { Injectable } from '@angular/core';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { withStorageSync } from '../shared/storage-sync.feature';
import { withImmerUpdate } from '../shared/immer-update.feature';

@Injectable({ providedIn: 'root' })
export class TodosStore extends signalStore(
  withState<{ todos: string[] }>({ todos: [] }),
  withStorageSync('todosState'),
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

// functional:
export const TodosStore2 = signalStore(
  { providedIn: 'root' },
  withState<{ todos: string[] }>({ todos: [] }),
  withStorageSync('todosState'),
  withImmerUpdate(),
  withMethods((store) => ({
    addTodo(todo: string): void {
      store.$update((state) => {
        state.todos.push(todo);
      });
    },
    removeTodo(index: number): void {
      store.$update((state) => {
        state.todos.splice(index, 1);
      });
    },
  }))
);
