import { Component, NgModule, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { ChatService } from '../../services/chat.service';
import { HeaderComponent } from '../header-component/header-component';
import { SidebarComponent } from '../sidebar-component/sidebar-component';
import { NgClass } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout-home-component.html',
  imports: [SidebarComponent, RouterOutlet, NgClass, HeaderComponent],
})
export class LayoutHomeComponent implements OnInit {
  constructor(public sidebarService: SidebarService) {}

  private hasInitialized = false;

  ngOnInit() {
    this.adjustSidebar(window.innerWidth);

    window.addEventListener('resize', () => {
      if (!this.hasInitialized) return;
      if (window.innerWidth >= 1024) this.sidebarService.open();
    });

    this.hasInitialized = true;
  }

  private adjustSidebar(width: number) {
    if (width >= 1024) this.sidebarService.open();
    else this.sidebarService.close();
  }
}
