import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UiService } from 'src/app/common/ui.service';
import { User } from 'src/app/user/user';
import { SubSink } from 'subsink';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  subs = new SubSink();
  currentUser!: User;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private uiService: UiService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.sink = combineLatest([
      this.postService.getPostFeed(),
      this.authService.currentUser$,
    ])
      .pipe(
        tap(([posts, currentUser]) => {
          this.posts = posts;
          this.currentUser = currentUser;
        })
      )
      .subscribe();
  }

  deletePost(post: Post) {
    this.postService.deletePost(post._id).subscribe({
      next: (res) => {
        this.posts = this.posts.filter((p) => p._id !== post._id);
        this.uiService.showToast('You have deleted your post');
      },
      error: (err) => this.uiService.showToast(err.message),
    });
  }
}
