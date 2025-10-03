import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { errors } from 'jose';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  mostrarSenha: boolean = false;
  sloganDinamico: string = 'Seu estudo, mais inteligente com IA';
  novo_usuario: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { login, password }: { login: string; password: string } = this.loginForm.value;

      if (this.novo_usuario) {
        this.router.navigate(['nova-senha'], { queryParams: { login } });
      } else {
        if (login.includes('@')) {
          this.auth.login(login, password, 0).subscribe({
            next: async (response: any) => {
              console.log('Response: ', response);
              const token = await this.auth.generateToken({
                user: login,
                type: 'email',
              });
              this.auth.saveToken(token);
              this.router.navigate(['dashboard']);
            },
            error: (errors) => {
              console.error('Erro ao tentar logar: ', errors);
            },
          });
        } else {
          this.auth.login('', password, login).subscribe({
            next: async (response: any) => {
              console.log('Response: ', response);
              const token = await this.auth.generateToken({
                user: login,
                type: 'code',
              });
              this.auth.saveToken(token);
              this.router.navigate(['dashboard']);
            },
            error: (errors) => {
              console.error('Erro ao tentar logar: ', errors);
            },
          });
        }
      }
    }
  }
}
