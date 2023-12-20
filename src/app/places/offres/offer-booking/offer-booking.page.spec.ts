import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfferBookingPage } from './offer-booking.page';

describe('OfferBookingPage', () => {
  let component: OfferBookingPage;
  let fixture: ComponentFixture<OfferBookingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OfferBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
