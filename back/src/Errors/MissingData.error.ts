export class MissingDataError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'MissingDataError';
  }
}
