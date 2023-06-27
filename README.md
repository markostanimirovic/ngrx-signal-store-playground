## NgRx Signals

Main goals:

- Providing unidirectional and predictable data flow with signals.
- Keeping a declarative approach instead of "imperative reactivity" that is possible with signals.
- Separating side effects from the state to avoid unpredictable data flows.

Key principles:

- Simple and intuitive
- Declarative
- Composable / modular
- Scalable
- Performant and tree-shakeable
- Strongly typed

### [GitHub Repo](https://github.com/markostanimirovic/ngrx-signal-store-playground)

### [StackBlitz Playground](https://stackblitz.com/github/markostanimirovic/ngrx-signal-store-playground?preset=node)

### Contents

- [`signalState`](#signalstate)
  - [`$update` Method](#update-method)
- [`selectSignal`](#selectsignal)
- [`signalStore`](#signalstore)
  - [DI Config](#di-config)
  - [Defining Stores as Classes](#defining-stores-as-classes)
  - [Custom Store Features](#custom-store-features)
- [`rxEffect`](#rxeffect)
- [Entity Management](#entity-management)

---

### `signalState`

The `signalState` function creates nested signals for the provided initial state.

```ts
import { signalState } from '@ngrx/signals';

const state = signalState({
  user: {
    firstName: 'John',
    lastName: 'Smith',
  },
  foo: 'bar',
  numbers: [1, 2, 3],
});

console.log(state()); // { user: { firstName: 'John', lastName: 'Smith' }, foo: 'bar' }
console.log(state.user()); // { firstName: 'John', lastName: 'Smith' }
console.log(state.user.firstName()); // 'John'
```

All nested signals are created lazily as requested. Besides that, the `signalState` will cache created signals, so they'll be created only the first time when requested.

```ts
const lastName1 = state.user.lastName; // Signal<string>
const lastName2 = state.user.lastName; // Signal<string>

console.log(lastName1 === lastName2); // true
```

#### `$update` Method

The `signalState` instance provides the `$update` method for updating the state. It accepts a sequence of partial state objects or updater functions that partially update the state.

```ts
// passing a partial state object
state.$update({ foo: 'baz', numbers: [10, 20, 30] });

// passing an updater function
state.$update((state) => ({
  user: { ...state.user, firstName: 'Peter' },
  foo: 'bar',
}));

// passing a sequence of partial state objects and/or updater functions
state.$update(
  (state) => ({
    numbers: [...state.numbers, 4],
    user: { ...state.user, lastName: 'Ryan' }
  }),
  { foo: 'bar' },
);
```

This provides the ability to define reusable updater functions that can be used for any `signalState` instance that has a specific state slice.

```ts
import { signalState, SignalStateUpdater } from '@ngrx/signals';

function setFirstName(firstName: string): SignalStateUpdater<{ user: User }> {
  return (state) => ({ user: { ...state.user, firstName } });
}

function addNumber(num: number): SignalStateUpdater<{ numbers: number[] }> {
  return (state) => ({ numbers: [...state.numbers, num] });
}

// usage:
const state1 = signalState({
  user: { firstName: 'John', lastName: 'Ryan' },
  numbers: [10, 20, 30],
  label: 'ngrx',
});

const state2 = signalState({
  user: { firstName: 'Peter', lastName: 'Smith' },
  numbers: [1, 2, 3],
});

state1.$update(setFirstName('Marko'), addNumber(40), { label: 'signals' });
state2.$update(setFirstName('Alex'), addNumber(4));
```

Unlike the default behavior of Angular signals, all signals created by the `signalState` function use equality check for reference types, not only for primitives. Therefore, the `$update` method only supports immutable updates. To perform immutable updates in a mutable way, use the `immer` library:

```ts
// immer-updater.ts
import { SignalStateUpdater } from '@ngrx/signals';
import { produce } from 'immer';

export function immerUpdater<State extends Record<string, unknown>>(
  updater: (state: State) => void
): SignalStateUpdater<State> {
  return (state) => produce(state, (draft) => updater(draft as State));
}
```

The `immerUpdater` function can be used in the following way:

```ts
import { immerUpdater } from './immer-updater';

state.$update(
  immerUpdater((state) => {
    state.user.firstName = 'Alex';
    state.numbers.push(100);
  })
);
```

---

### `selectSignal`

The `selectSignal` function is used to create computed (derived) signals. Unlike `computed` function from the `@angular/core` package, the `selectSignal` function applies an equality check for reference types by default. It has the same signature as `computed`.

```ts
import { selectSignal, signalState } from '@ngrx/signals';

type UsersState = { users: User[]; query: string };

const usersState = signalState<UsersState>({
  users: [],
  query: '',
});

const filteredUsers = selectSignal(() =>
  usersState.users().filter(({ name }) => name.includes(usersState.query()))
);
```

It also has another signature similar to `createSelector` and `ComponentStore.select`:

```ts
const filteredUsers = selectSignal(
  usersState.users,
  usersState.query,
  (users, query) => users.filter(({ name }) => name.includes(query))
);
```

---

### `signalStore`

The `signalStore` function acts as a pipe that accepts a sequence of store features. By combining various store features, we can add state slices, computed signals, methods, and hooks to the signal store.

There are 4 base features that can be used to create signal stores or custom signal store features: `withState`, `withSignals`, `withMethods`, and `withHooks`.

The `withState` feature accepts a dictionary of state slices, and converts each slice into a nested signal. All nested signals are created lazily as requested.

```ts
import { signalStore, withState } from '@ngrx/signals';

type Filter = { query: string; pageSize: number };
type UsersState = { users: User[]; filter: Filter };

const initialState: UsersState = {
  users: [],
  filter: { query: '', pageSize: 10 },
};

const UsersStore = signalStore(
  withState(initialState)
);
```

The `signalStore` function returns a class/token that can be further provided and injected where needed. Similar to `signalState`, `signalStore` also provides the [`$update` method](#update-method) for updating the state.

```ts
@Component({
  providers: [UsersStore],
})
export class UsersComponent {
  readonly usersStore = inject(UsersStore);
  // available state signals:
  // - usersStore.users: Signal<User[]>
  // - usersStore.filter: Signal<{ query: string; pageSize: number }>
  // - usersStore.filter.query: Signal<string>
  // - usersStore.filter.pageSize: Signal<number>
  
  onAddUser(user: User): void {
    this.usersStore.$update((state) => ({
      users: [...state.users, user]
    }));
  }
  
  onUpdateFilter(filter: Filter): void {
    this.usersStore.$update({ filter });
  }
}
```

The `withState` feature also has a signature that accepts the initial state factory as an input argument.

```ts
import { signalStore, withState } from '@ngrx/signals';

type UsersState = { users: User[]; query: string };

const USERS_INITIAL_STATE = new InjectionToken<UsersState>('Users Initial State', {
   factory() {
     return { users: [], query: '' };
   }, 
});

const UsersStore = signalStore(
  withState(() => inject(USERS_INITIAL_STATE))
);
```

The `withSignals` feature accepts the computed signals factory as an input argument. Its factory accepts a dictionary of previously defined state and computed signals as an input argument.

```ts
import { selectSignal, signalStore, withState, withSignals } from '@ngrx/signals';

type UsersState = { users: User[]; query: string };

const UsersStore = signalStore(
  withState<UsersState>({ users: [], query: '' }),
  // we can access previously created state signals via factory input
  withSignals(({ users, query }) => ({
    filteredUsers: selectSignal(() =>
      users().filter(({ name }) => name.includes(query()))
    ),
  }))
);

@Component({
  providers: [UsersStore],
})
export class UsersComponent {
  readonly usersStore = inject(UsersStore);
  // available state signals:
  // - usersStore.users: Signal<User[]>
  // - usersStore.query: Signal<string>
  // available computed signals:
  // - usersStore.filteredUsers: Signal<User[]>
}
```

The `withMethods` feature provides the ability to add methods to the signal store. Its factory accepts a dictionary of previously defined state signals, computed signals, methods, and `$update` method as an input argument and returns a dictionary of methods.

The last base feature of SignalStore is `withHooks`. It provides the ability to add custom logic on SignalStore init and/or destroy.

```ts
import { signalStore, withState, withMethods, withHooks } from '@ngrx/signals';

type UsersState = { users: User[]; loading: boolean };

const UsersStore = signalStore(
  withState<UsersState>({ users: [], loading: false }),
  // we can access the '$update' method via factory input
  withMethods(({ $update, users }) => {
    // services/tokens can be injected here
    const usersService = inject(UsersService);

    return {
      addUser(user: User): void {
        $update((state) => ({
          users: [...state.users, user],
        }));
      },
      async loadUsers(): Promise<void> {
        $update({ loading: true });
        const users = await usersService.getAll();
        $update({ users, loading: false });
      },  
    };
  }),
  withHooks({
    onInit({ loadUsers }) {
      loadUsers();
    },
    onDestroy({ users }) {
      console.log('users on destroy', users());
    },
  })
);

@Component({
  providers: [UsersStore],
})
export class UsersComponent {
  readonly usersStore = inject(UsersStore);
  // available signals and methods:
  // - usersStore.$update
  // - usersStore.users: Signal<User[]>
  // - usersStore.loading: Signal<boolean>
  // - usersStore.addUser: (user: User) => void
  // - usersStore.loadUsers: () => Promise<void>
}
```

#### DI Config

In the previous examples, we saw the default behavior - `signalStore` returns a class/token that can be further provided where needed. However, we can also provide a SignalStore at the root level by using the `{ providedIn: 'root' }` config:

```ts
import { signalStore, withState } from '@ngrx/signals';

type UsersState = { users: User[] };

const UsersStore = signalStore(
  { providedIn: 'root' },
  withState<UsersState>({ users: [] })
);

@Component({ /* ... */ })
export class UsersComponent {
  // all consumers will inject the same instance of UsersStore
  readonly usersStore = inject(UsersStore);
}
```

#### Defining Stores as Classes

Besides the functional approach, we can also define a store as class in the following way:

```ts
import { selectSignal, signalStore, withState } from '@ngrx/signals';

type CounterState = { count: number };

const initialState: CounterState = { count: 0 };

@Injectable({ providedIn: 'root' })
export class CounterStore extends signalStore(withState(initialState)) {
  // this.count signal is available from the base class
  readonly doubleCount = selectSignal(() => this.count() * 2);
  
  increment(): void {
    // this.$update method is available from the base class
    this.$update({ count: this.count() + 1 });
  }
  
  decrement(): void {
    this.$update({ count: this.count() - 1 });
  }
}
```

#### Custom Store Features

The `@ngrx/signals` package provides the `signalStoreFeatureFactory` function that can be used to create custom SignalStore features.

```ts
// call-state.feature.ts
import { selectSignal, signalStoreFeatureFactory, withState, withSignals } from '@ngrx/signals';

export type CallState = 'init' | 'loading' | 'loaded' | { error: string };

export function withCallState() {
  const callStateFeature = signalStoreFeatureFactory();
  
  return callStateFeature(
    withState<{ callState: CallState }>({ callState: 'init' }),
    withSignals(({ callState }) => ({
      loading: selectSignal(() => callState() === 'loading'),
      loaded: selectSignal(() => callState() === 'loaded'),
      error: selectSignal(callState, (callState) =>
        typeof callState === 'object' ? callState.error : null
      ),
    }))
  );
}

export function setLoading(): { callState: CallState } {
  return { callState: 'loading' };
}

export function setLoaded(): { callState: CallState } {
  return { callState: 'loaded' };
}

export function setError(error: string): { callState: CallState } {
  return { callState: { error } };
}
```

The `withCallState` feature can be further used in any signal store as follows:

```ts
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { withCallState, setLoaded } from './call-state.feature';

type UsersState = { users: User[] };

const UsersStore = signalStore(
  { providedIn: 'root' },
  withState<UsersState>({ users: [] }),
  withCallState(),
  withMethods(({ $update }, usersService = inject(UsersService)) => ({
    async loadUsers() {
      // updating the state:
      $update({ callState: 'loading' });
      const users = await usersService.getAll();
      // or we can use reusable updater:
      $update({ users }, setLoaded());
    }
  }))
);

@Component({ /* ... */})
export class UsersComponent implements OnInit {
  readonly usersStore = inject(UsersStore);
  // available signals:
  // - usersStore.users: Signal<User[]>
  // - usersStore.callState: Signal<CallState>
  // - usersStore.loading: Signal<boolean>
  // - usersStore.loaded: Signal<boolean>
  // - usersStore.error: Signal<string | null>

  ngOnInit(): void {
    this.usersStore.loadUsers();
  }
}
```

The `signalStoreFeatureFactory` function also provides the ability to specify which state slices, computed signals, and/or methods are required in a store that uses the feature.

```ts
// selected-entity.feature.ts
import { selectSignal, signalStoreFeatureFactory, withState, withSignals } from '@ngrx/signals';

type SelectedEntityState = { selectedEntityId: string | number | null };

export function withSelectedEntity<T extends { id: string | number }>() {
  const filteredEntitiesFeature = signalStoreFeatureFactory<{
    // a store that uses 'withSelectedEntity' feature must have the 'entityMap' state slice
    state: { entityMap: Dictionary<T> }
  }>();
  
  return filteredEntitiesFeature(
    withState<SelectedEntityState>({ selectedEntityId: null }),
    withSignals(({ selectedEntityId, entityMap }) => ({
      selectedEntity: selectSignal(
        selectedEntityId,
        entityMap,
        (selectedEntityId, entityMap) => selectedEntityId
          ? entityMap[selectedEntityId]
          : null
      )
    }))
  );
}
```

If we try to use the `withSelectedEntity` feature in the store that doesn't contain `entityMap` state slice, the compilation error will be thrown.

```ts
import { signalStore, withState } from '@ngrx/signals';
import { withSelectedEntity } from './selected-entity.feature';

const UsersStoreWithoutEntityMap = signalStore(
  withState<{ query: string }>({ query: '' }),
  withSelectedEntity() // ❌ compilation error
);

const UsersStoreWithEntityMap = signalStore(
  withState<{ query: string; entityMap: Dictionary<User> }>({
    query: '',
    entityMap: {},
  }),
  withSelectedEntity(), // ✅
);
```

Besides state, we can also add constraints for computed signals and/or methods in the following way:

```ts
export function withMyFeature() {
  const myFeature = signalStoreFeatureFactory<{
    // a store that uses 'withMyFeature' must have the 'foo' state slice,
    state: { foo: string },
    // 'bar' computed signal,
    signals: { bar: Signal<number> },
    // and 'loadBaz' method
    methods: { loadBaz: () => Promise<void> }
  }>();
  
  return myFeature(
    /* ... */
  );
}
```

More examples of custom SignalStore features:

- [`withImmerUpdate`](https://github.com/markostanimirovic/ngrx-signal-store-playground/blob/main/src/app/shared/immer-update.feature.ts)
- [`withLocalStorageSync`](https://github.com/markostanimirovic/ngrx-signal-store-playground/blob/main/src/app/shared/local-storage-sync.feature.ts)
- [`withLoadEntities`](https://github.com/markostanimirovic/ngrx-signal-store-playground/blob/main/src/app/shared/load-entities.feature.ts)

`withImmerUpdate` and `withLocalStorageSync` features can be developed as community plugins in the future.

```ts
import { signalStore, withState } from '@ngrx/signals';
import { withLocalStorageSync } from '../shared/local-storage-sync.feature';
import { withImmerUpdate } from '../shared/immer-update.feature';

@Injectable({ providedIn: 'root' })
export class TodosStore extends signalStore(
  withState<{ todos: string[] }>({ todos: [] }),
  // synchronize todos state with localStorage item with key 'todos'
  withLocalStorageSync('todos'),
  // override $update method to use `immerUpdater` under the hood by default
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
```

---

### `rxEffect`

The `rxEffect` function is inspired by the `ComponentStore.effect` method. It provides the ability to manage side effects by using RxJS operators. It returns a function that accepts a static value, signal, or observable as an input argument.

The `rxEffect` function can be used in the following way:

```ts
import { rxEffect } from '@ngrx/rxjs-utils';
import { signal } from '@angular/core';

@Component({ /* ... */ })
export class UsersComponent implements OnInit {
  private readonly usersService = inject(UsersService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly query = signal('');

  readonly loadUsersByQuery = rxEffect<string>(
    pipe(
      tap(() => this.loading.set(true)),
      switchMap((query) => this.usersService.getByQuery(query)),
      tap((users) => {
        this.users.set(users);
        this.loading.set(false);
      })
    )
  );

  ngOnInit(): void {
    // The effect will be executed every time when query signal changes.
    // It will clean up supscription when 'UsersComponent' is destroyed.
    this.loadUsersByQuery(this.query);
    // If it's called with static value (loadUsers('ngrx')), the effect
    // will be executed only once.
    // If it's called with observable (loadUsers(query$)), the effect
    // will be executed every time when 'query$' observable emits a new
    // value.
  }
}
```

It can be also used to define SignalStore methods:

```ts
import { signalStore, withState, withMethods, withHooks } from '@ngrx/signals';
import { rxEffect } from '@ngrx/rxjs-utils';

type UsersState = { users: User[]; loading: boolean; query: string };

const UsersStore = signalStore(
  withState<UsersState>({ users: [], query: '' }),
  withMethods(({ $update }, usersService = inject(UsersService)) => ({
    loadUsersByQuery: rxEffect<string>(
      pipe(
        tap(() => $update({ loading: true })),
        switchMap((query) => usersService.getByQuery(query)),
        tap((users) => $update({ users, loading: false }))
      )
    ),
  })),
  withHooks({
    onInit({ loadUsersByQuery, query }) {
      // re-fetch users every time when query signal changes
      loadUsersByQuery(query);
    },
  })
);
```

---

### Entity Management

This package should provide the following APIs:

- `withEntities` feature that will add `entityMap` and `ids` as state slices, and `entities` (entity list) as computed signal
- tree-shakeable updater functions: `setOne`, `setAll`, `deleteOne`, `deleteMany`, etc.

```ts
import { signalStore, withMethods } from '@ngrx/signals';
import { withEntities, setAll, deleteOne } from '@ngrx/signals/entities';
import { rxEffect } from '@ngrx/rxjs-utils';
import { withCallState, setLoading, setLoaded } from './call-state.feature';

const UsersStore = signalStore(
  withEntities<User>(),
  withCallState(),
  withMethods(({ $update }, usersService = inject(UsersService)) => ({
    loadUsers: rxEffect(
      pipe(
        tap(() => $update(setLoading())),
        exhaustMap(() => usersService.getAll()),
        tap((users) => $update(setAll(users), setLoaded()))
      )
    ),
  }))
);

@Component({
  template: `
    <p>Users: {{ usersStore.entities() | json }}</p>
    <p *ngIf="usersStore.loading()">Loading ...</p>
    <button (click)="onDeleteOne()">Delete One</button>
  `,
  providers: [UsersStore],
})
export class UsersComponent implements OnInit {
  readonly usersStore = inject(UsersStore);

  ngOnInit(): void {
    this.usersStore.loadUsers();
  }

  onDeleteOne(): void {
    this.usersStore.$update(deleteOne(1));
  }
}
```

`withEntities` function can be also used multiple times for the same store if we want to have multiple collections within the same store:

```ts
import { signalStore } from '@ngrx/signals';
import { withEntities, addOne, deleteOne } from '@ngrx/signals/entities';

const BooksStore = signalStore(
  withEntities<Book>({ collection: 'book' }),
  withEntities<Author>({ collection: 'author' })
);

const booksStore = inject(BooksStore);
// booksStore contains the following signals:
// - booksStore.bookEntityMap: Signal<Dictionary<Book>>;
// - booksStore.bookIds: Signal<Array<string | number>>;
// - (computed) booksStore.bookEntities: Signal<Book[]>;
// - booksStore.authorEntityMap: Signal<Dictionary<Author>>;
// - booksStore.authorIds: Signal<Array<string | number>>;
// - (computed) booksStore.authorEntities: Signal<Author[]>;

// updating multiple collections:
booksStore.$update(addOne({ id: 10, title: 'Book 1' }, { collection: 'book' }));
booksStore.$update(deleteOne(100, { collection: 'author' }));
```
