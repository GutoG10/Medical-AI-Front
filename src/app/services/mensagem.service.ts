import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PromptOutput } from '../../interfaces/prompt-output.interface';

@Injectable({
  providedIn: 'root',
})
export class MensagemService {
  constructor(private http: HttpClient) {}

  enviarMensagem(
    texto: string,
    foi_usuario: boolean,
    usuario_id: string,
    horario: string,
    imagem?: string
  ) {
    const payload = {
      usuario_id,
      horario,
      texto,
      imagem: imagem || '',
      foi_usuario,
    };
    return this.http.post(
      'http://localhost:5678/webhook/f9689d3b-cb0e-435d-b8b7-120c61ddff4b',
      payload
    );
  }

  enviarPrompt(texto: string) {
    const payload = {
      usuario_id: localStorage.getItem('usuario_id'),
      prompt: texto,
      modo: 'MODO 2',
    };

    return this.http.post<PromptOutput>(
      'http://localhost:5678/webhook/f217499f-9fa2-46e8-9283-540736845070',
      payload
    );
  }
}
