import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesvincularPage } from './desvincular.page';

describe('DesvincularPage', () => {
  let component: DesvincularPage;
  let fixture: ComponentFixture<DesvincularPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesvincularPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
