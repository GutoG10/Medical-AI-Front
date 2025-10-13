import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jose from 'jose';
import { URL } from '../../environment';
import { jwtDecode } from 'jwt-decode';

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
    console.log('teste');
    this.http
      .post<{ usuario_id: string; primeiro_acesso: boolean }>(`${URL.authUrl}`, {
        email,
        senha,
        codigo,
      })
      .subscribe({
        next: async (res) => {
          localStorage.setItem('usuario_id', res.usuario_id);
          //const token = await this.generateToken({
          //  id: res.usuario_id,
          //  email: email,
          //  codigo: codigo,
          //});
          //this.saveToken(token);
          console.log(res.usuario_id);
          console.log(res.primeiro_acesso);
          if (res.primeiro_acesso) {
            this.router.navigate(['nova-senha']);
          } else {
            this.router.navigate(['dashboard']);
          }
        },
      });
  }

  novaSenha(senha: string) {
    const usuario = localStorage.getItem('usuario_id');
    console.log('teste', usuario);
    const usuario_id = usuario;
    return this.http.post(`${URL.authUrl}/alterar-senha`, { usuario_id, senha });
  }

  async generateToken(payload: any) {
    const secret = new TextEncoder().encode('d206e0a2e4ff3286b1981bf07784b614');
    const alg = 'HS256';
    return await new jose.SignJWT(payload).setProtectedHeader({ alg }).setIssuedAt().sign(secret);
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
}
