import { Inject, Injectable, Logger } from '@nestjs/common';
import { HelloDto } from '../dto/hello.dto';
import type { IHelloService } from '../contract/hello-service.contract';
import { TOKENS } from 'src/shared/constant/tokens';
import type { IHelloProvider } from '../contract/hello-provider.contract';

@Injectable()
export class HelloUseCase {
  private readonly logger = new Logger(HelloUseCase.name);
  constructor(
    @Inject(TOKENS.HELLO_SERVICE) private readonly helloService: IHelloService, 
    @Inject(TOKENS.HELLO_PROVIDER) private readonly helloProvider: IHelloProvider
  ) {}

  async execute(input: HelloDto) {

    const { message } = input;
    this.logger.log('Executing hello use case with message: ', message);
    this.helloProvider.sendSMS();
    return this.helloService.greeting(message);
  }
}
