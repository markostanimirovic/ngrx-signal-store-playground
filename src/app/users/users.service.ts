import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { User } from './user.model';
import { Filter } from '../shared/filter.feature';
import { EntityService } from '../shared/load-entities.feature';

const usersMock: User[] = [
  { id: 1, name: 'Alex' },
  { id: 2, name: 'Brandon' },
  { id: 3, name: 'Marko' },
  { id: 4, name: 'Mike' },
  { id: 5, name: 'Tim' },
];

@Injectable({ providedIn: 'root' })
export class UsersService implements EntityService<User> {
  getAll(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(usersMock), 1000);
    });
  }

  getByFilter(filter: Filter): Observable<User[]> {
    const filteredUsers = usersMock
      .filter(({ name }) =>
        name.toLowerCase().includes(filter.query.toLowerCase())
      )
      .slice(0, filter.pageSize);

    return of(filteredUsers).pipe(delay(1000));
  }
}
