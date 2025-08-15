import { Logger } from "@nestjs/common";
import { IHelloProvider } from "../../application/contract/hello-provider.contract";

export class SmsAldeamoProvider implements IHelloProvider {
  private readonly logger = new Logger(SmsAldeamoProvider.name);
  sendSMS(): void {
    this.logger.log('Sending SMS using Aldeamo...');
  }
}
