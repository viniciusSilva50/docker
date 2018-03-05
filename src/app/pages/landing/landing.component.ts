import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

// Providers
import { AuthenticationService } from '../../../providers/authentication-service';
import { ApplicationMessageService } from '../../../providers/application-message-service';
import { ApplicationLoadingService } from '../../../providers/application-loading-service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  providers: [AuthenticationService]
})
export class LandingComponent implements OnInit {

  userName: string = null;
  password: string = null;

  constructor(private router: Router, private  authenticationService: AuthenticationService, private messageService: ApplicationMessageService, private loadingService: ApplicationLoadingService) { }

  ngOnInit() {
  }

  login() {

    this.loadingService.showLoading();

    this.authenticationService.login(this.userName, this.password).subscribe((data)=>{
      this.loadingService.hideLoading();
      this.router.navigate(['/bannerManagement']);      
    },(error)=>{
      this.loadingService.hideLoading();
      this.messageService.showErrorMessage('Login Error', error)
    });
  }

}
