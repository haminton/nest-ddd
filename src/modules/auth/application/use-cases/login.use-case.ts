import { Inject, Injectable } from '@nestjs/common';
import { Result, ok, err } from '../../../../shared/utils/result';
import { TOKENS } from 'src/shared/constant/tokens';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import type { PasswordHasherPort } from '../ports/password-hasher.port';

type Output = { userId: string; email: string };
type LoginError = { reason: 'INVALID_CREDENTIALS' };

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(TOKENS.USER_REPOSITORY) private readonly users: UserRepositoryPort,
    @Inject(TOKENS.PASSWORD_HASHER) private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(input: { email: string; password: string }): Promise<Result<Output, LoginError>> {
    const user = await this.users.findByEmail(input.email);
    if (!user) return err({ reason: 'INVALID_CREDENTIALS' });
    const okPass = await this.hasher.compare(input.password, user.passwordHash);
    if (!okPass) return err({ reason: 'INVALID_CREDENTIALS' });
    return ok({ userId: user.id, email: user.email.value });
  }
}
