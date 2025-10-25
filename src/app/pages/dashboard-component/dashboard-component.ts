import { MensagemService } from './../../services/mensagem.service';
import { Component, ElementRef, ViewChild, AfterViewChecked, NgZone, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../components/header-component/header-component';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SugestoesComponent } from '../components/sugestoes-component/sugestoes-component';
import { MarkdownModule } from 'ngx-markdown';

interface Message {
  id?: string;
  foi_usuario: boolean;
  text: string;
}

@Component({
  selector: 'app-dashboard-component',
  imports: [HeaderComponent, NgClass, FormsModule, MarkdownModule, SugestoesComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements AfterViewChecked, OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private auth: AuthService,
    private mensagemService: MensagemService,
    private ngZone: NgZone,
  ) {}

  protected firstMessage = true;
  protected aiMode?: 'MODO 1' | 'MODO 2' | 'MODO 3';
  messages: Message[] = [];
  newMessage: string = '';
  newBotMessage: string = '';
  gravando = false;
  recognition: any;
  opcoesSugestao: string[] = ['Casos clínicos', 'Estudar por questões', 'Tirar dúvidas'];
  tituloSugestao: string = 'O que deseja estudar hoje?';

  ngOnInit(): void {
    this.mensagemService.buscarMensagens().subscribe({
      next: (response) => {
        if (response) {
          response.forEach((mensagem) => {
            console.log('mensagem: ', mensagem);
            this.messages.push({
              id: mensagem.id,
              foi_usuario: mensagem.foi_usuario,
              text: mensagem.texto,
            });
          });
        }
      },
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  enviarMensagem() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ foi_usuario: true, text: this.newMessage });

      this.mensagemService
        .enviarMensagem(this.newMessage, true, new Date().toISOString())
        .subscribe({
          next: (response) => {
            console.log('Mensagem enviada com sucesso: ', response);
          },
          error: (error) => {
            console.error('Erro ao salvar mensagem do usuário:', error);
          },
        });

      this.mensagemService.enviarPrompt(this.newMessage, this.aiMode).subscribe({
        next: async (response) => {
          this.newBotMessage = response.output;
          console.log(response);
          this.messages.push({ foi_usuario: false, text: this.newBotMessage });
          this.mensagemService
            .enviarMensagem(this.newBotMessage, false, new Date().toISOString())
            .subscribe({
              next: (response) => {
                console.log('Mensagem do bot salva: ', response);
              },
              error: (error) => {
                console.error('Erro ao salvar mensagem do bot:', error);
              },
            });
          this.scrollToBottom();
        },
        error: (err) => {
          console.error('Erro ao enviar prompt: ', err);
        },
      });

      this.newMessage = '';
      this.scrollToBottom();

      this.firstMessage = false;
      this.aiMode = undefined;
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
    const option = this.newMessage.toLowerCase();
    console.log(option);
    if (option === 'casos clínicos') this.aiMode = 'MODO 1';
    else if (option === 'estudar por questões') this.aiMode = 'MODO 2';
    else this.aiMode = 'MODO 3';
    console.log(this.aiMode);
    this.messages = [];
    this.enviarMensagem();
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
}
