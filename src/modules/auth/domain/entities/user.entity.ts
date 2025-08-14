import { Email } from '../value-objects/email.vo';

export interface UserProps {
  id: string;
  email: Email;
  passwordHash: string;
  createdAt: Date;
}

export class User {
  private domainEvents: any[] = [];
  private constructor(private props: UserProps) {}

  static register(params: { id: string; email: string; passwordHash: string; now?: Date }) {
    const user = new User({
      id: params.id,
      email: Email.create(params.email),
      passwordHash: params.passwordHash,
      createdAt: params.now ?? new Date(),
    });
    return user;
  }

  get id() { return this.props.id; }
  get email() { return this.props.email; }
  get passwordHash() { return this.props.passwordHash; }
  get createdAt() { return this.props.createdAt; }

  pullDomainEvents(): any[] { const out = this.domainEvents; this.domainEvents = []; return out; }
  addDomainEvent(evt: any) { this.domainEvents.push(evt); }

  confirmRegistered() {/* hook if needed */}
}
