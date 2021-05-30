import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { List } from '../shared/interfaces/list';
import { User } from '../shared/interfaces/user';
import { Pagination } from '../shared/interfaces/pagination';
import { UserFilters } from '../shared/interfaces/userFilters';

describe('UsersService', () => {
  const mockResponse = {
    count: 2,
    rows: [
      {
        id: 1,
        firstName: 'test1',
        lastName: 'last1',
        email: 'email1@email.com'
      },
      {
        id: 2,
        firstName: 'test2',
        lastName: 'last2',
        email: 'email2@email.com'
      }
    ]
  } as List<User>;
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(UsersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('list', () => {
    it('should make http call to /api/users API', () => {
      service
        .list({
          userEmail: 'test@email',
          page: 1,
          size: 10
        } as Pagination & UserFilters)
        .subscribe((list) => expect(list).toStrictEqual(mockResponse));

      const req = httpTestingController.expectOne({
        method: 'GET',
        url: '/api/users?page=1&limit=10&userEmail=test@email'
      });

      req.flush(mockResponse);
    });
  });

  describe('get', () => {
    it('should make http call to /api/users/1 API', () => {
      service
        .get(1)
        .subscribe((user) => expect(user).toStrictEqual(mockResponse.rows[0]));

      const req = httpTestingController.expectOne({
        method: 'GET',
        url: '/api/users/1'
      });

      req.flush(mockResponse.rows[0]);
    });
  });

  describe('save', () => {
    it('should make http call to /api/users API', () => {
      service.save({} as User).subscribe();

      const req = httpTestingController.expectOne({
        method: 'POST',
        url: '/api/users'
      });

      req.flush({});
    });
  });

  describe('update', () => {
    it('should make http call to /api/users/2 API', () => {
      service.update({ id: 2 } as User).subscribe();

      const req = httpTestingController.expectOne({
        method: 'PUT',
        url: '/api/users/2'
      });

      req.flush({});
    });
  });

  describe('delete', () => {
    it('should make http call to /api/users/1 API', () => {
      service.delete(1).subscribe();

      const req = httpTestingController.expectOne({
        method: 'DELETE',
        url: '/api/users/1'
      });

      req.flush({});
    });
  });

  describe('removeEmpty', () => {
    it('should remove null, empty or undefined properties of object', () => {
      const removeEmptyName = 'removeEmpty';

      expect(
        service[removeEmptyName]({
          test: '1',
          test1: null,
          test2: undefined,
          test3: ''
        })
      ).toStrictEqual({ test: '1' });
    });
  });
});
