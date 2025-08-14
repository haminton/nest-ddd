import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { LoginDto, RegisterUserDto } from '../application/dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly login: LoginUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const res = await this.registerUser.execute(dto);
    if (!res.ok) throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    return res.value;
  }

  @Post('login')
  async doLogin(@Body() dto: LoginDto) {
    const res = await this.login.execute(dto);
    if (!res.ok) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return res.value;
  }
}
