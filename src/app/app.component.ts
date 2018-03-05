import { Component,AfterViewInit,ElementRef,Renderer,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

// Providers
import { ContextService } from '../providers/context-service';
import { AuthenticationService } from '../providers/authentication-service';
import { SystemSettingService } from '../providers/system-setting-service';
import { EventEmitterService } from '../providers/event-emitter-service';
import { ApplicationMessageService } from '../providers/application-message-service';
import { ApplicationLoadingService } from '../providers/application-loading-service';

// Models

// Prime
import {Message} from 'primeng/primeng';

enum MenuOrientation {
    STATIC,
    OVERLAY,
    HORIZONTAL
};

declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AuthenticationService, SystemSettingService]
})
export class AppComponent implements AfterViewInit {

    userSitemap: Array<{label:string, icon: string, routerLink?: string, command?: any, items?: Array<{label:string, icon: string, routerLink: string}>}>;

    appMessages: Message[] = [];

    isLoading: boolean = false;

    layoutCompact: boolean = false;

    layoutMode: MenuOrientation = MenuOrientation.STATIC;

    darkMenu: boolean = false;

    profileMode: string = 'inline';

    rotateMenuButton: boolean;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    layoutContainer: HTMLDivElement;

    layoutMenuScroller: HTMLDivElement;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    documentClickListener: Function;

    resetMenu: boolean;

    isShowNavBar: boolean;

    loggedUser: {fullName: string, photoUrl: string} = {fullName: null, photoUrl: null};

    // Subscriptions
    isLoggedEventSubscription: Subscription;
    applicationMessageSubscription: Subscription;
    applicationLoadingSubscription: Subscription;

    @ViewChild('layoutContainer') layourContainerViewChild: ElementRef;

    @ViewChild('layoutMenuScroller') layoutMenuScrollerViewChild: ElementRef;

    constructor(
      public renderer: Renderer,
      private contextService: ContextService,
      private authenticationService: AuthenticationService,
      private router: Router,
      private messageService: ApplicationMessageService,
      private loadingService: ApplicationLoadingService) {

        let userToken = this.contextService.get(ContextService.UserToken);

        if(userToken != null)
        {
            this.authenticationService.renewToken(userToken.userId).subscribe(()=>{

                this.loggedUser.fullName = userToken.firstName + ' ' + userToken.lastName;
                this.loggedUser.photoUrl = userToken.photoUrl;
                this.mountingMenu();
                this.isShowNavBar = true;
            },
            error=>{
                this.logOut();
            });
        }
        else
        {
            this.router.navigate(['/landing']);
        }

        this.signApplicationEvents();
    }

    ngAfterViewInit() {
        this.layoutContainer = <HTMLDivElement> this.layourContainerViewChild.nativeElement;

        if(this.isShowNavBar) {

            this.layoutMenuScroller = <HTMLDivElement> this.layoutMenuScrollerViewChild.nativeElement;

            setTimeout(() => {
                jQuery(this.layoutMenuScroller).nanoScroller({flash:true});
            }, 10);
        }

        //hides the horizontal submenus or top menu if outside is clicked
        this.documentClickListener = this.renderer.listenGlobal('body', 'click', (event) => {
            if(!this.topbarItemClick) {
                this.activeTopbarItem = null;
                this.topbarMenuActive = false;
            }

            if(!this.menuClick && this.isHorizontal()) {
                this.resetMenu = true;
            }

            this.topbarItemClick = false;
            this.menuClick = false;
        });
    }

    signApplicationEvents(){

        // User logging activity
        this.isLoggedEventSubscription = EventEmitterService.get('isLogged').subscribe(isLoaggedFlag =>{
            console.log('app.component/event/isLogged', isLoaggedFlag);

            if(isLoaggedFlag)
            {
                let userToken = this.contextService.get(ContextService.UserToken);
                this.loggedUser.fullName = userToken.firstName + ' ' + userToken.lastName;
                this.loggedUser.photoUrl = userToken.photoUrl;
                this.isShowNavBar = true;
                this.mountingMenu();
            }
            else
            {
                this.isShowNavBar = false;
                this.userSitemap = [];
                this.loggedUser.fullName = null;
                this.loggedUser.photoUrl = null;
                this.router.navigate(['/landing']);
            }
        });

        // Application Message
        this.applicationMessageSubscription = this.messageService.getMessage().subscribe((message: Message)=>{
            this.appMessages.push(message);
        });

        // Application Loading
        this.applicationLoadingSubscription = this.loadingService.getLoading().subscribe((loadingFlag: boolean)=>{
            this.isLoading = loadingFlag;
        });
    }

    mountingMenu(){

        this.userSitemap = new Array<{label:string, icon: string, routerLink?: string, command?: any, items?: Array<{label:string, icon: string, routerLink: string}>}>();

        //Adding default menu
        this.userSitemap.push(
        {
            label: 'Timeline Posts',
            icon: 'smartphone',
            routerLink:'/timelinePostManagement'
        });

        this.userSitemap.push(
        {
            label: 'Banners',
            icon: 'photo_album',
            routerLink:'/bannerManagement'
        });

        this.userSitemap.push(
        {
            label: 'Splash',
            icon: 'perm_device_information',
            routerLink:'/landindImageManagement'
        });
    }

    onMenuButtonClick(event) {
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;

        if(this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }
        else {
            if(this.isDesktop())
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            else
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;

        if(!this.isHorizontal()) {
            setTimeout(() => {
                jQuery(this.layoutMenuScroller).nanoScroller();
            }, 500);
        }
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        if(this.overlayMenuActive || this.staticMenuMobileActive) {
            this.rotateMenuButton = false;
            this.overlayMenuActive = false;
            this.staticMenuMobileActive = false;
        }

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if(this.activeTopbarItem === item)
            this.activeTopbarItem = null;
        else
            this.activeTopbarItem = item;

        event.preventDefault();
    }

    isTablet() {
        let width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.layoutMode === MenuOrientation.OVERLAY;
    }

    isHorizontal() {
        return this.layoutMode === MenuOrientation.HORIZONTAL;
    }

    changeToStaticMenu() {
        this.layoutMode = MenuOrientation.STATIC;
    }

    changeToOverlayMenu() {
        this.layoutMode = MenuOrientation.OVERLAY;
    }

    changeToHorizontalMenu() {
        this.layoutMode = MenuOrientation.HORIZONTAL;
    }

    ngOnDestroy() {
        if(this.documentClickListener) {
            this.documentClickListener();
        }

        jQuery(this.layoutMenuScroller).nanoScroller({flash:true});

        // Unsubscribe to ensure no memory leaks
        this.isLoggedEventSubscription.unsubscribe();
        this.applicationMessageSubscription.unsubscribe();
        this.applicationLoadingSubscription.unsubscribe();
    }

    logOut(){
        this.authenticationService.logout();
    }

}
