import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Result, ok, err } from '../../../../shared/utils/result';
import { User } from '../../domain/entities/user.entity';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import type { EventBusPort } from '../ports/event-bus.port';
import { UserRegisteredDomainEvent } from '../../domain/events/user-registered.event';
import { IntegrationEventsMapper } from '../mappings/integration-events.mapper';
import { TOKENS } from 'src/shared/constant/tokens';

type Output = { userId: string };
type AlreadyExists = { reason: 'EMAIL_TAKEN' };

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(TOKENS.USER_REPOSITORY) private readonly users: UserRepositoryPort,
    @Inject(TOKENS.PASSWORD_HASHER) private readonly hasher: PasswordHasherPort,
    @Inject(TOKENS.EVENT_BUS) private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: { email: string; password: string }): Promise<Result<Output, AlreadyExists>> {
    const exists = await this.users.findByEmail(input.email);
    if (exists) return err({ reason: 'EMAIL_TAKEN' });

    const passwordHash = await this.hasher.hash(input.password);
    const user = User.register({ id: uuid(), email: input.email, passwordHash });

    // Domain event
    const evt = new UserRegisteredDomainEvent(user.id, user.email.value);
    user.addDomainEvent(evt);

    await this.users.save(user);

    // Publica Integration Event en Kafka (mapeo desde el domain event)
    const integration = IntegrationEventsMapper.fromUserRegistered(evt);
    await this.eventBus.publish(integration.topic, integration.payload);

    return ok({ userId: user.id });
  }
}
