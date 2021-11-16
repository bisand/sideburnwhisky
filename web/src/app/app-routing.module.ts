import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ArticleEditorComponent } from './components/article-editor/article-editor.component';
import { ArticleViewerComponent } from './components/article-viewer/article-viewer.component';
import { EventsComponent } from './components/events/events.component';
import { HomeComponent } from './components/home/home.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { StatuteComponent } from './components/statute/statute.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PendingChangesGuard } from './pending-changes.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'vedtekter', component: StatuteComponent },
  { path: 'om-oss', component: AboutComponent },
  { path: 'tester', component: ReviewsComponent },
  { path: 'arrangementer', component: EventsComponent },
  { path: 'artikkelredigering/:id', component: ArticleEditorComponent, canDeactivate: [PendingChangesGuard] },
  { path: 'artikkelredigering', component: ArticleEditorComponent, canDeactivate: [PendingChangesGuard] },
  { path: 'artikkel/:id', component: ArticleViewerComponent },
  { path: 'brukerprofil', component: UserProfileComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
