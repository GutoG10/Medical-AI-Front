import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPromptsComponent } from './cadastro-prompts-component';

describe('CadastroPromptsComponent', () => {
  let component: CadastroPromptsComponent;
  let fixture: ComponentFixture<CadastroPromptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroPromptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroPromptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
