import { Module } from '@nestjs/common';
import { HelloUseCase } from './application/use-cases/hello.use-case';
import { HelloController } from './interface/hello.controller';
import { TOKENS } from 'src/shared/constant/tokens';
import { HelloRepository } from './infrastructure/persistence/hello.repository';
import { HelloService } from './domain/services/hello.service';
import { Events } from 'src/shared/utils/events';
import { SmsAwsSnsProvider } from './infrastructure/provider/sms-aws-sns.provider';

@Module({
    imports: [],
    controllers: [HelloController],

    providers: [
        HelloUseCase,
        Events,
        { provide: TOKENS.HELLO_REPOSITORY, useClass: HelloRepository },
        { provide: TOKENS.HELLO_SERVICE, useClass: HelloService },
        { provide: TOKENS.HELLO_PROVIDER, useClass: SmsAwsSnsProvider },
    ],
    exports: [],
})
export class HelloModule {}
