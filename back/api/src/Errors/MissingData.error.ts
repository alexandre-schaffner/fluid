export class MissingDataError extends Error {
  constructor(message?: string) {
    super('Missing ' + message);
    this.name = 'MissingDataError';
  }
}
