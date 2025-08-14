import * as bcrypt from 'bcrypt';
import { PasswordHasherPort } from '../../application/ports/password-hasher.port';

export class BcryptPasswordHasher implements PasswordHasherPort {
  private readonly rounds = 10;
  hash(plain: string): Promise<string> { return bcrypt.hash(plain, this.rounds); }
  compare(plain: string, hash: string): Promise<boolean> { return bcrypt.compare(plain, hash); }
}
