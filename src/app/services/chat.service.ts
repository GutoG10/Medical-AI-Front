import { Injectable, signal } from '@angular/core';

export interface Chat {
  id: number;
  nome: string;
  criadoEm: Date;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private chatsSignal = signal<Chat[]>([]);
  chats = this.chatsSignal.asReadonly();
  private contador = 1;

  novoChat() {
    const novo = {
      id: this.contador++,
      nome: `Chat ${this.contador - 1}`,
      criadoEm: new Date()
    };
    this.chatsSignal.update(chats => [...chats, novo]);
  }
}
