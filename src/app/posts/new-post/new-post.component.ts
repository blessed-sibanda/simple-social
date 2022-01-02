import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
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

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private authService: AuthService
  ) {}

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

  buildForm() {
    this.postForm = this.formBuilder.group({
      text: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  createPost(text: string) {
    if (this.postForm.valid && text !== '')
      this.postService.createPost(text, this.image || null).subscribe({
        next: (res: IPost) => {
          this.postService.posts$.next([
            res,
            ...this.postService.posts$.getValue(),
          ]);
        },
      });
  }
}
