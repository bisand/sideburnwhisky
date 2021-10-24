import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthModule } from '@auth0/auth0-angular';
import { AuthButtonComponentComponent } from './auth-button-component/auth-button-component.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { StatuteComponent } from './statute/statute.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { WhiskeyComponent } from './whiskey/whiskey.component';
import { EventsComponent } from './events/events.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthButtonComponentComponent,
    HomeComponent,
    AboutComponent,
    StatuteComponent,
    ReviewsComponent,
    WhiskeyComponent,
    EventsComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule.forRoot({
      domain: 'bisand.auth0.com',
      clientId: 'PJeWwDMvJmzo25dz8M1EgnK8txLlwyGF'
    }),
    NgbModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
