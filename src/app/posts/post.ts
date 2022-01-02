import { IFollow, User } from '../user/user';

export interface IPost {
  _id: string;
  text: string;
  photoUrl: string;
  postedBy: IFollow;
  createdAt: string;
}

export class Post {
  constructor(
    public _id = '',
    public text = '',
    public photoUrl = '',
    public postedBy = new User() as IFollow,
    public createdAt = ''
  ) {}

  static Build(post: IPost): Post {
    return new Post(
      post._id,
      post.text,
      post.photoUrl,
      post.postedBy,
      post.createdAt
    );
  }

  static BuildMany(posts: IPost[]): Post[] {
    return posts.map((p) => Post.Build(p));
  }
}
