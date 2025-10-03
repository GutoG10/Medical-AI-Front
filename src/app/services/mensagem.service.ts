import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

    console.log('Enviando mensagem: ', payload);

    return this.http.post(
      'http://localhost:5678/webhook/f9689d3b-cb0e-435d-b8b7-120c61ddff4b',
      payload
    );
  }
}
