import { DomainEvent } from './domain-event';

export class UserRegisteredDomainEvent implements DomainEvent {
  readonly name = 'user.registered';
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
