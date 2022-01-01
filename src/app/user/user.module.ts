import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../app-material.module';
import { UsersComponent } from './users/users.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserResolve } from './user.resolve';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgpImagePickerComponent,
  NgpImagePickerModule,
} from 'ngp-image-picker';
import { UserGridComponent } from './user-grid/user-grid.component';

@NgModule({
  declarations: [UsersComponent, EditProfileComponent, ProfileComponent, UserGridComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    UserRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgpImagePickerModule,
    // NgpImagePickerComponent,
  ],
  providers: [UserResolve],
})
export class UserModule {}
