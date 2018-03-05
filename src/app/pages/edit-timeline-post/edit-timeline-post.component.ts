import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

// Models
import { ITimelinePost, ITimelinePostUpdateRequest } from '../../../models/timeline-post-model';

// Providers
import { ApplicationMessageService } from '../../../providers/application-message-service';
import { ApplicationLoadingService } from '../../../providers/application-loading-service';
import { ApplicationValidationService } from '../../../providers/application-validation-service';
import { TimelinePostService } from '../../../providers/timeline-post-service';
import { UtilsService } from '../../../providers/utils-service';

@Component({
  selector: 'app-edit-timeline-post',
  templateUrl: './edit-timeline-post.component.html',
  styleUrls: ['./edit-timeline-post.component.css'], 
  providers: [ TimelinePostService ]
})
export class EditTimelinePostComponent implements OnInit {

  // Page attributes
  consultantLevels: SelectItem[] = [];
  consultantStatuses: SelectItem[] = [];
  actionTypes:  SelectItem[] = [];
  appPages: SelectItem[] = [];

  startDate: Date = null;
  endDate: Date = null;

  timelinePost: ITimelinePost = null;
  minEndDate: Date = null;
  editTimelinePostForm: FormGroup = null;
  isScheduleValid: boolean = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: ApplicationMessageService,
    private loadingService: ApplicationLoadingService,
    private timelinePostService: TimelinePostService,
    private utilsService: UtilsService
  ) {

    // this.route.queryParams.subscribe((params)=>{
    //   this.timelinePost = JSON.parse(params['selectedTimelinePost']);
    //   console.log("timelinePostDetail", this.timelinePost);      
    //     this.initPage();
    //   });

    this.timelinePost = this.utilsService.getRoutingData('timelinePost');
    this.utilsService.removeRoutingData('timelinePost');

    if (this.timelinePost == null || this.timelinePost === undefined) {
      this.router.navigate(['/timelinePostManagement']);
    }else {
      this.initPage();
    }
  }

  ngOnInit() {
  }

  initPage(){

    this.actionTypes.push({label: 'Não possui ação clicável', value: null});
    this.actionTypes.push({label: 'Abrir link externo', value: 'EXTERNAL_LINK'});
    this.actionTypes.push({label: 'Abrir página do App', value: 'OPEN_APP_PAGE'});

    this.appPages.push({label: 'Selecione uma página do app', value: null});
    this.appPages.push({label: 'Notificações', value: 'Notificações'});
    this.appPages.push({label: 'Chat', value: 'Chat'});
    this.appPages.push({label: 'Lançamentos', value: 'Lançamentos'});
    this.appPages.push({label: 'Promoções', value: 'Promoções'});
    this.appPages.push({label: 'Meu Perfil', value: 'Meu Perfil'});
    this.appPages.push({label: 'Meus Pedidos', value: 'Meus Pedidos'});

    // Fill up consultant levels List
    // this.consultantLevels.push({label: 'Livre para todos os níveis', value: null});
    this.consultantLevels.push({label: '10 - Consultora de Beleza', value: 10});
    this.consultantLevels.push({label: '20 - Consultora Sênior', value: 20});
    this.consultantLevels.push({label: '30 - Iniciadora Estrela', value: 30});
    this.consultantLevels.push({label: '35 - Líder de Grupo', value: 35});
    this.consultantLevels.push({label: '40 - Futura Diretora', value: 40});
    this.consultantLevels.push({label: '45 - Diretora em Qualificação', value: 45});
    this.consultantLevels.push({label: '50 - Diretora', value: 50});
    this.consultantLevels.push({label: '60 - Diretora Sênior', value: 60});
    this.consultantLevels.push({label: '70 - Futura Diretora Executiva', value: 70});
    this.consultantLevels.push({label: '80 - Diretora Executiva', value: 80});
    this.consultantLevels.push({label: '85 - Diretora Executiva Elite', value: 85});
    this.consultantLevels.push({label: '90 - Diretora Nacional em Qualificação', value: 90});
    this.consultantLevels.push({label: '92 - Diretora Nacional', value: 92});
    this.consultantLevels.push({label: '95 - Diretora Nacional Sênior', value: 95});
    this.consultantLevels.push({label: '96 - Diretora Nacional Executiva', value: 96});
    this.consultantLevels.push({label: '97 - Diretora Nacional Executiva Elite', value: 97});
    this.consultantLevels.push({label: '99 - Emeritus', value: 99});
    
    // Fill up consultant statuses list
    this.consultantStatuses.push({label: 'Livre para todos os status', value: null});
    this.consultantStatuses.push({label: 'A', value: 'A'});
    this.consultantStatuses.push({label: 'N', value: 'N'});
    this.consultantStatuses.push({label: 'P', value: 'P'});
    this.consultantStatuses.push({label: 'T', value: 'T'});
    
    this.setForm();

    if(this.timelinePost.postType == 'TEXT')
    {
      // Set needed form validators
      this.editTimelinePostForm.controls['subTitle'].setValidators(Validators.compose([Validators.maxLength(50)]));
      this.editTimelinePostForm.controls['body'].setValidators(Validators.compose([Validators.required, Validators.maxLength(500)]));
    }
    else if(this.timelinePost.postType == 'IMAGE')
    {
      // Set needed form validators
      this.editTimelinePostForm.controls['imageUrl'].setValidators(Validators.compose([Validators.required, Validators.maxLength(1024)]));
    }
    else if(this.timelinePost.postType == 'VIDEO')
    {
      // Set needed form validators
      this.editTimelinePostForm.controls['videoUrl'].setValidators(Validators.compose([Validators.required, Validators.maxLength(1024)]));
      this.editTimelinePostForm.controls['imageUrl'].setValidators(Validators.compose([Validators.required, Validators.maxLength(1024)]));
    }
    else // EMBEDDED
    {
      // Set needed form validators
      // this.editTimelinePostForm.controls['embeddedCode'].setValidators(Validators.compose([Validators.required, Validators.maxLength(1024), ApplicationValidationService.urlValidator]));
      this.editTimelinePostForm.controls['embeddedCode'].setValidators(Validators.compose([Validators.required, Validators.maxLength(4096)]));
    }
  }

  setForm(){  
    this.startDate = new Date(this.timelinePost.startPublishDate);
    
    if(this.timelinePost.endPublishDate != null){
      this.endDate = new Date(this.timelinePost.endPublishDate);
    }
    
    this.editTimelinePostForm = this.formBuilder.group({
      postType: [this.timelinePost.postType, Validators.required],
      timelinePostTitle: [this.timelinePost.title, Validators.compose([Validators.required, Validators.maxLength(50)])],
      subTitle: [this.timelinePost.subTitle],
      body: [this.timelinePost.body],
      embeddedCode: [this.timelinePost.embeddedCode],
      imageUrl: [this.timelinePost.imageUrl],
      videoUrl: [this.timelinePost.videoUrl],
      shareableUrl: [this.timelinePost.shareableUrl, ApplicationValidationService.urlValidator],
      consultantLevelFilter: [this.timelinePost.consultantLevelFilter],
      consultantStatusFilter: [this.timelinePost.consultantStatusFilter],
      actionType: [null],
      appPage: [null],
      isExternalUrl: [this.timelinePost.isExternalUrl],
      actionUrl: [this.timelinePost.actionUrl],
      hasStartDate: [true],
      startPublishDate: [this.startDate],
      hasEndDate: [(this.timelinePost.endPublishDate != null)],
      endPublishDate: [this.endDate]
    });

    if(this.timelinePost.actionUrl != null){      
      if(this.timelinePost.isExternalUrl){
        this.editTimelinePostForm.controls['actionType'].setValue('EXTERNAL_LINK');
        this.editTimelinePostForm.controls['actionUrl'].setValidators(Validators.compose([Validators.required, Validators.maxLength(1024), ApplicationValidationService.urlValidator]));        
      }else{
        this.editTimelinePostForm.controls['actionType'].setValue('OPEN_APP_PAGE');
        this.editTimelinePostForm.controls['appPage'].setValue(this.timelinePost.actionUrl);
        this.editTimelinePostForm.controls['actionUrl'].setValidators(Validators.compose([Validators.required, Validators.maxLength(1024)]));
      }
    }

  }
  
  handleActionTypeSelection(type: string){

    this.editTimelinePostForm.controls['actionUrl'].clearValidators;
    this.editTimelinePostForm.controls['actionUrl'].setErrors(null);

    if(type == 'EXTERNAL_LINK')
    {
      this.editTimelinePostForm.controls['actionUrl'].setValidators(Validators.compose([Validators.required, Validators.maxLength(1024), ApplicationValidationService.urlValidator]));
      this.editTimelinePostForm.controls['actionUrl'].setValue(null);
      this.editTimelinePostForm.controls['isExternalUrl'].setValue(true);
    }
    else if(type == 'OPEN_APP_PAGE')
    {
      this.editTimelinePostForm.controls['actionUrl'].setValidators(Validators.compose([Validators.required, Validators.maxLength(1024)]));
      this.editTimelinePostForm.controls['actionUrl'].setValue(null);
      this.editTimelinePostForm.controls['isExternalUrl'].setValue(false);
    }
    else // null
    {
      this.editTimelinePostForm.controls['isExternalUrl'].setValue(false);
    }
  }

  handleAppPagesSelection(selectedValue: string){
    this.editTimelinePostForm.controls['actionUrl'].setValue(selectedValue);
  }
  
  handleStartDate(currentValue: boolean){
    
    this.editTimelinePostForm.controls['startPublishDate'].setErrors(null);
    this.editTimelinePostForm.controls["startPublishDate"].setValue(this.timelinePost.startPublishDate);

    if(!currentValue)
    {
      this.editTimelinePostForm.controls['startPublishDate'].clearValidators;
    }
    else
    {
      this.editTimelinePostForm.controls['startPublishDate'].setValidators(Validators.required);
    }
  }

  handleEndDate(currentValue: boolean){
    if(!currentValue)
    {
      this.editTimelinePostForm.controls["endPublishDate"].setValue(null);
      this.editTimelinePostForm.controls['endPublishDate'].setErrors(null);
      this.editTimelinePostForm.controls['endPublishDate'].clearValidators;
    }
    else
    {
      this.minEndDate = this.editTimelinePostForm.controls['startPublishDate'].value;
      this.editTimelinePostForm.controls['endPublishDate'].setValidators(Validators.required);
    }
  }

  checkScheduleDate(){
    if(this.editTimelinePostForm.controls['startPublishDate'].value != null && this.editTimelinePostForm.controls['endPublishDate'].value != null)
    {
      if(this.editTimelinePostForm.controls['startPublishDate'].value >= this.editTimelinePostForm.controls['endPublishDate'].value)
      {
        this.isScheduleValid = false;
        this.editTimelinePostForm.controls["startPublishDate"].setValue(null);
        this.editTimelinePostForm.controls["endPublishDate"].setValue(null);
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

  cancel(){
    this.router.navigate(['/timelinePostManagement']);  
  }

  saveForm(){

    this.loadingService.showLoading();

    let timelinePostUpdateRequest: ITimelinePostUpdateRequest = new ITimelinePostUpdateRequest();

    timelinePostUpdateRequest.timelinePostId = this.timelinePost.timelinePostId;    
    timelinePostUpdateRequest.title = this.editTimelinePostForm.controls["timelinePostTitle"].value;
    timelinePostUpdateRequest.subTitle = this.editTimelinePostForm.controls["subTitle"].value;
    timelinePostUpdateRequest.body = this.editTimelinePostForm.controls["body"].value;
    timelinePostUpdateRequest.shareableUrl = (this.editTimelinePostForm.controls['shareableUrl'].value === '' ? null : this.editTimelinePostForm.controls['shareableUrl'].value);
    timelinePostUpdateRequest.embeddedCode = this.editTimelinePostForm.controls["embeddedCode"].value;
    timelinePostUpdateRequest.consultantLevelFilter = this.editTimelinePostForm.controls["consultantLevelFilter"].value;
    timelinePostUpdateRequest.consultantStatusFilter = this.editTimelinePostForm.controls["consultantStatusFilter"].value;
    timelinePostUpdateRequest.actionUrl = this.editTimelinePostForm.controls["actionUrl"].value;
    timelinePostUpdateRequest.isExternalUrl = this.editTimelinePostForm.controls["isExternalUrl"].value;
    timelinePostUpdateRequest.startPublishDate = this.editTimelinePostForm.controls["startPublishDate"].value;
    timelinePostUpdateRequest.endPublishDate = this.editTimelinePostForm.controls["endPublishDate"].value;
    timelinePostUpdateRequest.isActive = true;
    
    console.log('edit-timelinePost/saveForm() - timelinePostUpdateRequest', timelinePostUpdateRequest);

    this.timelinePostService.updateTimelinePost(timelinePostUpdateRequest).subscribe((response)=>{
      this.loadingService.hideLoading();
      this.router.navigate(['/timelinePostManagement']);    
    },
    error=>{
      this.messageService.showErrorMessage('Houve um erro ao tentar editar o post', error);
      this.loadingService.hideLoading();
    });
  }

}