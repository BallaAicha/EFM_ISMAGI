import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MybookingsPage } from './mybookings.page';

describe('MybookingsPage', () => {
  let component: MybookingsPage;
  let fixture: ComponentFixture<MybookingsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MybookingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
