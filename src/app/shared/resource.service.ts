/* tslint:disable:no-string-literal */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {DefaultConfig} from '../default-config';

@Injectable()
export abstract class ResourceService<T> {
  public defaultHeaders: any = {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('token')
  };

  // tslint:disable-next-line:variable-name
  private _url: string;

  protected constructor(protected http: HttpClient) {
  }

  protected static clearObjectParams(params): any {
    const clearParams = {};
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null && params[key] !== '') {
        clearParams[key] = params[key];
      }
    }
    return clearParams;
  }

  protected static encodeQueryData(data): string {
    const ret = [];
    for (const d in data) {
      if (data.hasOwnProperty(d)) {
        if (data[d] !== undefined) {
          ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        }
      }
    }
    return ret.join('&');
  }

  getUrl(): string {
    return this._url;
  }

  setUrl(url: string) {
    this._url = url;
  }


  list(queries?: any, headers: any = {}): Observable<any> {
    const headersMerged = Object.assign(headers, this.defaultHeaders);

    return this.http.get(this.getUrl(), {
      headers: headersMerged,
      params: {
        like: !DefaultConfig.strictQueries,
        ...ResourceService.clearObjectParams({...queries})
      }
    }).pipe(map((response: Response) => response));
  }

  get(id: number, queries?: any, headers: any = {}): Observable<any> {
    const headersMerged = Object.assign(headers, this.defaultHeaders);

    return this.http.get(`${this.getUrl()}/${id}`, {
      headers: headersMerged,
      params: ResourceService.clearObjectParams({...queries})
    }).pipe(map((response: Response) => response));
  }

  save(entity: T, queries?: any, headers: any = {}): Observable<any> {
    const headersMerged = Object.assign(headers, this.defaultHeaders);

    return this.http.post(`${this.getUrl()}?${ResourceService.encodeQueryData(
      {...queries})}`, JSON.stringify(entity),
      {headers: headersMerged}
    );
  }

  update(entity: T, queries?: any, headers: any = {}): Observable<any> {
    const headersMerged = Object.assign(headers, this.defaultHeaders);

    return this.http.put(
      `${this.getUrl()}/${entity['id']}?${ResourceService.encodeQueryData({...queries})}`,
      JSON.stringify(entity),
      {headers: headersMerged});
  }

  del(entity: T, queries?: any, headers: any = {}): Observable<any> {
    const headersMerged = Object.assign(headers, this.defaultHeaders);

    return this.http.delete(`${this.getUrl()}/${entity['id']}?${ResourceService.encodeQueryData({
      ...queries
    })}`, {headers: headersMerged});
  }

}
