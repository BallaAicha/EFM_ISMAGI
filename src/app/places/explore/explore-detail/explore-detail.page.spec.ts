import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreDetailPage } from './explore-detail.page';

describe('ExploreDetailPage', () => {
  let component: ExploreDetailPage;
  let fixture: ComponentFixture<ExploreDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExploreDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
