import { Injectable, Logger, NestInterceptor } from "@nestjs/common";

@Injectable()
export class HelloInterceptor implements NestInterceptor {
    private readonly logger = new Logger(HelloInterceptor.name);
    intercept(context, next) {
        this.logger.log("Hello from interceptor");
        return next.handle();
    }

}