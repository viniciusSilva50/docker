import {NgModule}      from '@angular/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule}    from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {LocationStrategy,HashLocationStrategy} from '@angular/common';
import {LocalStorageModule} from 'angular-2-local-storage';
import 'rxjs/add/operator/toPromise';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App Routes
import {AppRoutes} from './app.routes';

// PrimeNg
import {AccordionModule} from 'primeng/primeng';
import {AutoCompleteModule} from 'primeng/primeng';
import {BlockUIModule} from 'primeng/primeng';
import {BreadcrumbModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import {CalendarModule} from 'primeng/primeng';
import {CarouselModule} from 'primeng/primeng';
import {ChartModule} from 'primeng/primeng';
import {CheckboxModule} from 'primeng/primeng';
import {ChipsModule} from 'primeng/primeng';
import {CodeHighlighterModule} from 'primeng/primeng';
import {ConfirmDialogModule} from 'primeng/primeng';
import {SharedModule} from 'primeng/primeng';
import {ContextMenuModule} from 'primeng/primeng';
import {DataGridModule} from 'primeng/primeng';
import {DataListModule} from 'primeng/primeng';
import {DataScrollerModule} from 'primeng/primeng';
import {DataTableModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import {DragDropModule} from 'primeng/primeng';
import {DropdownModule} from 'primeng/primeng';
import {EditorModule} from 'primeng/primeng';
import {FieldsetModule} from 'primeng/primeng';
import {FileUploadModule} from 'primeng/primeng';
import {GalleriaModule} from 'primeng/primeng';
import {GMapModule} from 'primeng/primeng';
import {GrowlModule} from 'primeng/primeng';
import {InputMaskModule} from 'primeng/primeng';
import {InputSwitchModule} from 'primeng/primeng';
import {InputTextModule} from 'primeng/primeng';
import {InputTextareaModule} from 'primeng/primeng';
import {LightboxModule} from 'primeng/primeng';
import {ListboxModule} from 'primeng/primeng';
import {MegaMenuModule} from 'primeng/primeng';
import {MenuModule} from 'primeng/primeng';
import {MenubarModule} from 'primeng/primeng';
import {MessagesModule} from 'primeng/primeng';
import {MultiSelectModule} from 'primeng/primeng';
import {OrderListModule} from 'primeng/primeng';
import {OverlayPanelModule} from 'primeng/primeng';
import {PaginatorModule} from 'primeng/primeng';
import {PanelModule} from 'primeng/primeng';
import {PanelMenuModule} from 'primeng/primeng';
import {PasswordModule} from 'primeng/primeng';
import {PickListModule} from 'primeng/primeng';
import {ProgressBarModule} from 'primeng/primeng';
import {RadioButtonModule} from 'primeng/primeng';
import {RatingModule} from 'primeng/primeng';
import {ScheduleModule} from 'primeng/primeng';
import {SelectButtonModule} from 'primeng/primeng';
import {SlideMenuModule} from 'primeng/primeng';
import {SliderModule} from 'primeng/primeng';
import {SpinnerModule} from 'primeng/primeng';
import {SplitButtonModule} from 'primeng/primeng';
import {StepsModule} from 'primeng/primeng';
import {TabMenuModule} from 'primeng/primeng';
import {TabViewModule} from 'primeng/primeng';
import {TerminalModule} from 'primeng/primeng';
import {TieredMenuModule} from 'primeng/primeng';
import {ToggleButtonModule} from 'primeng/primeng';
import {ToolbarModule} from 'primeng/primeng';
import {TooltipModule} from 'primeng/primeng';
import {TreeModule} from 'primeng/primeng';
import {TreeTableModule} from 'primeng/primeng';

// App Components
import {AppComponent}  from './app.component';
import {AppMenuComponent,AppSubMenu}  from './app.menu.component';
import {AppTopBar}  from './app.topbar.component';
import {InlineProfileComponent}  from './app.profile.component';

// Providers
import { ContextService } from '../providers/context-service';
import { HttpClientService } from '../providers/http-client-service';
import { CryptoService } from '../providers/crypto-service';
import { EventEmitterService } from '../providers/event-emitter-service';
import { UtilsService } from '../providers/utils-service';
import { RouterValidationService } from '../providers/router-validation-service';
import { ApplicationMessageService } from '../providers/application-message-service';
import { ApplicationLoadingService } from '../providers/application-loading-service';
import { ApplicationValidationService } from '../providers/application-validation-service';

// Pages
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { VideoUploaderComponent } from './components/video-uploader/video-uploader.component';
import { NotAllowedPageComponent } from './pages/not-allowed-page/not-allowed-page.component';
import { BannerManagementComponent } from './pages/banner-management/banner-management.component';
import { CreateBannerComponent } from './pages/create-banner/create-banner.component';
import { EditBannerComponent } from './pages/edit-banner/edit-banner.component';
import { LandingImageManagementComponent } from './pages/landing-image-management/landing-image-management.component';
import { TimelinePostManagementComponent } from './pages/timeline-post-management/timeline-post-management.component';
import { CreateTimelinePostComponent } from './pages/create-timeline-post/create-timeline-post.component';
import { EditTimelinePostComponent } from './pages/edit-timeline-post/edit-timeline-post.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';

@NgModule({
    imports: [
        LocalStorageModule.withConfig({prefix: 'my-app', storageType: 'localStorage'}),
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutes,
        HttpModule,
        AccordionModule,
        AutoCompleteModule,
        BlockUIModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        SharedModule,
        ContextMenuModule,
        DataGridModule,
        DataListModule,
        DataScrollerModule,
        DataTableModule,
        DialogModule,
        DragDropModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        GMapModule,
        GrowlModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        ScheduleModule,
        SelectButtonModule,
        SlideMenuModule,
        SliderModule,
        SpinnerModule,
        SplitButtonModule,
        StepsModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule
    ],
    declarations: [
        // App Components
        AppComponent,
        AppMenuComponent,
        AppSubMenu,
        AppTopBar,
        InlineProfileComponent,

        // Pages
        LandingComponent,
        DashboardComponent,
        NotFoundPageComponent, 
        ImageUploaderComponent,
        VideoUploaderComponent,
        NotAllowedPageComponent,
        BannerManagementComponent,
        CreateBannerComponent,
        EditBannerComponent,
        LandingImageManagementComponent,
        TimelinePostManagementComponent,
        CreateTimelinePostComponent,
        EditTimelinePostComponent,
        MyProfileComponent
    ],
    providers: [
        ContextService,
        HttpClientService,
        CryptoService,
        UtilsService,
        EventEmitterService,
        RouterValidationService,
        ApplicationMessageService,
        ApplicationLoadingService,
        ApplicationValidationService,
        {provide: LocationStrategy, useClass: HashLocationStrategy},
    ],
    bootstrap:[AppComponent]
})
export class AppModule { }
