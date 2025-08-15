import { HelloProps } from '../../domain/entities/hello.entity';
export interface IHelloRepository {
  save(helloProps: HelloProps): void;
}
