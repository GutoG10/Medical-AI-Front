import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nova-senha-component',
  imports: [ReactiveFormsModule],
  templateUrl: './nova-senha-component.html',
  styleUrl: './nova-senha-component.css',
})
export class NovaSenhaComponent {
  newPasswordForm: FormGroup;
  login: string = '';
  mostrarSenha: boolean = false;
  mostrarConfirmarSenha: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.login = params['login'];
    });

    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  toggleConfirmarSenha() {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

  onSubmit() {
    console.log('ASDASDASIHDOI');
    if (this.newPasswordForm.valid) {
      const { password, confirmPassword } = this.newPasswordForm.value;
      if (password === confirmPassword) {
        this.auth.novaSenha(password).subscribe({
          next: () => console.log('Nova senha salva com sucesso'),
        });
        this.router.navigate(['dashboard']);
      }
    }
  }
}
