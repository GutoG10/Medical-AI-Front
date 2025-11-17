import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-component.html',
})
export class SidebarComponent {
  constructor(
    public chatService: ChatService,
    public sidebarService: SidebarService
  ) { }

  novoChat() {
    this.chatService.novoChat();
    if (window.innerWidth < 1024) this.sidebarService.close();
  }
}
