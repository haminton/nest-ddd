import { IsNotEmpty } from 'class-validator';
export class HelloDto {

    @IsNotEmpty()
    message: string;

}