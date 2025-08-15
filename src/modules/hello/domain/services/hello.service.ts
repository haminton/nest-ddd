import { Inject, Logger, NotFoundException } from "@nestjs/common";
import type { IHelloRepository } from "../../application/contract/hello-repository.contract";
import { IHelloService } from "../../application/contract/hello-service.contract";
import { TOKENS } from "src/shared/constant/tokens";
import { Hello } from "../entities/hello.entity";

export class HelloService implements IHelloService {

    private readonly logger = new Logger(HelloService.name);

    constructor(
        @Inject(TOKENS.HELLO_REPOSITORY) private readonly helloRepository: IHelloRepository
    ) { }
    
    greeting(message: string): any {
        this.logger.log(`Greeting created with message in HelloService: ${message}`);
        const hello: Hello = Hello.create({ message });
        this.helloRepository.save(hello);
        // return new NotFoundException(`Hello with message "${message}" not found`);;
        return {
            code: 100,
            message: 'Exitoso',
            data: `Hello, ${hello.message}!`
        };
    }
}
