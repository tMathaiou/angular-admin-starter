import {DefaultConfig} from '../default-config';
import {LanguageClass} from '../classes/language.class';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private isSidebarOpen = new BehaviorSubject<boolean>(DefaultConfig.isSidebarOpen);
  private langID = new BehaviorSubject<number>(0);
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  private loading = new BehaviorSubject<boolean>(false);
  private token = new BehaviorSubject<string>('');
  private languages = new BehaviorSubject<LanguageClass[]>([{
    imageSrc: '/assets/images/260-united-kingdom.svg',
    path: 'en',
    id: 0,
    text: '',
  }, {
    imageSrc: '/assets/images/170-greece.svg',
    path: 'el',
    id: 1,
    text: '',
  }]);

  getIsSidebarOpen() {
    return this.isSidebarOpen.asObservable();
  }

  setIsSidebarOpen(): void {
    this.isSidebarOpen.next(!this.isSidebarOpen.getValue());
  }

  getLangID() {
    return this.langID.asObservable();
  }

  setLangID(langID: number): void {
    this.langID.next(langID);
  }

  getLoggedIn() {
    return this.loggedIn.asObservable();
  }

  setLoggedIn(loggedIn: boolean): void {
    this.loggedIn.next(loggedIn);
  }

  getLoading() {
    return this.loading.asObservable();
  }

  setLoading(loading: boolean): void {
    this.loading.next(loading);
  }

  setToken(token: string): void {
    this.token.next(token);
  }

  getLanguages() {
    return this.languages.asObservable();
  }

}
