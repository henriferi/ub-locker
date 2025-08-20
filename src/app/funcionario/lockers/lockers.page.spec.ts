import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LockersPage } from './lockers.page';

describe('LockersPage', () => {
  let component: LockersPage;
  let fixture: ComponentFixture<LockersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LockersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
