import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserBackendService {

  constructor(private httpClient: HttpClient) { }



  getUserById(userId: number): User | undefined{
    let user = undefined;
    this.httpClient.get(environment.endpointURL + "user/getById", {
      params: {
        userId: userId
      }
    }).subscribe(res => user=res);
    return user;

  }

  getUserByIdAsObservable(userId: number): Observable<any> {
    return this.httpClient.get(environment.endpointURL + "user/getById", {
      params: {
        userId: userId
      }
    });
  }





}
