import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

// Providers
import { ContextService } from '../providers/context-service';

// Models
//import { ISitemap, IMenu } from '../models/sitemap-model'


@Injectable()
export class RouterValidationService implements CanActivate {

    // private contextSitemaps: ISitemap[];
    // private userMenus: IMenu[];
    private loggedUserToken: {};
 
   constructor(private router: Router, private contextService: ContextService) {
    console.log('RouterValidationService/constructor()');
    
    this.loggedUserToken = this.contextService.get(ContextService.UserToken);

    // this.userMenus = new Array<IMenu>();

    // if(this.contextSitemaps)
    // {
    //     this.contextSitemaps.forEach(sitemap =>{
    //         sitemap.menuItems.forEach(menu => {
    //             this.userMenus.push(menu);
    //         });
    //     });
    // }

   }
 
   public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    let desiredRoute = state.url.replace('/','');

    // Verify if user Sitemap has the desired route, if yes it is allowed
    if(this.loggedUserToken)
    {
        console.log('app-component/router.events - route allowed', desiredRoute);
        return true;
    }
    else
    {
        console.error('app-component/router.events - route not allowed', desiredRoute);
        this.router.navigate(['notAllowed']);
        return false
    }
   }
}