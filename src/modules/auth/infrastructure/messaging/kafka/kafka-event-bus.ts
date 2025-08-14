import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EventBusPort } from '../../../application/ports/event-bus.port';

export class KafkaEventBus implements EventBusPort, OnModuleInit {
  constructor(@Inject('KAFKA_CLIENT') private readonly client: ClientKafka) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async publish(topic: string, payload: unknown): Promise<void> {
    // Nest ClientKafka produce con .emit o .send; emit -> fire-and-forget
    this.client.emit(topic, payload); // integration event
  }
}
