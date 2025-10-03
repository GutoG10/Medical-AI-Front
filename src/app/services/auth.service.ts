import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jose from 'jose';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router, private http: HttpClient) {}

  private tokenKey = 'authToken';

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  login(email: string, senha: string, codigo: number | string) {
    return this.http.post('http://localhost:5678/webhook/c11135a5-41d6-43f4-a2ba-381d54a899b4', {
      email,
      senha,
      codigo,
    });
  }

  async generateToken(payload: any) {
    const secret = new TextEncoder().encode('d206e0a2e4ff3286b1981bf07784b614');
    const alg = 'HS256';

    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('4h')
      .sign(secret);
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
}
