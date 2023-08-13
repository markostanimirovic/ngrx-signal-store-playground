import { signalStore, withMethods, withState } from '@ngrx/signals';
import { withStorageSync } from '../shared/storage-sync.feature';
import { withImmerUpdate } from '../shared/immer-update.feature';

export const TodosStore = signalStore(
  { providedIn: 'root' },
  withState<{ todos: string[] }>({ todos: [] }),
  withStorageSync('todos-state'),
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
