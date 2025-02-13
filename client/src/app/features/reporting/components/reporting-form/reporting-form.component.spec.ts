import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReportingFormComponent } from './reporting-form.component';
import { ReportingService } from '../../services/reporting.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatChipListboxHarness } from '@angular/material/chips/testing';
import { of, throwError } from 'rxjs';
import {
  generateReporting,
  generateObservation,
} from '../../../../../tests/object-generators';
import { By } from '@angular/platform-browser';

describe('ReportingFormComponent', () => {
  let component: ReportingFormComponent;
  let fixture: ComponentFixture<ReportingFormComponent>;
  let loader: HarnessLoader;
  let saveReportingSpy: jest.SpyInstance;
  let isLoadingSpy: jest.SpyInstance;

  beforeEach(async () => {
    saveReportingSpy = jest.fn();
    isLoadingSpy = jest.fn();
    await TestBed.configureTestingModule({
      imports: [ReportingFormComponent, NoopAnimationsModule],
      providers: [
        {
          provide: ReportingService,
          useValue: {
            isLoading: isLoadingSpy,
            saveReporting: saveReportingSpy,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportingFormComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.componentRef.setInput('observations', [
      generateObservation({ id: 1, name: 'Observation 1' }),
      generateObservation({ id: 2, name: 'Observation 2' }),
    ]);
  });

  describe('new form', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should save reporting', async () => {
      saveReportingSpy.mockReturnValue(of(null));
      let emitted = false;
      component.save.subscribe(() => (emitted = true));

      await setInputValue('last_name', 'Doe');
      await setInputValue('first_name', 'John');
      await setInputValue('birth_date', '1990-01-01');
      await setSexOption('Homme');
      await setInputValue('email', 'john.doe@example.com');
      await setInputValue('description', 'This is a test description');
      await selectChips(['Observation 2']);

      await saveReporting();

      expect(emitted).toBe(true);
      expect(saveReportingSpy).toHaveBeenCalledWith({
        id: 0,
        author: {
          last_name: 'Doe',
          first_name: 'John',
          birth_date: '1990-01-01',
          sex: 'Homme',
          email: 'john.doe@example.com',
        },
        description: 'This is a test description',
        observations: [2],
      });
      expect(await (await saveButton()).isDisabled()).toBe(false);
      expect(fixture.debugElement.query(By.css('app-loader'))).toBeFalsy();
    });

    it('should set loading to true when saving', async () => {
      saveReportingSpy.mockReturnValue(of(null));
      isLoadingSpy.mockReturnValue(true);

      await saveReporting();

      expect(await (await saveButton()).isDisabled()).toBe(true);
      expect(fixture.debugElement.query(By.css('app-loader'))).toBeTruthy();
    });

    it('should press cancel', async () => {
      let emitted = false;
      component.dismiss.subscribe(() => (emitted = true));

      const cancelButton = await loader.getHarness(
        MatButtonHarness.with({ text: 'Annuler' }),
      );

      await cancelButton.click();

      expect(emitted).toBe(true);
    });

    describe('Validation errors', () => {
      const tomorrow = () => new Date(Date.now() + 24 * 60 * 60 * 1000);
      const date101YearsAgo = () =>
        new Date(Date.now() - 101 * 365 * 24 * 60 * 60 * 1000);

      it.each([
        ['last_name', '', 'Le nom est requis'],
        [
          'last_name',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do ei',
          'Le nom ne doit pas dépasser 50 caractères',
        ],
        ['first_name', '', 'Le prénom est requis'],
        [
          'first_name',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do ei',
          'Le prénom ne doit pas dépasser 50 caractères',
        ],
        ['birth_date', '', 'La date de naissance est requise'],
        [
          'birth_date',
          tomorrow().toLocaleDateString('us'),
          'La date de naissance doit être dans le passé',
        ],
        [
          'birth_date',
          date101YearsAgo().toLocaleDateString('us'),
          'La date de naissance ne peut pas être antérieure à 100 ans',
        ],
        ['email', '', "L'email est requis"],
        ['email', 'invalid-email', "L'email n'est pas valide"],
      ])(
        'should show validation error for %s: %s -> %s',
        async (field, value, expectedError) => {
          await setInputValue(field, value);
          expect(await getErrorMessage(field)).toBe(expectedError);
        },
      );

      it('should show error when sex is not selected', async () => {
        const select = await loader.getHarness(MatSelectHarness);
        await select.open();
        await select.close();
        expect(await getErrorMessage('sex')).toBe('Le sexe est requis');
      });

      it('should show error when email is already used', async () => {
        saveReportingSpy.mockReturnValueOnce(
          throwError(() => ({
            author: {
              email: 'Cette adresse email est déjà utilisée',
            },
          })),
        );

        await setInputValue('last_name', 'Doe');
        await setInputValue('first_name', 'John');
        await setInputValue('birth_date', '1990-01-01');
        await setSexOption('Homme');
        await setInputValue('email', 'john.doe@example.com');

        await saveReporting();

        expect(await getErrorMessage('email')).toBe(
          'Cette adresse email est déjà utilisée',
        );
        expect(saveReportingSpy).toHaveBeenCalled();
      });
    });

    it('should show validation errors on save', async () => {
      await saveReporting();

      expect(await getErrorMessage('last_name')).toBe('Le nom est requis');
    });
  });

  describe('prefilled form', () => {
    beforeEach(() => {
      fixture.componentRef.setInput(
        'reporting',
        generateReporting({
          author: {
            last_name: 'Doe',
            first_name: 'John',
            birth_date: '1990-01-01',
            sex: 'Homme',
            email: 'john.doe@example.com',
          },
          description: 'This is a test description',
          observations: [1, 2],
        }),
      );
      fixture.detectChanges();
    });

    it('should show prefilled form', async () => {
      expect(await getInputValue('last_name')).toBe('Doe');
      expect(await getInputValue('first_name')).toBe('John');
      expect(await getInputValue('birth_date')).toBe('1/1/1990');
      expect(await getSelectValue()).toBe('Homme');
      expect(await getInputValue('email')).toBe('john.doe@example.com');
      expect(await getInputValue('description')).toBe(
        'This is a test description',
      );
      expect(await getChips()).toEqual(['Observation 1', 'Observation 2']);
    });
  });

  const getErrorMessage = async (fieldPath: string): Promise<string> => {
    const formFields = await loader.getAllHarnesses(MatFormFieldHarness);

    for (const formField of formFields) {
      const input = (await formField.getControl()) as MatInputHarness;
      const inputEl = await input.host();
      const controlName = await inputEl.getAttribute('formcontrolname');

      if (controlName === fieldPath) {
        const errors = await formField.getTextErrors();
        return errors[0] ?? '';
      }
    }

    return '';
  };

  const setInputValue = async (fieldPath: string, value: string) => {
    const input = await loader.getHarness(
      MatInputHarness.with({
        selector: `[formControlName="${fieldPath}"]`,
      }),
    );
    await input.setValue(value);
    await input.blur();
  };

  const setSexOption = async (value: string) => {
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    await select.clickOptions({ text: value });
    await select.close();
  };

  const selectChips = async (values: string[]) => {
    const chipList = await loader.getHarness(MatChipListboxHarness);
    const chips = await chipList.getChips();

    for (const chip of chips) {
      const text = await chip.getText();
      if (values.includes(text)) {
        await chip.toggle();
      }
    }
  };

  const saveButton = async () => {
    return await loader.getHarness(
      MatButtonHarness.with({ selector: 'button[type="submit"]' }),
    );
  };

  const saveReporting = async () => {
    const button = await saveButton();
    await button.click();
  };

  const getInputValue = async (fieldPath: string) => {
    const input = await loader.getHarness(
      MatInputHarness.with({ selector: `[formControlName="${fieldPath}"]` }),
    );
    return await input.getValue();
  };

  const getSelectValue = async () => {
    const select = await loader.getHarness(MatSelectHarness);
    return await select.getValueText();
  };

  const getChips = async () => {
    const chipList = await loader.getHarness(MatChipListboxHarness);
    const chips = await chipList.getChips();
    return await Promise.all(chips.map((chip) => chip.getText()));
  };
});
