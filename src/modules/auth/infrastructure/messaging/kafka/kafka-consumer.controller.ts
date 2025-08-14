import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

// Ejemplo: otro bounded context publica "billing.invoice.created"
@Controller()
export class KafkaConsumerController {
  @EventPattern('billing.invoice.created')
  async onInvoiceCreated(@Payload() message: any) {
    // traducir Integration Event -> comando/caso de uso interno si aplica
    // e.g. this.someUseCase.execute(message.value)
  }
}
