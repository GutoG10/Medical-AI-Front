import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header-component.html',
})
export class HeaderComponent {

  constructor(private sidebarService: SidebarService) { }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  abrirPerfil() {
    console.log('Abrir perfil do usuário');
  }
}
