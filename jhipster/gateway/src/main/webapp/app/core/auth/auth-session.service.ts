import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  constructor(private http: HttpClient) {}

  logout(): Observable<any> {
    // logout from the server
    return this.http.post(SERVER_API_URL + 'api/logout', {}, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        return response;
      })
    );
  }
}
