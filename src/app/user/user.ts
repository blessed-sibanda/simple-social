export interface ISignUp {
  name: string;
  email: string;
  password: string;
}

export interface IFollow {
  _id: string;
  name: string;
  photoUrl: string;
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  about: string;
  photoUrl: string;
  createdAt: string;
  followers: IFollow[];
  following: IFollow[];
}

export class User implements IUser {
  constructor(
    public _id = '',
    public email = '',
    public name = '',
    public about = '',
    public createdAt = '',
    public photoUrl = '',
    public followers: IFollow[] = [],
    public following: IFollow[] = []
  ) {}

  static Build(user: IUser): User {
    return new User(
      user._id,
      user.email,
      user.name,
      user.about ?? '',
      user.createdAt,
      user.photoUrl,
      user.followers,
      user.following
    );
  }

  static BuildMany(users: IUser[]): User[] {
    return users.map((u) => User.Build(u));
  }
}
