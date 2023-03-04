## @ngrx/signals

> Package name suggestions:
> - `@ngrx/signals`
> - `@ngrx/signal-store`
> - `@ngrx/state`

Main Goals:

- Providing unidirectional and predictable data flow with signals.
- Keeping declarative approach instead of "imperative reactivity" which is possible with signals.
- Separating side effects from state to avoid unpredictable data flow.

Key Principles:

- Simple and intuitive
- Declarative
- Composable
- Tree-shakeable
- Strongly typed

### `signalStore`

> Other function name suggestions:
>
> - `store`
> - `createStore`
> - `createSignalStore`

The `signalStore` function acts as a pipe that accepts a sequence of store features. By using various store features, we can add state slices, computed state, updaters, effects, hooks, and DI configuration to the signal store.

### Store Features

- `withState` - accepts a dictionary of state slices, and converts each slice into a signal.
- `withComputed` - accepts the previous state slices and computed properties as factory argument. Returns a dictionary of computed properties.

```ts
import { signalStore, withState, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';

type UsersState = {
  users: User[];
  query: string;
};

const [provideUsersStore, injectUsersStore] = signalStore(
  withState<UsersState>({ users: [], query: '' }),
  // note: we can access previously defined state slices via factory argument
  withComputed(({ users, query }) => ({
    filteredUsers: computed(() =>
      // note: 'users' and 'query' slices are signals
      users().filter(({ name }) => name.includes(query()))
    ),
  }))
);

@Component({
  providers: [provideUsersStore()],
})
export class UsersComponent {
  readonly usersStore = injectUsersStore();
  // available properties:
  // - state slices:
  //     usersStore.users: Signal<User[]>
  //     usersStore.query: Signal<string>
  // - computed:
  //     usersStore.filteredUsers: Signal<User[]>
}
```

---

#### DI Config

In the previous example we saw default behavior - `signalStore` returns a tuple of provide and inject functions that can be further used in the component. However, we can also provide a signal store at the root level or directly get its instance by passing the config object as the first argument of the `signalStore` function.

With `{ providedIn: 'root' }`, `signalStore` will return inject function as a result:

```ts
import { signalStore, withState } from '@ngrx/signals';

type UsersState = { users: User[]; query: string };

const injectUsersStore = signalStore(
  { providedIn: 'root' },
  withState<UsersState>({ users: [], query: '' })
);

@Component({ /* ... */ })
export class UsersComponent {
  // all consumers will inject the same instance of users store
  readonly usersStore = injectUsersStore();
}
```

There is also an option to get the signal store instance as a result by using `{ useInjection: false }`. This covers the use-case when we want to create a store within a component:

```ts
@Component({ /* ... */ })
export class UsersComponent {
  // note: 'signalStore' function returns an instance of signal store
  // when '{ useInjection: false }' is used
  readonly usersStore = signalStore(
    { useInjection: false },
    withState<UsersState>({ users: [], query: '' })
  );
}
```

---

#### `update` function

The `update` function is used to update the signal store state. It accepts a sequence of partial state objects or update functions that partially updates the state. This provides the ability to define reusable and tree-shakeable updater functions that can be used in any signal store.

Examples:

```ts
type UsersState = { users: User[]; callState: CallState };

const usersStore = signalStore(
  { useInjection: false },
  withState<UsersState>({ users: [], callState: 'init' })
);

// passing partial state object:
usersStore.update({ users: ['u1', 'u2'] });

// passing updater function:
usersStore.update((state) => ({
  users: [...state.users, 'u3'],
  callState: 'loaded',
}));

// passing a sequence of partial state objects and/or updater functions:
usersStore.update(
  (state) => ({ users: [...state.users, 'u4'] }),
  { callState: 'loaded' }
);

// We can also define reusable and tree-shakeable updater functions
// that can be used in any signal store:
function removeInactiveUsers(): (state: { users: User[] }) => { users: User[] } {
  return (state) => ({ users: state.users.filter((user) => user.isActive) })
}

function setLoaded(): { callState: CallState } {
  return { callState: 'loaded' };
}

// using updater functions:
usersStore.update(removeInactiveUsers(), setLoaded());
```

---

- `withUpdaters` - provides the ability to add updaters to the signal store. Its factory accepts state slices, computed properties, previously defined updaters, and `update` function as an input argument.
- `withEffects` - provides the ability to add effects to the signal store. Its factory accepts state slices, computed properties, updaters, previously defined effects, and `update` function as an input argument.
- `withHooks` - provides the ability to add custom logic on signal store init and/or destroy. Hook factories also accept state slices, computed properties, updaters, and effects.

```ts
import {
  signalStore,
  withState,
  withComputed,
  withUpdaters,
  withEffects,
  withHooks,
} from '@ngrx/signals';
import { rxEffect } from '@ngrx/signals/rxjs-interop';
import { computed } from '@angular/core';

type UsersState = {
  users: User[];
  query: string;
};

const [provideUsersStore, injectUsersStore] = signalStore(
  withState<UsersState>({ users: [], query: '' }),
  withComputed(({ users, query }) => ({
    filteredUsers: computed(() =>
      users().filter(({ name }) => name.includes(query()))
    ),
  })),
  // note: we can access the 'update' function via updaters/effects
  // factory argument
  withUpdaters(({ update, users }) => ({
    addUsers: (newUsers: User[]) => {
      update((state) => ({ users: [...state.users, newUsers] }))
      // or:
      // update({ users: [...users(), newUsers] })
    },
  })),
  withEffects(({ addUsers }) => {
    const usersService = inject(UsersService);
    // note: read more about 'rxEffect' in the section below
    const loadUsers = rxEffect<void>(
      pipe(
        exhaustMap(() => usersService.getAll()),
        tap((users) => addUsers(users))
      )
    );

    return { loadUsers };
  }),
  withHooks({
    onInit: ({ loadUsers }) => loadUsers(),
    onDestroy: ({ filteredUsers }) =>
      console.log('users on destroy:', filteredUsers()),
  })
);

@Component({
  providers: [provideUsersStore()],
})
export class UsersComponent {
  readonly usersStore = injectUsersStore();
  // available properties and methods:
  // - usersStore.update method
  // - usersStore.users: Signal<User[]>
  // - usersStore.query: Signal<string>
  // - usersStore.filteredUsers: Signal<User[]>
  // - usersStore.addUsers: (users: User[]) => void
  // - usersStore.loadUsers: () => Subscription
}
```

### `rxEffect`

The `rxEffect` function is a similar API to `ComponentStore.effect`. It provides the ability to manage asynchronous side effects by using RxJS. It returns a function that accepts a static value, signal, or observable as an input argument.

The `rxEffect` function can be used with `signalStore` as we saw above or completely independent. When used within the component injection context, it will clean up subscription on destroy.

> The `rxEffect` function can be part of the `@ngrx/signals` / `@ngrx/state` package or `@ngrx/signals/rxjs-interop` / `@ngrx/state/rxjs` subpackage.

Examples:

```ts
import { rxEffect } from '@ngrx/signals/rxjs-interop';
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

### Custom Store Features

Every store feature returns an object that contains following properties:

```ts
type SignalStoreFeature = {
  state: Record<string, Signal<unknown>>;
  computed: Record<string, Signal<unknown>>;
  effects: Record<
    string,
    (source: unknown | Observable<unknown> | Signal<unknown>) => Subscription
  >;
  updaters: Record<string, (...args: unknown[]) => void>;
  hooks: {
    onInit: () => void;
    onDestroy: () => void;
  }
}
```

For example, we can define `withCallState` feature in the following way:

> :bell: We can also create a helper function (`createSignalStoreFeature`) to easily create more complex custom features.

```ts
import { signal, computed } from '@angular/core';

function withCallState(): () => {
  state: { callState: Signal<CallState> };
  computed: {
    loading: Signal<boolean>;
    loaded: Signal<boolean>;
    error: Signal<unknown>;
  };
} {
  return () => {
    const callState = signal<CallState>('init');
    
    return {
      state: { callState },
      computed: {
        loading: computed(() => callState() === 'loading'),
        loaded: computed(() => callState() === 'loaded'),
        error: computed(() =>
          typeof callState() === 'object' ? callState().error : null
        ),
      }
    };
  };
}
```

This feature can be further used in any signal store that needs call state as follows:

```ts
const usersStore = signalStore(
  { useInjection: false },
  withState<{ users: string[] }>({ users: [] }),
  withCallState()
);

// usersStore contains following properties:
// - usersStore.users: Signal<string[]>
// - usersStore.callState: Signal<CallState>
// - usersStore.loading: Signal<boolean>
// - usersStore.loaded: Signal<boolean>
// - usersStore.error: Signal<unknown>

// updating:

usersStore.update({ callState: 'loading' });
// or by using reusable updater function:
usersStore.update(setLoaded());

function setLoaded(): { callState: 'loaded' } {
  return { callState: 'loaded' };
}
```

### Entity Management

This (sub)package should provide the following APIs:

- `withEntities` feature that will add `entityMap` and `ids` as state, and `entities` (entity list) as computed property
- tree-shakeable updater functions: `setOne`, `setAll`, `deleteOne`, `deleteMany`, etc.

Example:

```ts
import { rxEffect } from '@ngrx/signals/rxjs-interop';
import { withEntities, setAll, deleteOne } from '@ngrx/signals/entity';

const [provideUsersStore, injectUsersStore] = signalStore(
  withEntites<User>(),
  withEffects(({ update }) => {
    const usersService = inject(UsersService);

    return {
      loadUsers: rxEffect(
        pipe(
          exhaustMap(() => usersService.getAll()),
          tap((users) => update(setAll(users)))
        )
      ),
    };
  })
);

@Component({
  template: `
    <p>Users: {{ usersStore.entities() | json }}</p>
    <button (click)="onDeleteOne()">Delete One</button>
  `,
  providers: [provideUsersStore()]
})
export class UsersComponent implements OnInit {
  readonly usersStore = injectUsersStore();

  ngOnInit(): void {
    this.usersStore.loadUsers();
  }

  onDeleteOne(): void {
    this.usersStore.update(deleteOne(1));
  }
}
```

`withEntities` function can be also used multiple times for the same store in case we want to have multiple collections within the same store:

```ts
import { withEntities, addOne, deleteOne } from '@ngrx/signals/entity';

const booksStore = signalStore(
  { useInjection: false },
  withEntities<Book>({ collection: 'book' }),
  withEntities<Author>({ collection: 'author' })
);

// booksStore contains following properties:
// - booksStore.bookEntityMap: Signal<Dictionary<Book>>;
// - booksStore.bookIds: Signal<Array<string | number>>;
// - (computed) booksStore.bookEntities: Signal<Book[]>;
// - booksStore.authorEntityMap: Signal<Dictionary<Author>>;
// - booksStore.authorIds: Signal<Array<string | number>>;
// - (computed) booksStore.authorEntities: Signal<Author[]>;

// updating multiple collections:
booksStore.update(
  addOne(
    { id: 10, title: 'Book 1' },
    { collection: 'book' }
  )
);
booksStore.update(deleteOne(100, { collection: 'author' }));
```
