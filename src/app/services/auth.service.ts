import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  login(email: string, senha: string, codigo: number | string) {
    this.http
      .post<{ usuario_id: string; primeiro_acesso: boolean }>(`${URL.authUrl}`, {
        email,
        senha,
        codigo,
      })
      .subscribe({
        next: (res) => {
          localStorage.setItem('usuario_id', res.usuario_id);

          this.generateToken({ id: res.usuario_id, email, codigo }).subscribe({
            next: (tokenRes) => {
              this.saveToken(tokenRes.token);
              console.log("res:", res);
              if (res.primeiro_acesso === true) {
                this.router.navigate(['nova-senha']);
              } else {
                this.router.navigate(['dashboard']);
              }
            },
          });
        },
        error: (err) => console.error('Erro no login', err),
      });
  }

  novaSenha(senha: string) {
    const usuario = localStorage.getItem('usuario_id');
    console.log('teste', usuario);
    const usuario_id = usuario;
    return this.http.post(
      `${URL.authUrl}/alterar-senha`,
      { usuario_id, senha },
      {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      }
      // { Authorization: this.getToken() }
    );
  }

  generateToken(payload: any) {
    return this.http.post<{ token: string }>(
      'http://localhost:5678/webhook/62edbe74-24ca-421a-b4f5-48e69d3053f4',
      payload,
    );
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
}
