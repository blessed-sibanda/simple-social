import {
  AfterViewChecked,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UiService } from 'src/app/common/ui.service';
import { SubSink } from 'subsink';
import { FollowService } from '../follow.service';
import { IFollow, IUser, User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user!: User;
  subs = new SubSink();
  followers: IFollow[] = [];
  following: IFollow[] = [];
  isFollower: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private uiService: UiService,
    private router: Router,
    public followService: FollowService
  ) {
    this.subs.sink = route.paramMap.subscribe((_) => this.syncData());
  }

  syncData() {
    this.user = this.route.snapshot.data['user'];
    this.followService.followers$.next(this.user.followers);
    this.followService.following$.next(this.user.following);
    let currentUser = this.authService.currentUser$.getValue();
    let isFollower = this.user.followers.includes(currentUser as IFollow);
    this.followService.isFollower$.next(isFollower);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.syncData();
    this.subs.sink = combineLatest([
      this.followService.followers$,
      this.followService.following$,
      this.followService.isFollower$,
    ])
      .pipe(
        tap(([followers, following, isFollower]) => {
          this.followers = followers;
          this.following = following;
          this.isFollower = isFollower;
        })
      )
      .subscribe();
  }

  isOwner() {
    return this.user._id === this.authService.currentUser$.getValue()._id;
  }

  updateFollowing() {
    if (this.isFollower) {
      this.followService.unfollowUser(this.user);
    } else {
      this.followService.followUser(this.user);
    }
  }

  deleteAccount(userId: string) {
    const dialog = this.uiService.showDialog(
      'Delete Account',
      'Confirm to delete account',
      'Confirm',
      'Cancel'
    );
    this.subs.sink = dialog.subscribe((result) => {
      if (result) {
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            this.uiService.showToast('Account successfully deleted');
            this.authService.logout();
            this.router.navigate(['/home']);
          },
          error: (err) => this.uiService.showToast(err.message),
        });
      }
    });
  }
}
