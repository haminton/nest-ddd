import { UserRegisteredDomainEvent } from '../../domain/events/user-registered.event';

export type IntegrationEvent = { topic: string; key?: string; payload: any };

export class IntegrationEventsMapper {
  static fromUserRegistered(evt: UserRegisteredDomainEvent): IntegrationEvent {
    return {
      topic: 'auth.user.registered',   // nombre de topic Kafka (convención)
      key: evt.userId,                 // opcional: particionado por key
      payload: { userId: evt.userId, email: evt.email, occurredAt: evt.occurredAt.toISOString() },
    };
  }
}
