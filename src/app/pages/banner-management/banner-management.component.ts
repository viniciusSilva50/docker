import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';

// Models
import { IBanner, IBannerUpdateRequest} from '../../../models/banner-model';

// Providers
import { ApplicationMessageService } from '../../../providers/application-message-service';
import { ApplicationLoadingService } from '../../../providers/application-loading-service';
import { BannerService } from '../../../providers/banner-service';
import { UtilsService } from '../../../providers/utils-service';

@Component({
  selector: 'app-banner-management',
  templateUrl: './banner-management.component.html',
  styleUrls: ['./banner-management.component.css'],
  providers: [ BannerService, ConfirmationService ]
})
export class BannerManagementComponent implements OnInit {

  banners: IBanner[] = null;
  isShowingInactives: boolean = false;

  constructor(
    private router: Router,
    private messageService: ApplicationMessageService,
    private loadingService: ApplicationLoadingService,
    private bannerService: BannerService,
    private confirmationService: ConfirmationService,
    private utilsService: UtilsService
  ) {
    this.getActiveBanners();
   }

  getActiveBanners(){

    this.loadingService.showLoading();
    this.banners = null;

    this.bannerService.getBanners().subscribe((banners: IBanner[])=>{
      console.log("banners", banners);
      this.banners = banners;

      this.bannerService.getScheduledBanners().subscribe((scheduledBanners: IBanner[])=>{
        console.log("scheduledBanners", scheduledBanners);

        scheduledBanners.forEach(element => {
          element.isScheduled = true;
          this.banners.push(element);
        });
        
      },
      error=>{
        this.messageService.showErrorMessage('Server error', 'There was an error trying to get the scheduled banners');
      });
    },
    error=>{
      this.messageService.showErrorMessage('Server error', 'There was an error trying to get the banners');
    },()=>{
      this.loadingService.hideLoading();
    });
  }

  getInactiveBanners(){

    this.loadingService.showLoading();
    this.banners = null;

    this.bannerService.getInactivesBanners().subscribe((inactiveBanners: IBanner[])=>{
      console.log("inactiveBanners", inactiveBanners);
      this.banners = inactiveBanners;
    },
    error=>{
      this.messageService.showErrorMessage('Server error', 'There was an error trying to get the inactive banners');
    },()=>{
      this.loadingService.hideLoading();
    });
  }

  toogleBannerTable(){
    this.isShowingInactives = !this.isShowingInactives;

    if(this.isShowingInactives)
    {
      this.getInactiveBanners();
    }
    else
    {
      this.getActiveBanners();
    }
  }

  createBanner(){
    this.router.navigate(['createBanner']);
  }

  editBanner(selectedBanner: IBanner){
    this.utilsService.setRoutingData('banner', selectedBanner);
    this.router.navigate(['/editBanner']);
  }

  finishBanner(banner: IBanner){

    this.confirmationService.confirm({
        header: 'Finilizar campanha',
        message: 'Você tem certeza que deseja finalizar a campanha?',
        accept: () => {
          this.deactiveBanner(banner);
        }
    });
  }

  deactiveBanner(banner: IBanner){

    this.loadingService.showLoading();

    let bannerUpdateRequest: IBannerUpdateRequest = new IBannerUpdateRequest();
    bannerUpdateRequest.actionUrl = banner.actionUrl;
    bannerUpdateRequest.bannerId = banner.bannerId;
    bannerUpdateRequest.endPublishDate = banner.endPublishDate;
    bannerUpdateRequest.isActive = false;
    bannerUpdateRequest.startPublishDate = banner.startPublishDate;
    bannerUpdateRequest.text = banner.text;
    bannerUpdateRequest.title = banner.title;

    console.log('manage-banner/deactiveBanner() - bannerUpdateRequest', bannerUpdateRequest);

    this.bannerService.updateBanner(bannerUpdateRequest).subscribe((response)=>{
      if(this.isShowingInactives)
      {
        this.getInactiveBanners();
      }
      else
      {
        this.getActiveBanners();
      }
    },
    error=>{
      this.messageService.showErrorMessage('Houve um erro ao tentar finalizar a campanha', error);
      this.loadingService.hideLoading();
    },
    ()=>{
      this.loadingService.hideLoading();
    });
  }

  ngOnInit() {
  }

}
