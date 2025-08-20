import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoricoModalPage } from './historico-modal.page';

describe('HistoricoModalPage', () => {
  let component: HistoricoModalPage;
  let fixture: ComponentFixture<HistoricoModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
