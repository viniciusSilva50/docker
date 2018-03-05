import {Component,Input,OnInit,EventEmitter,ViewChild,trigger,state,transition,style,animate,Inject,forwardRef} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import {AppComponent} from './app.component';

@Component({
    selector: 'inline-profile',
    template: `
        <div class="profile" [ngClass]="{'profile-expanded':active}">
            <div class="profile-image" [ngStyle]="profileStyleBackground"></div>
            <a href="#" (click)="onClick($event)">
                <span class="profile-name">{{userName}}</span>
                <i class="material-icons">keyboard_arrow_down</i>
            </a>
        </div>

        <ul class="ultima-menu profile-menu" [@menu]="active ? 'visible' : 'hidden'">
            <li role="menuitem" *ngIf="userName !== 'MKmobile' && userName !== 'MKdigital'">
                <a href="#/myProfile" class="ripplelink" [attr.tabindex]="!active ? '-1' : null">
                    <i class="material-icons">person</i>
                    <span>Perfil</span>
                </a>
            </li>
            <li role="menuitem">
                <a href="" class="ripplelink" [attr.tabindex]="!active ? '-1' : null" (click)="logout()">
                    <i class="material-icons">power_settings_new</i>
                    <span>Sair</span>
                </a>
            </li>
        </ul>
    `,
    animations: [
        trigger('menu', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class InlineProfileComponent {

    active: boolean;

    userName: string = '';
    userPhotoUrl: string = '';

    profileStyleBackground: any;

    constructor(@Inject(forwardRef(() => AppComponent)) public app:AppComponent) { 

        this.userName = this.app.loggedUser.fullName.trim();

        if(this.app.loggedUser.photoUrl != null && this.app.loggedUser.photoUrl != "")
        {
            this.userPhotoUrl = this.app.loggedUser.photoUrl;
        }
        else
        {
            this.userPhotoUrl = "assets/images/avatar.png";
        }

        this.profileStyleBackground = {
            'background': 'url(' + this.userPhotoUrl + ') no-repeat',
            'background-size': 'contain',
            'border-radius': '50%'
        };
    }

    onClick(event) {
        this.active = !this.active;
        event.preventDefault();
    }

    logout(){
        this.app.logOut();
    }
}