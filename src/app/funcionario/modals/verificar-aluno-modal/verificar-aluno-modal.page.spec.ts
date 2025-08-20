import { ComponentFixture, TestBed } from '@angular/core/testing';
import { verificarAlunoModalPage } from './verificar-aluno-modal.page';

describe('verificarAlunoModalPage', () => {
  let component: verificarAlunoModalPage;
  let fixture: ComponentFixture<verificarAlunoModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(verificarAlunoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
