import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciamentoUsuariosComponent } from './gerenciamento-usuarios-component';

describe('GerenciamentoUsuariosComponent', () => {
  let component: GerenciamentoUsuariosComponent;
  let fixture: ComponentFixture<GerenciamentoUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciamentoUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciamentoUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
