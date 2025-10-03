import { MensagemService } from './../../services/mensagem.service';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../components/header-component/header-component';
import { NgClass } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

interface Message {
  user: string;
  text: string;
}

@Component({
  selector: 'app-dashboard-component',
  imports: [HeaderComponent, NgClass, FormsModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
  constructor(private auth: AuthService, private mensagemService: MensagemService) {}

  messages: Message[] = [];
  newMessage: string = '';

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ user: 'me', text: this.newMessage });
      this.mensagemService
        .enviarMensagem(
          this.newMessage,
          true,
          '2e2322dd-5a77-4ce3-b850-0e43bb560dff',
          new Date().toISOString()
        )
        .subscribe({
          next: (response) => {
            console.log('Mensagem recebida com sucesso: ', response);
          },
          error: (error) => {
            console.error('Erro ao salvar mensagem do usuário:', error);
          },
        });
      this.newMessage = '';

      setTimeout(() => {
        this.messages.push({ user: 'bot', text: 'Mensagem Recebida' });
        this.mensagemService
          .enviarMensagem(
            'Mensagem Recebida',
            false,
            '2e2322dd-5a77-4ce3-b850-0e43bb560dff',
            new Date().toISOString()
          )
          .subscribe({
            next: (response) => {
              console.log('Mensagem recebida com sucesso: ', response);
            },
            error: (error) => {
              console.error('Erro ao salvar mensagem do usuário:', error);
            },
          });
      }, 1000);
    }
  }

  logoutFunc() {
    this.auth.logout();
  }
}
