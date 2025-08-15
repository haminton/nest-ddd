import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class Events {
  private readonly logger = new Logger(Events.name);
  constructor(
    //TODO: Inject the kafka
  ) {}

   async onModuleInit() {
    this.logger.log('HelloModule kafka initialized');
  }

  async sendMessaging(input: any) {
    this.logger.log('Sending message en evento:', input);
  } 

  async processEvent(event: any) {
    this.logger.log('Processing event:', event);
  }
    
}
