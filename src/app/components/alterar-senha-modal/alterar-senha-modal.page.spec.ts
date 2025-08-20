import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlterarSenhaModalPage } from './alterar-senha-modal.page';

describe('AlterarSenhaModalPage', () => {
  let component: AlterarSenhaModalPage;
  let fixture: ComponentFixture<AlterarSenhaModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterarSenhaModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
