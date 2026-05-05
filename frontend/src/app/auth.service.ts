import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;

  constructor() {}

  login(username: string, password: string): Observable<any> {
    if (username.toLowerCase() === 'admin' && password === 'admin') {
      this.currentUser = { username: 'admin', role: 'ADMIN' };
      return of({ success: true, user: this.currentUser }).pipe(delay(800));
    } else if (username && password) {
      this.currentUser = { username: username, role: 'USER' };
      return of({ success: true, user: this.currentUser }).pipe(delay(800));
    }
    return of({ success: false, message: 'Invalid credentials' }).pipe(delay(800));
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  logout() {
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}
