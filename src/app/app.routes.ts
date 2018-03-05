import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

// Route Access Validator Provider
import {RouterValidationService} from '../providers/router-validation-service'

// Pages
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { NotAllowedPageComponent } from './pages/not-allowed-page/not-allowed-page.component';
import { BannerManagementComponent } from './pages/banner-management/banner-management.component';
import { CreateBannerComponent } from './pages/create-banner/create-banner.component';
import { EditBannerComponent } from './pages/edit-banner/edit-banner.component';
import { LandingImageManagementComponent } from './pages/landing-image-management/landing-image-management.component';
import { TimelinePostManagementComponent } from './pages/timeline-post-management/timeline-post-management.component';
import { CreateTimelinePostComponent } from './pages/create-timeline-post/create-timeline-post.component';
import { EditTimelinePostComponent } from './pages/edit-timeline-post/edit-timeline-post.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [RouterValidationService]
  },
  {
    path: 'bannerManagement',
    component: BannerManagementComponent,
    canActivate: [RouterValidationService]
  },
  {
    path: 'createBanner',
    component: CreateBannerComponent,
    canActivate: [RouterValidationService]
  },
  {
    path: 'editBanner',
    component: EditBannerComponent,
    canActivate: [RouterValidationService]
  },
  {
    path: 'landindImageManagement',
    component: LandingImageManagementComponent,
    canActivate: [RouterValidationService]
  },
  {
    path: 'timelinePostManagement',
    component: TimelinePostManagementComponent,
    canActivate: [RouterValidationService]
  },
  {
    path: 'createTimelinePost',
    component: CreateTimelinePostComponent,
    canActivate: [RouterValidationService]
  },
  {
    path: 'editTimelinePost',
    component: EditTimelinePostComponent,
    canActivate: [RouterValidationService]
  },
  {
    path: 'myProfile',
    component: MyProfileComponent,
    canActivate: [RouterValidationService]
  },
  {
    path: 'notAllowed',
    component: NotAllowedPageComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  },
  {
    path: 'notFound',
    component: NotFoundPageComponent
  },
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
