import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-painel-controle-component',
  standalone: true,
  imports: [NgClass, RouterOutlet],
  templateUrl: './painel-controle-component.html'
})
export class PainelControleComponent {
  constructor(private router: Router) { }

  sidebarAberta = false;
  itemAtivo = 'Dashboard';

  navegar(rota: string) {
    this.itemAtivo = rota;
    this.router.navigate([rota]);
  }

  botoes: { nome: string; icone: string; rota: string }[] = [
    { nome: 'Dashboard', icone: 'assets/grafico.png', rota: 'dashboard' },
    { nome: 'Cadastro de Prompts', icone: 'assets/prompt.png', rota: 'cadastro-prompts' },
    { nome: 'Gerenciamento de Usuários', icone: 'assets/usuarios.png', rota: 'gerenciamento-usuarios' },
    { nome: 'Gerar Relatórios', icone: 'assets/relatorio.png', rota: 'gerar-relatorios' },
  ];

  selecionar(nome: string) {
    this.itemAtivo = nome;
    this.sidebarAberta = true;
  }

  manterSidebarAberta(event: Event) {
    event.stopPropagation();
  }

  fecharSidebar(event: Event) {
    if (this.sidebarAberta) {
      this.sidebarAberta = false;
    }
  }
}
