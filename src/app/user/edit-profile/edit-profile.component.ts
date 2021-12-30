import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { UiService } from 'src/app/common/ui.service';
import {
  EmailValidation,
  NameValidation,
  OptionalPasswordValidation,
} from 'src/app/common/validations';
import { SubSink } from 'subsink';
import { IUser, User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  profileEditForm!: FormGroup;
  user!: User;
  subs = new SubSink();
  updateError = '';
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private uiService: UiService,
    private router: Router,
    private _ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.user = this.route.snapshot.data['user'];
    this.buildForm();
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  buildForm() {
    this.profileEditForm = this.formBuilder.group({
      name: [this.user.name, NameValidation],
      about: [this.user.about, Validators.minLength(5)],
      email: [this.user.email, EmailValidation],
      password: ['', OptionalPasswordValidation],
    });
  }

  updateProfile(submittedForm: FormGroup) {
    if (submittedForm.value['password'] == '') {
      delete submittedForm.value['password'];
    }

    this.subs.sink = this.userService
      .updateUser(this.user._id, submittedForm.value)
      .subscribe({
        next: (res: IUser) => {
          this.uiService.showToast('Profile updated successfully');
          this.router.navigate([`/users/${this.user._id}`]);
        },
        error: (err) => (this.updateError = err.message),
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
