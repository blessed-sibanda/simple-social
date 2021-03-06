import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
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
  loading = true;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private uiService: UiService,
    private route: ActivatedRoute
  ) {
    this.subs.add(route.paramMap.subscribe((_) => this.syncData()));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  syncData() {
    this.loading = true;
    let user = this.route.snapshot.data['user'];
    let action = user
      ? () => this.postService.getUserPosts(user._id)
      : () => this.postService.getPostFeed();
    this.subs.add(
      combineLatest([
        action(),
        this.postService.posts$,
        this.authService.currentUser$,
      ])
        .pipe(
          tap(([res, posts, user]) => {
            this.currentUser = user;
            this.posts = posts;
            this.loading = false;
          })
        )
        .subscribe()
    );
  }

  ngOnInit(): void {
    this.syncData();
  }

  isLiked(post: Post): boolean {
    return post.likes.map((l) => l._id).includes(this.currentUser._id);
  }

  updateLike(post: Post) {
    let action = this.isLiked(post)
      ? () => this.postService.unLikePost(post._id)
      : () => this.postService.likePost(post._id);
    this.subs.add(
      action().subscribe({
        next: (res) => {
          this.posts = this.posts.map((p) => {
            if (p._id === post._id) p.likes = res.likes;
            return p;
          });
          this.postService.posts$.next(this.posts);
        },
        error: (err) => this.uiService.showToast(err.message),
      })
    );
  }

  createComment(
    post: Post,
    text: HTMLInputElement,
    commentsPanel: MatExpansionPanel,
    event: any
  ) {
    if (text.value.trim() === '') return;
    if (event.keyCode === 13)
      this.subs.add(
        this.postService.createComment(post._id, text.value).subscribe({
          next: (res) => {
            commentsPanel.open();
            text.value = '';
            this.posts = this.posts.map((p) => {
              if (p._id === post._id) p.comments = res.comments;
              return p;
            });
            this.postService.posts$.next(this.posts);
          },
          error: (err) => this.uiService.showToast(err.message),
        })
      );
  }

  deleteComment(post: Post, commentId: string) {
    const dialog = this.uiService.showDialog(
      'Delete Comment',
      'Confirm to delete your comment',
      'Confirm',
      'Cancel'
    );
    this.subs.add(
      dialog.subscribe((result) => {
        if (result)
          this.postService.deleteComment(post._id, commentId).subscribe({
            next: (res) => {
              this.posts = this.posts.map((p) => {
                if (p._id === post._id) p.comments = res.comments;
                return p;
              });
              this.postService.posts$.next(this.posts);
            },
            error: (err) => this.uiService.showToast(err.message),
          });
      })
    );
  }

  deletePost(post: Post) {
    const dialog = this.uiService.showDialog(
      'Delete Post',
      'Confirm to delete this post',
      'Confirm',
      'Cancel'
    );
    this.subs.add(
      dialog.subscribe((result) => {
        if (result) {
          this.postService.deletePost(post._id).subscribe({
            next: (res) => {
              this.posts = this.posts.filter((p) => p._id !== post._id);
              this.uiService.showToast('You have deleted your post');
            },
            error: (err) => this.uiService.showToast(err.message),
          });
        }
      })
    );
  }
}
