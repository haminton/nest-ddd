
export interface HelloProps {
  message: string;
}

export class Hello {
  private constructor(private props: HelloProps) {}

  static create(params: { message: string }) {
    const hello = new Hello({
      message: params.message,
    });
    return hello;
  }

  get message() { return this.props.message; }
  set message(msg: string) { this.props.message = msg;}
}
