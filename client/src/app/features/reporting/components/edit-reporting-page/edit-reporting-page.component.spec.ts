import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReportingPageComponent } from './edit-reporting-page.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observation } from '../../domain/observation.types';
import { ReportingFormComponent } from '../reporting-form/reporting-form.component';
import { ReportingService } from '../../services/reporting.service';
import { By } from '@angular/platform-browser';
import { LoaderComponent } from '../../../../ui/components/loader/loader.component';
import { of, throwError } from 'rxjs';
import { Reporting } from '../../domain/reporting.types';
import { generateReporting } from '../../../../../tests/object-generators';

@Component({
  selector: 'app-reporting-form',
  template: '',
})
class MockReportingFormComponent {
  @Input() header!: string;
  @Input() observations!: Observation[];
  @Output() dismiss = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Input() reporting!: Reporting;
}

describe('EditReportingPageComponent', () => {
  let component: EditReportingPageComponent;
  let fixture: ComponentFixture<EditReportingPageComponent>;
  let router: jest.Mocked<Router>;
  let activatedRoute: ActivatedRoute;
  let reportingService: jest.Mocked<ReportingService>;

  beforeEach(async () => {
    const reportingServiceMock = {
      getReporting: jest.fn().mockReturnValue(of(null as unknown as Reporting)),
      isGetMethodLoading: jest.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [
        EditReportingPageComponent,
        NoopAnimationsModule,
        MockReportingFormComponent,
      ],
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        provideRouter([]),
        { provide: ReportingService, useValue: reportingServiceMock },
      ],
    })
      .overrideComponent(EditReportingPageComponent, {
        remove: {
          imports: [ReportingFormComponent],
        },
        add: {
          imports: [MockReportingFormComponent],
        },
      })
      .overrideComponent(EditReportingPageComponent, {
        set: {
          providers: [
            { provide: ReportingService, useValue: reportingServiceMock },
          ],
        },
      })
      .compileComponents();

    router = TestBed.inject(Router) as jest.Mocked<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);
    reportingService = TestBed.inject(
      ReportingService,
    ) as jest.Mocked<ReportingService>;

    fixture = TestBed.createComponent(EditReportingPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loader when reporting is loading', () => {
    reportingService.isGetMethodLoading.mockReturnValue(true);
    reportingService.getReporting.mockReturnValue(of(generateReporting()));
    fixture.detectChanges();

    expect(loader()).toBeTruthy();
    expect(reportingNotFound()).toBeFalsy();
    expect(reportingForm()).toBeFalsy();
  });

  it('should display reporting form when reporting is loaded', async () => {
    reportingService.getReporting.mockReturnValue(of(generateReporting()));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(reportingForm()).toBeTruthy();
    expect(reportingNotFound()).toBeFalsy();
    expect(loader()).toBeFalsy();
  });

  it('should display reporting not found when reporting is not found', () => {
    reportingService.getReporting.mockReturnValue(throwError(() => ({})));
    fixture.detectChanges();

    expect(reportingNotFound()).toBeTruthy();
    expect(reportingForm()).toBeFalsy();
    expect(loader()).toBeFalsy();
  });

  it('should navigate to parent route on cancel', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    reportingService.getReporting.mockReturnValue(of(generateReporting()));

    fixture.detectChanges();
    mockedForm().dismiss.emit();

    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: activatedRoute,
    });
  });

  it('should navigate to parent route on save', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    reportingService.getReporting.mockReturnValue(of(generateReporting()));

    fixture.detectChanges();
    mockedForm().save.emit();

    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: activatedRoute,
    });
  });

  it('should pass correct inputs to form component', () => {
    reportingService.getReporting.mockReturnValue(of(generateReporting()));

    fixture.detectChanges();

    expect(mockedForm().header).toBe('Modifier Signalement');
    expect(mockedForm().observations).toEqual([
      { id: 1, name: 'Observation 1' },
      { id: 2, name: 'Observation 2' },
      { id: 3, name: 'Observation 3' },
    ]);
  });

  const loader = () =>
    fixture.debugElement.query(By.directive(LoaderComponent));

  const reportingNotFound = () => fixture.debugElement.query(By.css('p'));

  const reportingForm = () =>
    fixture.debugElement.query(By.directive(MockReportingFormComponent));

  const mockedForm = () =>
    fixture.debugElement.query(By.directive(MockReportingFormComponent))
      .componentInstance;
});
