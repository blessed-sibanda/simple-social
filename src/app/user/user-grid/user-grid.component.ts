import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { BehaviorSubject, tap } from 'rxjs';
import { SubSink } from 'subsink';
import { IFollow } from '../user';

@Component({
  selector: 'app-user-grid',
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.scss'],
})
export class UserGridComponent implements OnInit, OnDestroy {
  @Input() users$!: BehaviorSubject<IFollow[]>;
  userList: IFollow[] = [];
  subs = new SubSink();

  constructor(public media: MediaObserver) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.sink = this.users$
      .pipe(tap((users) => (this.userList = users)))
      .subscribe();
  }
}
