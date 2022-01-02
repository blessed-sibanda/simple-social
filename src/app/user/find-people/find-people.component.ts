import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { tap } from 'rxjs';
import { SubSink } from 'subsink';
import { FollowService } from '../follow.service';
import { IUser, User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-find-people',
  templateUrl: './find-people.component.html',
  styleUrls: ['./find-people.component.scss'],
})
export class FindPeopleComponent implements OnInit {
  subs = new SubSink();
  people: User[] = [];

  constructor(
    private userService: UserService,
    private followService: FollowService,
    public media: MediaObserver
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.userService
      .findPeople()
      .pipe(
        tap((people) => {
          this.people = people;
        })
      )
      .subscribe();
  }

  followUser(user: IUser) {
    this.followService.followUser(user);
    this.people = this.people.filter((p) => p._id !== user._id);
  }
}
