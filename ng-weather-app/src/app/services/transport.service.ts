import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  constructor(private http: HttpClient) { }

  public get(config: any): Observable<HttpEvent<any>> {
    const request: HttpRequest<any> = new HttpRequest<any>('GET', config.url, config.body);
    return this.http.request(request);
  }
}
