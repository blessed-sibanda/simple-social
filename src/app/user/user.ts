export interface ISignUp {
  name: string;
  email: string;
  password: string;
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  about: string;
  createdAt: string;
}

export class User implements IUser {
  constructor(
    public _id = '',
    public email = '',
    public name = '',
    public about = '',
    public createdAt = ''
  ) {}

  static Build(user: IUser): User {
    return new User(
      user._id,
      user.email,
      user.name,
      user.about ?? '',
      user.createdAt
    );
  }

  static BuildMany(users: IUser[]): User[] {
    return users.map((u) => User.Build(u));
  }
}
