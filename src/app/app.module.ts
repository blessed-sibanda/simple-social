import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './core/home/home.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SideNavigationComponent } from './core/side-navigation/side-navigation.component';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SimpleDialogComponent } from './common/simple-dialog/simple-dialog.component';

import { AuthService } from './auth/auth.service';

import { AuthHttpInterceptor } from './auth/auth-http-interceptor';
import { authFactory } from './auth/auth.factory';
import { FindPeopleComponent } from './user/find-people/find-people.component';
import { NewPostComponent } from './posts/new-post/new-post.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { NgpImagePickerModule } from 'ngp-image-picker';
import { PostItemComponent } from './posts/post-item/post-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    SideNavigationComponent,
    SignUpComponent,
    SimpleDialogComponent,
    FindPeopleComponent,
    NewPostComponent,
    PostListComponent,
    PostItemComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppMaterialModule,
    AuthModule,
    UserModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    NgpImagePickerModule,
  ],
  providers: [
    {
      provide: AuthService,
      useFactory: authFactory,
      deps: [HttpClient],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
