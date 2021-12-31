import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface IFileUploadService {
  upload(file: File, id: string): Observable<any>;
  getFiles(id: string): Observable<any>;
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService implements IFileUploadService {
  constructor(private httpClient: HttpClient) {}

  upload(file: File, id: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest(
      'POST',
      `${environment.baseApiUrl}/upload/${id}`,
      formData,
      { reportProgress: true, responseType: 'json' }
    );
    return this.httpClient.request(req);
  }

  getFiles(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseApiUrl}/files/${id}`);
  }
}
