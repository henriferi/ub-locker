import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutConfirmModalPage } from './logout-confirm-modal.page';

describe('LogoutConfirmModalPage', () => {
  let component: LogoutConfirmModalPage;
  let fixture: ComponentFixture<LogoutConfirmModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutConfirmModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
