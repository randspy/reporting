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

  beforeEach(async () => {
    const routerMock = {
      navigate: jest.fn(),
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
      ],
    })
      .overrideComponent(NewReportingPageComponent, {
        remove: { imports: [ReportingFormComponent] },
        add: { imports: [MockReportingFormComponent] },
      })
      .compileComponents();

    router = TestBed.inject(Router) as jest.Mocked<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(NewReportingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

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
    expect(mockForm.header).toBe('Nouveau Signalement');
    expect(mockForm.observations).toEqual([
      { id: 1, name: 'Observation 1' },
      { id: 2, name: 'Observation 2' },
      { id: 3, name: 'Observation 3' },
    ]);
  });
});
