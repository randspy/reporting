import { Reporting } from './reporting.types';

export class ReportingStore {
  private reportings: Reporting[] = [];

  getAll(): Reporting[] {
    return this.reportings;
  }

  findById(id: number): Reporting | undefined {
    return this.reportings.find((r) => r.id === id);
  }

  findByEmail(email: string): Reporting | undefined {
    return this.reportings.find((r) => r.author.email === email);
  }

  add(reporting: Reporting): void {
    this.reportings.push(reporting);
  }

  update(id: number, reporting: Reporting): boolean {
    const index = this.reportings.findIndex((r) => r.id === id);
    if (index === -1) return false;

    this.reportings[index] = reporting;
    return true;
  }
}

export const reportingStore = new ReportingStore();
