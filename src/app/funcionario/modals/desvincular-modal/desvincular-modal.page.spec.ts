import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesvincularModalPage } from './desvincular-modal.page';

describe('DesvincularModalPage', () => {
  let component: DesvincularModalPage;
  let fixture: ComponentFixture<DesvincularModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesvincularModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
