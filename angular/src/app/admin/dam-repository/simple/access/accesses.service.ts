import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccessPolicyService {

  constructor(private http: HttpClient) {
  }

}
