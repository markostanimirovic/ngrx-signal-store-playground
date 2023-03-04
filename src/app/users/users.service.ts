import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { User } from './user.model';

const usersMock: User[] = [
  { id: 1, name: 'Alex' },
  { id: 2, name: 'Brandon' },
  { id: 3, name: 'Marko' },
  { id: 4, name: 'Mike' },
  { id: 5, name: 'Tim' },
];

@Injectable({ providedIn: 'root' })
export class UsersService {
  getUsers(query: string, pageSize: number): Observable<User[]> {
    const filteredUsers = usersMock
      .filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, pageSize);

    return of(filteredUsers).pipe(delay(1000));
  }
}
