import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReportingPageComponent } from './new-reporting-page.component';

describe('NewReportingPageComponent', () => {
  let component: NewReportingPageComponent;
  let fixture: ComponentFixture<NewReportingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewReportingPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewReportingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
