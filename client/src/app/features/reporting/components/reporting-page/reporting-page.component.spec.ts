import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReportingService } from '../../services/reporting.service';
import { ReportingPageComponent } from './reporting-page.component';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { LoaderComponent } from '../../../../ui/components/loader/loader.component';
import { generateReporting } from '../../../../../tests/object-generators';

describe('ReportingPageComponent', () => {
  let component: ReportingPageComponent;
  let fixture: ComponentFixture<ReportingPageComponent>;
  let reportingService: jest.Mocked<ReportingService>;
  let router: Router;

  beforeEach(async () => {
    const reportingServiceMock = {
      getReportings: jest.fn().mockReturnValue(of([])),
      isGetMethodLoading: jest.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [ReportingPageComponent],
      providers: [
        provideRouter([]),
        { provide: ReportingService, useValue: reportingServiceMock },
      ],
    }).compileComponents();

    reportingService = TestBed.inject(
      ReportingService,
    ) as jest.Mocked<ReportingService>;
    router = TestBed.inject(Router);
    router.navigate = jest.fn();
    fixture = TestBed.createComponent(ReportingPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the loader when the reportings are loading', () => {
    reportingService.isGetMethodLoading.mockReturnValue(true);
    fixture.detectChanges();

    const element = fixture.debugElement.nativeElement;
    expect(element.textContent).not.toContain('John');
    expect(element.textContent).not.toContain('Doe');
    expect(element.textContent).not.toContain('john.doe@example.com');
    expect(loader()).toBeTruthy();
    expect(noReportings()).toBeFalsy();
  });

  it('should display the reportings when they are loaded', () => {
    reportingService.getReportings.mockReturnValue(
      of([
        generateReporting({
          id: 1,
          author: {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            birth_date: '1990-01-01',
            sex: 'male',
          },
          description: 'Description',
          observations: [],
        }),
      ]),
    );
    fixture.detectChanges();

    const element = fixture.debugElement.nativeElement;
    expect(element.textContent).toContain('John');
    expect(element.textContent).toContain('Doe');
    expect(element.textContent).toContain('john.doe@example.com');
    expect(noReportings()).toBeFalsy();
    expect(loader()).toBeFalsy();
  });

  it('should display message when no reportings are found', () => {
    reportingService.getReportings.mockReturnValue(of([]));
    fixture.detectChanges();

    const element = fixture.debugElement.nativeElement;
    expect(element.textContent).not.toContain('John');
    expect(element.textContent).not.toContain('Doe');
    expect(element.textContent).not.toContain('john.doe@example.com');
    expect(noReportings()).toBeTruthy();
    expect(loader()).toBeFalsy();
  });

  it('should have a link to the new reporting page', async () => {
    reportingService.getReportings.mockReturnValue(of([]));

    fixture.detectChanges();
    await fixture.whenStable();

    const linkElement = fixture.debugElement.query(
      By.css('[data-testid="new-reporting-link"]'),
    );
    expect(linkElement.attributes['ng-reflect-router-link']).toBe('new');
  });

  it('should have a link to existing reporting', async () => {
    reportingService.getReportings.mockReturnValue(
      of([generateReporting({ id: 1 })]),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    const linkElement = fixture.debugElement.query(
      By.css('[data-testid="existing-reporting-link"]'),
    );
    expect(linkElement.attributes['ng-reflect-router-link']).toBe('1');
  });

  const loader = () =>
    fixture.debugElement.query(By.directive(LoaderComponent));
  const noReportings = () =>
    fixture.debugElement.query(By.css('[data-testid="no-reportings"]'));

  it('should display the no reportings message when the reportings are empty', () => {
    reportingService.getReportings.mockReturnValue(of([]));
    fixture.detectChanges();
    expect(noReportings()).toBeTruthy();
  });
});
