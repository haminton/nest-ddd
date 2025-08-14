export interface DomainEvent {
  name: string;           // e.g. 'user.registered'
  occurredAt: Date;
  // aggregateId, etc. según tus necesidades
}
