import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { EventsComponent } from './events/events.component';
import { HomeComponent } from './home/home.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { StatuteComponent } from './statute/statute.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'vedtekter', component: StatuteComponent },
  { path: 'om-oss', component: AboutComponent },
  { path: 'tester', component: ReviewsComponent },
  { path: 'arrangementer', component: EventsComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
