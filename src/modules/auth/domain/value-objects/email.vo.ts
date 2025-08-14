export class Email {
  private constructor(private readonly _value: string) {}
  static create(raw: string): Email {
    const v = raw?.trim().toLowerCase();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v || !re.test(v)) throw new Error('Invalid email');
    return new Email(v);
  }
  get value(): string { return this._value; }
  equals(other: Email): boolean { return this._value === other._value; }
}
