import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule],
  templateUrl: './login-component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  mostrarSenha: boolean = false;
  sloganDinamico: string = 'Plataforma inteligente no ensino médico';
  novo_usuario: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
  ) {
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
      if (login.includes('@')) {
        this.auth.login(login, password, 0);
      } else {
        this.auth.login('', password, login);
      }
    }
  }
}
