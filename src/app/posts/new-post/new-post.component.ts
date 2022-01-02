import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, OnDestroy, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagePickerConf } from 'ngp-image-picker';
import { tap, take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/user/user';
import { SubSink } from 'subsink';
import { IPost } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit, OnDestroy {
  postForm!: FormGroup;
  currentUser!: User;
  subs = new SubSink();
  image: any | undefined | null;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  upload: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private authService: AuthService,
    private _ngZone: NgZone
  ) {}

  imagePickerConf: ImagePickerConf = {
    borderRadius: '4px',
    language: 'en',
    width: '200px',
    height: '150px',
    hideDownloadBtn: true,
  };

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.sink = this.authService.currentUser$
      .pipe(tap((user) => (this.currentUser = user)))
      .subscribe();
    this.buildForm();
  }

  dataURLtoFile(dataurl: any, filename: string) {
    if (!dataurl) return null;
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  onImageChange(event: any) {
    let filename = `${Date.now()}${Math.floor(Math.random() * Date.now())}`;
    this.image = this.dataURLtoFile(event, filename);
    console.log(this.image);
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  buildForm() {
    this.postForm = this.formBuilder.group({
      text: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  createPost(text: string) {
    if (this.postForm.valid && text !== '')
      this.postService.createPost(text, this.image || null).subscribe({
        next: (res: IPost) => {
          this.postForm.reset();
          this.upload = false;
          this.image = null;
          this.postService.posts$.next([
            res,
            ...this.postService.posts$.getValue(),
          ]);
        },
      });
  }
}
