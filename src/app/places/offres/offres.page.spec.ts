import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OffresPage } from './offres.page';

describe('OffresPage', () => {
  let component: OffresPage;
  let fixture: ComponentFixture<OffresPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OffresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
