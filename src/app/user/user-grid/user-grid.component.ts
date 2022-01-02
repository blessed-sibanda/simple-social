import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { SubSink } from 'subsink';
import { IFollow } from '../user';

@Component({
  selector: 'app-user-grid',
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.scss'],
})
export class UserGridComponent implements OnInit, OnDestroy {
  @Input() users!: IFollow[];
  subs = new SubSink();

  constructor(public media: MediaObserver) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {}
}
