import crypto from 'crypto';

// in reality it should be a UUID, but to be consistent with the apis I use numeric ids
export function generateId(): number {
  return crypto.randomInt(1, 281474976710655);
}

export function sleep(ms: number = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
