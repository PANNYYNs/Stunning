import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TimeAgoPipe } from 'time-ago-pipe';

import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { environment } from './environment';
import { HomeComponent } from './home/home.component';
import { HeadComponent } from './head/head.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { UploadComponent } from './upload/upload.component';
import { CommentComponent } from './comment/comment.component';
import { SearchComponent } from './search/search.component';
import { FavouriteComponent } from './favourite/favourite.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageComponent } from './image/image.component';
import { ImageDetailComponent } from './image-detail/image-detail.component';
import { AuthGuard } from './auth.guard';
import { HistoryComponent } from './history/history.component';
import { AdminComponent } from './admin/admin.component';
import { ChartModule } from 'angular2-chartjs';
import { AdminGuard } from './admin.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { ExploreComponent } from './explore/explore.component';


@NgModule({
  imports:      [ ChartModule, BrowserModule, FormsModule ,BrowserAnimationsModule,MatSnackBarModule,
  AngularFireModule.initializeApp(environment.firebaseConfig),
  RouterModule.forRoot([
    { path: '', component: HomeComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'login', component: LoginComponent},
    { path: 'upload', component: UploadComponent , canActivate:[AuthGuard]},
    { path: 'image/:imgId', component: ImageDetailComponent},
    { path: 'search/:tagId', component: SearchComponent},
    { path: 'explore' ,component: ExploreComponent},
    { path: 'admin', component: AdminComponent ,canActivate:[AdminGuard]},
    { path: 'favourite/:emailId', component: FavouriteComponent, canActivate:[AuthGuard]},
    { path: 'history/:emailId', component: HistoryComponent, canActivate:[AuthGuard]},
    { path: '**', component: NotFoundComponent },
    
    ]),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    
  ],
  declarations: [ AppComponent, HelloComponent, HomeComponent, HeadComponent, RegisterComponent, LoginComponent, UploadComponent, CommentComponent, TimeAgoPipe, SearchComponent, FavouriteComponent, ImageComponent ,ImageDetailComponent, HistoryComponent, AdminComponent, NotFoundComponent, ExploreComponent],
  bootstrap:    [ AppComponent ],
  providers: [ AngularFirestore, AuthService ,AuthGuard ,AdminGuard]
})
export class AppModule { }
