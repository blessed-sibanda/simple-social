import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { transformError } from '../common/common';
import { IPost, Post } from './post';

interface IPostService {
  getPostFeed(): Observable<Post[]>;
  createPost(text: string, file?: File): Observable<Post>;
  deletePost(id: string): Observable<any>;
}

@Injectable({
  providedIn: 'root',
})
export class PostService implements IPostService {
  posts$ = new BehaviorSubject<IPost[]>([]);

  constructor(private httpClient: HttpClient) {}

  getPostFeed(): Observable<Post[]> {
    return this.httpClient
      .get<IPost[]>(`${environment.baseApiUrl}/posts/`)
      .pipe(
        map(Post.BuildMany),
        tap((posts) => this.posts$.next(posts)),
        catchError(transformError)
      );
  }

  createPost(text: string, file?: File): Observable<Post> {
    const formData: FormData = new FormData();
    file && formData.append('file', file);
    formData.append('text', text);

    return this.httpClient.post<IPost>(
      `${environment.baseApiUrl}/posts/`,
      formData
    );
  }

  deletePost(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.baseApiUrl}/posts/${id}`);
  }
}