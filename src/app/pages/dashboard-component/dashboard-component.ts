import { MensagemService } from './../../services/mensagem.service';
import { Component, ElementRef, ViewChild, AfterViewChecked, NgZone } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../components/header-component/header-component';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SugestoesComponent } from '../components/sugestoes-component/sugestoes-component';

interface Message {
  user: string;
  text: string;
}

@Component({
  selector: 'app-dashboard-component',
  imports: [HeaderComponent, NgClass, FormsModule, SugestoesComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private auth: AuthService,
    private mensagemService: MensagemService,
    private ngZone: NgZone
  ) {}

  messages: Message[] = [];
  newMessage: string = '';
  newBotMessage: string = '';
  gravando = false;
  recognition: any;
  opcoesSugestao: string[] = ['Casos clínicos', 'Estudar por questões', 'Tirar dúvidas'];
  tituloSugestao: string = 'O que deseja estudar hoje?';

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  enviarMensagem() {
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
            console.log('Mensagem enviada com sucesso: ', response);
          },
          error: (error) => {
            console.error('Erro ao salvar mensagem do usuário:', error);
          },
        });

      this.mensagemService.enviarPrompt(this.newMessage).subscribe({
        next: (response) => {
          this.newBotMessage = response.output;
        },
        error: (err) => {
          console.error('Erro ao enviar prompt: ', err);
        },
      });

      this.newMessage = '';
      this.scrollToBottom();

      setTimeout(() => {
        this.messages.push({ user: 'bot', text: 'Mensagem Recebida' });
        this.mensagemService
          .enviarMensagem(
            this.newBotMessage,
            false,
            '2e2322dd-5a77-4ce3-b850-0e43bb560dff',
            new Date().toISOString()
          )
          .subscribe({
            next: (response) => {
              console.log('Mensagem do bot salva: ', response);
            },
            error: (error) => {
              console.error('Erro ao salvar mensagem do bot:', error);
            },
          });
        this.scrollToBottom();
      }, 1000);
    }
  }

  toggleGravacao() {
    if (this.gravando) {
      this.pararReconhecimento();
    } else {
      this.iniciarReconhecimento();
    }
  }

  iniciarReconhecimento() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Reconhecimento de voz não é suportado neste navegador.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'pt-BR';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    let ultimoTextoFinal = '';

    this.recognition.onresult = (event: any) => {
      let textoFinal = '';
      let textoParcial = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();

        if (event.results[i].isFinal) {
          textoFinal += transcript + ' ';
        } else {
          textoParcial += transcript;
        }
      }

      this.ngZone.run(() => {
        if (textoFinal && textoFinal.trim() !== ultimoTextoFinal.trim()) {
          this.newMessage = (this.newMessage + ' ' + textoFinal).trim();
          ultimoTextoFinal = textoFinal;
        }

        if (textoParcial) {
          const textoComParcial = (this.newMessage + ' ' + textoParcial).trim();
          this.newMessage = textoComParcial;
        }
      });
    };

    this.recognition.onstart = () => {
      this.ngZone.run(() => (this.gravando = true));
    };

    this.recognition.onend = () => {
      this.ngZone.run(() => (this.gravando = false));
    };

    this.recognition.start();
  }

  pararReconhecimento() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTo({
        top: this.scrollContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    } catch {}
  }

  logoutFunc() {
    this.auth.logout();
  }

  enviarSugestao(event: string) {
    this.newMessage = event;
    this.enviarMensagem();
  }
}
