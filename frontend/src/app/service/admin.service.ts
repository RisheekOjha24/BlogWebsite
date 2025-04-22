import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:4500/api/admin';

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/allUsers`);
  }

  suspendUser(id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/suspend`, {id});
  }

  notification(id:string,msg:string):Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/notify`, {id,msg});
  }

  makeorRevokeAdmin(superAdminUser:string,user:string):Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/makeOrRevokeAdmin`, {superAdminUser, user});
  }

}
