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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      // The domain and clientId were configured in the previous chapter
      domain: 'bisand.auth0.com',
      clientId: 'PJeWwDMvJmzo25dz8M1EgnK8txLlwyGF',
      // Request this audience at user authentication time
      audience: 'https://bisand.auth0.com/api/v2/',
      // Request this scope at user authentication time
      scope: 'read:current_user',
      // Specify configuration for the interceptor              
      httpInterceptor: {
        allowedList: [
          {
            // Match any request that starts 'https://bisand.auth0.com/api/v2/' (note the asterisk)
            uri: 'https://bisand.auth0.com/api/v2/*',
            tokenOptions: {
              // The attached token should target this audience
              audience: 'https://bisand.auth0.com/api/v2/',
              // The attached token should have these scopes
              scope: 'read:current_user'
            }
          }
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
