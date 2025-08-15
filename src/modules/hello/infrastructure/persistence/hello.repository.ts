import { Logger } from "@nestjs/common";
import { IHelloRepository } from "../../application/contract/hello-repository.contract";
import { HelloProps } from "../../domain/entities/hello.entity";

export class HelloRepository implements IHelloRepository {
  private readonly logger = new Logger(HelloRepository.name);
  save(message: HelloProps): void {
    this.logger.log(`Saving message in HelloRepository: ${message.message}`);
  }
}
