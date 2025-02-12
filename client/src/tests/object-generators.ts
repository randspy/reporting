import { Reporting } from '../app/features/reporting/domain/reporting.types';

export function generateReporting(
  reporting: Partial<Reporting> = {},
): Reporting {
  return {
    id: 1,
    author: {
      first_name: 'test-first-name',
      last_name: 'test-last-name',
      birth_date: 'test-birth-date',
      sex: 'test-sex',
      email: 'test-email',
    },
    description: 'test-description',
    observations: [1, 2, 3],
    ...reporting,
  };
}
