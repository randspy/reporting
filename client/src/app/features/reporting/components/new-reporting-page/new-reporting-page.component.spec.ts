import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewReportingPageComponent } from './new-reporting-page.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observation } from '../../domain/observation.types';
import { By } from '@angular/platform-browser';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ReportingFormComponent } from '../reporting-form/reporting-form.component';
import { ObservationsService } from '../../services/observations.service';
import { of } from 'rxjs';
import { generateObservation } from '../../../../../tests/object-generators';
@Component({
  selector: 'app-reporting-form',
  template: '',
})
class MockReportingFormComponent {
  @Input() header!: string;
  @Input() observations!: Observation[];
  @Output() dismiss = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
}

describe('NewReportingPageComponent', () => {
  let component: NewReportingPageComponent;
  let fixture: ComponentFixture<NewReportingPageComponent>;
  let router: jest.Mocked<Router>;
  let activatedRoute: ActivatedRoute;
  let mockForm: MockReportingFormComponent;
  let observationsService: jest.Mocked<ObservationsService>;

  beforeEach(async () => {
    const routerMock = {
      navigate: jest.fn(),
    };

    const observationsServiceMock = {
      getObservations: jest.fn().mockReturnValue(of([] as Observation[])),
    };

    await TestBed.configureTestingModule({
      imports: [
        NewReportingPageComponent,
        NoopAnimationsModule,
        MockReportingFormComponent,
      ],
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: {} },
        },
        { provide: ObservationsService, useValue: observationsServiceMock },
      ],
    })
      .overrideComponent(NewReportingPageComponent, {
        remove: { imports: [ReportingFormComponent] },
        add: { imports: [MockReportingFormComponent] },
      })
      .compileComponents();

    router = TestBed.inject(Router) as jest.Mocked<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);
    observationsService = TestBed.inject(
      ObservationsService,
    ) as jest.Mocked<ObservationsService>;

    fixture = TestBed.createComponent(NewReportingPageComponent);
    component = fixture.componentInstance;

    const formDebugElement = fixture.debugElement.query(
      By.directive(MockReportingFormComponent),
    );
    mockForm = formDebugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to parent route on cancel', () => {
    mockForm.dismiss.emit();

    expect(router.navigate).toHaveBeenCalledWith(['../'], {
      relativeTo: activatedRoute,
    });
  });

  it('should navigate to parent route on save', () => {
    mockForm.save.emit();

    expect(router.navigate).toHaveBeenCalledWith(['../'], {
      relativeTo: activatedRoute,
    });
  });

  it('should pass correct inputs to form component', () => {
    const observations = [generateObservation()];

    observationsService.getObservations.mockReturnValue(of(observations));

    fixture.detectChanges();

    expect(mockedForm().observations).toEqual(observations);
  });

  const mockedForm = () =>
    fixture.debugElement.query(By.directive(MockReportingFormComponent))
      .componentInstance;
});
