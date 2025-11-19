import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerarRelatoriosComponent } from './gerar-relatorios-component';

describe('GerarRelatoriosComponent', () => {
  let component: GerarRelatoriosComponent;
  let fixture: ComponentFixture<GerarRelatoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerarRelatoriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerarRelatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
