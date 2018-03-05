import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';

// Models
import { IBanner, IBannerUpdateRequest } from '../../../models/banner-model';

// Providers
import { ApplicationMessageService } from '../../../providers/application-message-service';
import { ApplicationLoadingService } from '../../../providers/application-loading-service';
import { BannerService } from '../../../providers/banner-service';
import { UtilsService } from '../../../providers/utils-service';

@Component({
  selector: 'app-edit-banner',
  templateUrl: './edit-banner.component.html',
  styleUrls: ['./edit-banner.component.css'],
  providers: [ BannerService ]
})
export class EditBannerComponent implements OnInit {

  banner: IBanner = null;
  hasStartDate: boolean = false;
  currentStartDate: Date = null;
  hasEndDate: boolean = false;
  currentEndDate: Date = null;
  editBannerForm: FormGroup = null;
  isScheduleValid: boolean = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: ApplicationMessageService,
    private loadingService: ApplicationLoadingService,
    private bannerService: BannerService,
    private utilsService: UtilsService
  ) {

    this.banner = this.utilsService.getRoutingData('banner');
    this.utilsService.removeRoutingData('banner');

    if (this.banner == null || this.banner === undefined) {
      this.router.navigate(['/bannerManagement']);
    }else {
      this.editBannerForm = formBuilder.group({
        bannerTitle: [this.banner.title, Validators.required],
        text: [this.banner.text, Validators.required],
        actionUrl: [this.banner.actionUrl],
      });
  
      if(this.banner.startPublishDate != null)
      {
        this.hasStartDate = true;
        this.currentStartDate = this.banner.startPublishDate;
      }
  
      if(this.banner.endPublishDate != null)
      {
        this.hasEndDate = true;
        this.currentEndDate = this.banner.endPublishDate;
      }
    }
  }

  ngOnInit() {
  }

  handleStartDateSelected(selectedDate: Date){
    console.log("selectedDate", selectedDate);
    this.currentStartDate = selectedDate;

    if(this.currentEndDate != null)
    {
      if(this.currentStartDate > this.currentEndDate)
      {
        this.isScheduleValid = false;
        this.currentStartDate = null;
        this.messageService.showErrorMessage("Agendamento Inválido", "A data de fim da campanha deve ser maior do que a data de publicação");
      }
      else
      {
        this.isScheduleValid = true;
      }
    }
    else
    {
      this.isScheduleValid = true;
    }
  }

  handleStartDate(currentValue: boolean){
    if(!currentValue)
    {
      this.currentStartDate = null;
    }
    else
    {
      this.currentStartDate = this.banner.startPublishDate;
    }
  }

  handleEndDateSelected(selectedDate: Date){
    console.log("selectedDate", selectedDate);
    this.currentEndDate = selectedDate;

    if(this.currentStartDate != null)
    {
      if(this.currentStartDate > this.currentEndDate)
      {
        this.isScheduleValid = false;
        this.currentEndDate = null;
        this.messageService.showErrorMessage("Agendamento Inválido", "A data de fim da campanha deve ser maior do que a data de publicação");
      }
      else
      {
        this.isScheduleValid = true;
      }
    }
    else
    {
      this.isScheduleValid = true;
    }
  }

  handleEndDate(currentValue: boolean){
    if(!currentValue)
    {
      this.currentEndDate = null;
    }
    else
    {
      this.currentEndDate = this.banner.endPublishDate;
    }
  }

  cancel(){
    this.router.navigate(['/bannerManagement']);
  }

  saveForm(){

    this.loadingService.showLoading();

    let bannerUpdateRequest: IBannerUpdateRequest = new IBannerUpdateRequest();

    bannerUpdateRequest.actionUrl = this.editBannerForm.controls["actionUrl"].value;
    bannerUpdateRequest.title = this.editBannerForm.controls["bannerTitle"].value;
    bannerUpdateRequest.text = this.editBannerForm.controls["text"].value;
    bannerUpdateRequest.startPublishDate = this.currentStartDate;
    bannerUpdateRequest.endPublishDate = this.currentEndDate;
    bannerUpdateRequest.bannerId = this.banner.bannerId;
    bannerUpdateRequest.isActive = true;

    console.log('create-banner/saveForm() - bannerCreateRequest', bannerUpdateRequest);

    this.bannerService.updateBanner(bannerUpdateRequest).subscribe((response)=>{
      this.loadingService.hideLoading();
      this.router.navigate(['/bannerManagement']);
    },
    error=>{
      this.loadingService.hideLoading();
      this.messageService.showErrorMessage('Houve um erro ao tentar editar a campanha', error);
    });
  }

}
