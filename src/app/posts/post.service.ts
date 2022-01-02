import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
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
  constructor(private httpClient: HttpClient) {}

  getPostFeed(): Observable<Post[]> {
    return this.httpClient
      .get<IPost[]>(`${environment.baseApiUrl}/posts/`)
      .pipe(map(Post.BuildMany), catchError(transformError));
  }

  createPost(text: string, file?: File): Observable<Post> {
    if (!file) {
      return this.httpClient.post<IPost>(`${environment.baseApiUrl}/posts/`, {
        text,
      });
    } else {
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('text', text);

      return this.httpClient.post<IPost>(
        `${environment.baseApiUrl}/posts/`,
        formData
      );
    }
  }

  deletePost(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.baseApiUrl}/posts/${id}`);
  }
}
