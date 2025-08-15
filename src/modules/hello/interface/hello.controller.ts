import { Body, Controller, Logger, Post, UseInterceptors } from '@nestjs/common';
import { HelloUseCase } from '../application/use-cases/hello.use-case';
import { HelloDto } from '../application/dto/hello.dto';
import { Events } from 'src/shared/utils/events';
import { HelloInterceptor } from 'src/shared/interceptors/hello.interceptors';

@Controller('hello')
@UseInterceptors(HelloInterceptor)
export class HelloController {
    private readonly logger = new Logger(HelloController.name);
    constructor(
        private readonly helloUseCase: HelloUseCase,
        private readonly event: Events, // Injecting the Events for handling events
    ) { }

    @Post('world')
    async hello(@Body() dto: HelloDto) {
        this.logger.log('Received hello request with message:', dto.message);
        this.event.sendMessaging("Hello kafka event");
        const res = await this.helloUseCase.execute(dto);
        return res;
    }

}
