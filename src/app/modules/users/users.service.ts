import {UserClass} from '../../classes/user.class';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResourceService} from '../../shared/resource.service';

@Injectable()
export class UsersService extends ResourceService<UserClass> {
  constructor(http: HttpClient) {
    super(http);
    this.setUrl('api/users');
  }
}
