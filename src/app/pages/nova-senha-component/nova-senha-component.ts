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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.login = params['login'];
    });

    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.newPasswordForm.valid) {
      const { password, confirmPassword } = this.newPasswordForm.value;
      if (password === confirmPassword) {
        console.log('Login Válido!!');
        this.router.navigate(['dashboard']);
        if (this.login.includes('@')) {
          this.auth.login(this.login, password, '').subscribe({
            next: async () => {
              const token = await this.auth.generateToken({
                user: this.login,
                type: 'email',
              });
              this.auth.saveToken(token);
              this.router.navigate(['dashboard']);
            },
          });
        } else {
          this.auth.login('', password, this.login).subscribe({
            next: async () => {
              const token = await this.auth.generateToken({
                user: this.login,
                type: 'code',
              });
              this.auth.saveToken(token);
              this.router.navigate(['dashboard']);
            },
          });
        }
      }
    }
  }
}
