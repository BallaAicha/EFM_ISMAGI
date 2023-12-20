import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfferItemPage } from './offer-item.page';

describe('OfferItemPage', () => {
  let component: OfferItemPage;
  let fixture: ComponentFixture<OfferItemPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OfferItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
