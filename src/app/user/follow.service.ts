import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { UiService } from '../common/ui.service';
import { PostService } from '../posts/post.service';
import { IFollow, IUser } from './user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  followers$ = new BehaviorSubject<IFollow[]>([]);
  following$ = new BehaviorSubject<IFollow[]>([]);
  isFollower$ = new BehaviorSubject<boolean>(false);

  constructor(
    private userService: UserService,
    private uiService: UiService,
    private postService: PostService
  ) {}

  followUser(user: IUser | IFollow) {
    this.userService.followUser(user._id).subscribe({
      next: (res) => {
        this.followers$.next(res.followers);
        this.isFollower$.next(true);
        this.uiService.showToast(`You are now following ${res.name}`);
        this.postService.getPostFeed().subscribe();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  unfollowUser(user: IUser | IFollow) {
    this.userService.unfollowUser(user._id).subscribe({
      next: (res) => {
        this.followers$.next(res.followers);
        this.isFollower$.next(false);
        this.uiService.showToast(`You have stopped following ${res.name}`);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
