import { Logger } from "@nestjs/common";
import { IHelloProvider } from "../../application/contract/hello-provider.contract";

export class SmsAwsSnsProvider implements IHelloProvider {
    private readonly logger = new Logger(SmsAwsSnsProvider.name);
  sendSMS(): void {
    this.logger.log('Sending SMS using AWS SNS...');
  }
}