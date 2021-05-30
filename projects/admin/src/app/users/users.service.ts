import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../shared/interfaces/user';
import { List } from '../shared/interfaces/list';
import { Pagination } from '../shared/interfaces/pagination';
import { UserFilters } from '../shared/interfaces/userFilters';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {}

  public list(params: Pagination & UserFilters): Observable<List<User>> {
    return this.http.get<List<User>>('/api/users', {
      params: {
        page: params.page,
        limit: params.size,
        ...this.removeEmpty({
          userId: params.userId,
          userFirstName: params.userFirstName,
          userLastName: params.userLastName,
          userEmail: params.userEmail
        })
      }
    });
  }

  public get(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }

  public save(user: User): Observable<User> {
    return this.http.post<User>(`/api/users`, user);
  }

  public update(user: User): Observable<User> {
    return this.http.put<User>(`/api/users/${user.id}`, user);
  }

  public delete(id: number): Observable<unknown> {
    return this.http.delete(`/api/users/${id}`);
  }

  private removeEmpty(obj: any): any {
    const output: any = {};
    Object.entries(obj).forEach(([key, val]) => {
      if (val != null && val !== '' && val !== undefined) {
        output[key] = val;
      }
    });

    return output;
  }
}
