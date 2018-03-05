import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ContextService } from '../providers/context-service';
import { SystemSettingService } from '../providers/system-setting-service';
import { HttpClientService } from '../providers/http-client-service';
import { EventEmitterService } from '../providers/event-emitter-service';

// Models
//import { ISitemap } from '../models/sitemap-model'
import { ISystemSetting } from '../models/system-setting-model';

@Injectable()
export class AuthenticationService {

  constructor(private context: ContextService, private systemSettingService: SystemSettingService, private httpClient: HttpClientService) {
  }

  forgotPassword(userName)
  {
    return Observable.create(observer => {

      let payload = {
        email: userName
      };

      this.httpClient.put('/api/systemuser/forgotpassword', payload).subscribe(
        (data)=>{
          observer.next(true);
          observer.complete();
        },
        (err)=>{
          observer.error("An error has occurred when trying to redefine your password");
        });

    });    
  }

  logout()
  {
    console.log('authentication-service/logout()');
    this.context.remove(ContextService.UserToken);
    this.context.remove(ContextService.Sitemap);
    EventEmitterService.get('isLogged').emit(false);
  }
  
  renewToken(userId: string)
  {
    return Observable.create(observer => {
      console.log('authenticationservice/renewToken()');

        this.validateToken().subscribe((data)=>{
          this.context.set(ContextService.Sitemap, data);
          console.log('authenticationservice/renewToken() - success');
          observer.next(true);
          observer.complete();
        },
        error=>{
          console.error('authenticationservice/renewToken() - token has expired');
          observer.error(false);
          observer.complete();
        });
    });
  }

  login(username, password)
  {
    return Observable.create(observer => {

      // Authenticate user.
      var payload = 'grant_type=password&username=' + username + '&password=' + password;
      
      this.httpClient.post('/token', payload).subscribe((userToken)=>{

        console.log('authentication-service/login() - userToken', userToken);
        // User is authenticated. 
        // Check if user type is allowed to access the App.
        if (userToken)
        {
            this.context.set(ContextService.UserToken, userToken);

            // this.getUserSitemap(userToken.userId).subscribe((data: ISitemap[])=>{
              
            //   this.context.set(ContextService.Sitemap, data);

            //   this.systemSettingService.getSystemSettings().subscribe((settings: ISystemSetting[])=>{

            //     settings.forEach(element => {
            //         this.context.set(element.key, element.value);
            //     });
                
                EventEmitterService.get('isLogged').emit(true);
                observer.next(true);
                observer.complete();
            //   },
            //   error=>{
            //     observer.error('There was an error trying to get system settings');
            //     observer.complete();
            //   });

            // },
            // error=>{
            //   observer.error('There was an error trying to get user sitemap');
            //   observer.complete();
            // });
        }
        else
        {
            // User is not authorized to access this application.
            observer.error('User is not allowed to access this app');
            observer.complete();
        }
        },(err)=>{
            if (err.status == 400)
            {
                observer.error('Invalid username or password');
                observer.complete();
            }
            else
            {
                observer.error('An error has occurred when trying to perform login');
                observer.complete();
            }
        });
    });
  }

  // private getUserSitemap(userId: string)
  // {
  //   return Observable.create(observer => {
  //     this.httpClient.get('/api/useraccess/sitemap/user/' + userId).subscribe((data: ISitemap[])=>{
  //       observer.next(data);
  //       observer.complete();
  //     },
  //     (error)=>{
  //       observer.error(error);
  //       observer.complete();
  //     });
  //   });
  // }

  private validateToken()
  {
    return Observable.create(observer => {
      this.httpClient.get('/api/systemsetting/' + 'amazonServiceUrl').subscribe((data)=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

}
