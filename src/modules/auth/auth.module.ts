import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';

import { BcryptPasswordHasher } from './infrastructure/hashing/bcrypt-password-hasher';
import { UserInMemoryRepository } from './infrastructure/persistence/in-memory/user.in-memory-repository';

import { KafkaEventBus } from './infrastructure/messaging/kafka/kafka-event-bus';
import { KafkaConsumerController } from './infrastructure/messaging/kafka/kafka-consumer.controller';
import { AuthController } from './interface/auth.controller';
import { TOKENS } from 'src/shared/constant/tokens';

@Module({
  imports: [
    // Cliente Kafka para publicar (y para respuestas si usas send)
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: { clientId: 'auth', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] },
          consumer: { groupId: 'auth-consumer' }, // requerido para suscribirse
        },
      },
    ]),
  ],
  controllers: [AuthController, KafkaConsumerController],
  providers: [
    // Use cases
    RegisterUserUseCase,
    LoginUseCase,

    // Ports bindings
    { provide: TOKENS.PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKENS.USER_REPOSITORY, useClass: UserInMemoryRepository },
    { provide: TOKENS.EVENT_BUS, useClass: KafkaEventBus },
  ],
})
export class AuthModule {}
