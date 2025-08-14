import { UserRepositoryPort } from '../../../application/ports/user-repository.port';
import { User } from '../../../domain/entities/user.entity';

export class UserInMemoryRepository implements UserRepositoryPort {
  private byId = new Map<string, User>();
  private byEmail = new Map<string, User>();

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(this.byEmail.get(email.toLowerCase()) ?? null);
  }
  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.byId.get(id) ?? null);
  }
  async save(user: User): Promise<void> {
    this.byId.set(user.id, user);
    this.byEmail.set(user.email.value, user);
  }
}
