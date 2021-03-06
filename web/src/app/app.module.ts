import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { StatuteComponent } from './components/statute/statute.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { WhiskeyComponent } from './components/whiskey/whiskey.component';
import { EventsComponent } from './components/events/events.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ArticleToolBoxComponent } from './components/article-tool-box/article-tool-box.component';
import { ArticleEditorComponent } from './components/article-editor/article-editor.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PendingChangesGuard } from './pending-changes.guard';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { ArticleViewerComponent } from './components/article-viewer/article-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    StatuteComponent,
    ReviewsComponent,
    WhiskeyComponent,
    EventsComponent,
    NavBarComponent,
    ArticleToolBoxComponent,
    ArticleEditorComponent,
    UserProfileComponent,
    ConfirmModalComponent,
    ArticleViewerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain: 'bisand.auth0.com',
      clientId: 'PJeWwDMvJmzo25dz8M1EgnK8txLlwyGF',
      audience: 'https://api.sideburnwhisky.no/',
      httpInterceptor: {
        allowedList: [
          {
            uri: 'https://api.sideburnwhisky.no/*',
            allowAnonymous: true,
          },
          {
            uri: 'http://api.example:8080/*',
            allowAnonymous: true,
          },
          {
            uri: 'https://your-domain.auth0.com/api/v2/users',
            tokenOptions: {
              audience: 'https://your-domain.com/api/v2/',
              scope: 'read:users',
            },
          },
        ]
      }
    }),
    NgbModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    PendingChangesGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
