import { TestBed } from '@angular/core/testing';
import { AppService } from './app.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Login } from './shared/interfaces/login';

describe('AppService', () => {
  let service: AppService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(AppService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should make http call to login API', () => {
      const mockResponse = {
        token: 'abc',
        user: {}
      } as Login;

      service.login('test1@email.com', 'test').subscribe((login) => {
        expect(login).toStrictEqual(mockResponse);
      });

      const req = httpTestingController.expectOne({
        method: 'POST',
        url: '/api/auth'
      });

      req.flush(mockResponse);
    });
  });
});
