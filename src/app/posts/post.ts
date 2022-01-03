import { IFollow, User } from '../user/user';

interface ILike {
  _id: string;
}

interface IComment {
  _id: string;
  postedBy: IFollow;
  text: string;
  createdAt: string;
}

export interface IPost {
  _id: string;
  text: string;
  photoUrl: string;
  postedBy: IFollow;
  createdAt: string;
  likes: ILike[];
  comments: IComment[];
}

export class Post {
  constructor(
    public _id = '',
    public text = '',
    public photoUrl = '',
    public postedBy = new User() as IFollow,
    public createdAt = '',
    public likes: ILike[] = [],
    public comments: IComment[] = []
  ) {}

  static Build(post: IPost): Post {
    return new Post(
      post._id,
      post.text,
      post.photoUrl,
      post.postedBy,
      post.createdAt,
      post.likes,
      post.comments
    );
  }

  static BuildMany(posts: IPost[]): Post[] {
    return posts.map((p) => Post.Build(p));
  }
}
