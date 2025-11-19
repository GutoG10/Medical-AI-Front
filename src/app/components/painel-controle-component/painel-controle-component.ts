import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-painel-controle-component',
  standalone: true,
  imports: [NgClass, RouterOutlet],
  templateUrl: './painel-controle-component.html'
})
export class PainelControleComponent {

  constructor(private router: Router, private route: ActivatedRoute) { }

  sidebarAberta = false;
  itemAtivo = 'Dashboard';

  // === BOTÕES DO MENU ===
  botoes = [
    { nome: 'Dashboard', icone: 'assets/grafico.png', rota: 'dashboard' },
    { nome: 'Cadastro de Prompts', icone: 'assets/prompt.png', rota: 'cadastro-prompts' },
    { nome: 'Gerenciamento de Usuários', icone: 'assets/usuarios.png', rota: 'gerenciamento-usuarios' },
    { nome: 'Gerar Relatórios', icone: 'assets/relatorio.png', rota: 'gerar-relatorios' },
  ];

  // === NAVEGAÇÃO RELATIVA + ATIVAR BOTÃO ===
  navegar(btn: any) {
    this.itemAtivo = btn.nome;
    this.router.navigate([btn.rota], { relativeTo: this.route });
  }

  // === ABRIR/FECHAR AO CLICAR NO LOGO ===
  toggleSidebar(event: Event) {
    event.stopPropagation();
    this.sidebarAberta = !this.sidebarAberta;
  }

  // === PREVENIR FECHAR QUANDO CLICA DENTRO ===
  manterSidebarAberta(event: Event) {
    event.stopPropagation();
  }

  // === FECHAR AO CLICAR FORA ===
  fecharSidebar(event: Event) {
    if (this.sidebarAberta) {
      this.sidebarAberta = false;
    }
  }
}
