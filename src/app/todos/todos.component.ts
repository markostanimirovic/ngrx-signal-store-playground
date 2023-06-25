import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { TodosStore } from './todos.store';

@Component({
  standalone: true,
  imports: [NgFor],
  template: `
    <h1>Todos</h1>

    <input type="text" #todoInput (keydown.enter)="onAddTodo(todoInput)" />
    <button (click)="onAddTodo(todoInput)">Add</button>

    <ul>
      <li *ngFor="let todo of todosStore.todos(); let i = index">
        {{ todo }}
        <button (click)="todosStore.removeTodo(i)">Remove</button>
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent {
  readonly todosStore = inject(TodosStore);

  onAddTodo(todoInput: HTMLInputElement): void {
    this.todosStore.addTodo(todoInput.value);
    todoInput.value = '';
  }
}
