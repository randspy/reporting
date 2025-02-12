import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import '@testing-library/jest-dom';

setupZoneTestEnv();

// Suppress the warning about the CDK overlay container
// no time to fix this, it's not a problem for the tests
let consoleSpy: jest.SpyInstance;
beforeAll(() => {
  consoleSpy = jest
    .spyOn(global.console, 'error')
    .mockImplementation((message) => {
      if (!message?.message?.includes('Could not parse CSS stylesheet')) {
        global.console.warn(message);
      }
    });
});

afterAll(() => consoleSpy.mockRestore());
