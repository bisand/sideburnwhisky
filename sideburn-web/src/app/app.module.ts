import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { AuthModule } from '@auth0/auth0-angular';
import { AuthButtonComponentComponent } from './auth-button-component/auth-button-component.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthButtonComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    AuthModule.forRoot({
      domain: 'bisand.auth0.com',
      clientId: 'PJeWwDMvJmzo25dz8M1EgnK8txLlwyGF'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
