import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

// Models
import { IAmazonUploadResponse, ILocalFileUploadResponse } from '../../../models/fileupload-model';
import { ITimelinePostCreateRequest } from '../../../models/timeline-post-model';

// Providers
import { ApplicationMessageService } from '../../../providers/application-message-service';
import { ApplicationLoadingService } from '../../../providers/application-loading-service';
import { ApplicationValidationService } from '../../../providers/application-validation-service';
import { TimelinePostService } from '../../../providers/timeline-post-service';
import { FileUploadService } from '../../../providers/fileupload-service';

@Component({
  selector: 'app-create-timeline-post',
  templateUrl: './create-timeline-post.component.html',
  styleUrls: ['./create-timeline-post.component.css'],
  providers: [ TimelinePostService, FileUploadService ]
})
export class CreateTimelinePostComponent implements OnInit {

  // Page attributes
  timelinePostTypes: SelectItem[] = [];
  consultantLevels: SelectItem[] = [];
  consultantStatuses: SelectItem[] = [];
  actionTypes:  SelectItem[] = [];
  appPages: SelectItem[] = [];

  imageMinHeight = 0;
  imageMaxHeight = 0;
  imageMinWidth = 0;
  imageMaxWidth = 0;

  timeNow: Date = null;
  minEndDate: Date = null;
  isScheduleValid = true;

  // Advertiver params
  newTimelinePostForm: FormGroup = null;
  timelinePostImageParams: {currentFile: File, currentFileUrl: string, naturalWidth?: number, naturalHeight?: number } = {currentFile: null, currentFileUrl: null, naturalWidth: null, naturalHeight: null};
  timelinePostVideoParams: {currentFile: File, currentFileUrl: string} = {currentFile: null, currentFileUrl: null};

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private messageService: ApplicationMessageService,
    private loadingService: ApplicationLoadingService,
    private fileuploadService: FileUploadService,
    private timelinePostService: TimelinePostService
  ) {

    this.timeNow = new Date();
    this.minEndDate = this.timeNow;

    this.setForm(null);

    this.timelinePostTypes.push({label: 'Texto', value: 'TEXT'});
    this.timelinePostTypes.push({label: 'Imagem', value: 'IMAGE'});
    this.timelinePostTypes.push({label: 'Vídeo', value: 'VIDEO'});
    this.timelinePostTypes.push({label: 'HTML Incoporado', value: 'EMBEDDED'});

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
  }

  ngOnInit() {
  }

  setForm(postType: string = null) {

    this.newTimelinePostForm = this.formBuilder.group({
      postType: [postType, Validators.required],
      timelinePostTitle: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      subTitle: [null],
      body: [null],
      embeddedCode: [null],
      imageUrl: [null],
      videoUrl: [null],
      shareableUrl: [null, ApplicationValidationService.urlValidator],
      consultantLevelFilter: [null],
      consultantStatusFilter: [null],
      actionType: [null],
      isExternalUrl: [false],
      actionUrl: [null],
      hasStartDate: [false],
      startPublishDate: [this.timeNow],
      hasEndDate: [false],
      endPublishDate: [null]
    });

    this.imageMinHeight = 0;
    this.imageMaxHeight = 0;
    this.imageMinWidth = 0;
    this.imageMaxWidth = 0;

    this.timelinePostImageParams.currentFile = null;
    this.timelinePostImageParams.currentFileUrl = null;
    this.timelinePostImageParams.naturalWidth = null;
    this.timelinePostImageParams.naturalHeight = null;
    this.timelinePostVideoParams.currentFile = null;
    this.timelinePostVideoParams.currentFileUrl = null;
  }

  handleTypeSelection(type: string) {

    // this.setForm(type);

    this.newTimelinePostForm.controls['postType'].setValue(type);
    this.clearFormValidators();

    if (type === 'TEXT') {
      // Set needed form validators
      this.newTimelinePostForm.controls['subTitle'].setValidators(Validators.compose([Validators.maxLength(50)]));
      this.newTimelinePostForm.controls['body'].setValidators(Validators.compose([Validators.required, Validators.maxLength(500)]));
    }else if (type === 'IMAGE') {
      this.imageMinHeight = 500;
      this.imageMaxHeight = 690;
      this.imageMinWidth = 500;
      this.imageMaxWidth = 500;

      // Set needed form validators
      this.newTimelinePostForm.controls['imageUrl'].setValidators(Validators.compose([Validators.required, Validators.maxLength(1024)]));
    }else if (type === 'VIDEO') {
      this.imageMinHeight = 720;
      this.imageMaxHeight = 720;
      this.imageMinWidth = 1280;
      this.imageMaxWidth = 1280;

      // Set needed form validators
      this.newTimelinePostForm.controls['videoUrl'].setValidators(Validators.compose([Validators.required, Validators.maxLength(1024)]));
      this.newTimelinePostForm.controls['imageUrl'].setValidators(Validators.compose([Validators.required, Validators.maxLength(1024)]));
    }else {// EMBEDDED
      // Set needed form validators
      this.newTimelinePostForm.controls['embeddedCode'].setValidators(Validators.compose([Validators.required, Validators.maxLength(4096)]));
      // Need to clear this params
      this.newTimelinePostForm.controls['subTitle'].setValue(null);
      this.newTimelinePostForm.controls['body'].setValue(null);
    }
  }

  clearFormValidators() {
    this.newTimelinePostForm.controls['subTitle'].clearValidators();
    this.newTimelinePostForm.controls['body'].clearValidators();
    this.newTimelinePostForm.controls['imageUrl'].clearValidators();
    this.newTimelinePostForm.controls['videoUrl'].clearValidators();
    this.newTimelinePostForm.controls['embeddedCode'].clearValidators();

    this.imageMinHeight = 0;
    this.imageMaxHeight = 0;
    this.imageMinWidth = 0;
    this.imageMaxWidth = 0;

    this.timelinePostImageParams.currentFile = null;
    this.timelinePostImageParams.currentFileUrl = null;
    this.timelinePostImageParams.naturalWidth = null;
    this.timelinePostImageParams.naturalHeight = null;
    this.timelinePostVideoParams.currentFile = null;
    this.timelinePostVideoParams.currentFileUrl = null;
  }

  handleActionTypeSelection(type: string) {

    this.newTimelinePostForm.controls['actionUrl'].clearValidators();
    this.newTimelinePostForm.controls['actionUrl'].setErrors(null);

    if (type === 'EXTERNAL_LINK') {
      this.newTimelinePostForm.controls['actionUrl'].setValidators(Validators.compose([Validators.required, Validators.maxLength(1024), ApplicationValidationService.urlValidator]));
      this.newTimelinePostForm.controls['actionUrl'].setValue(null);
      this.newTimelinePostForm.controls['isExternalUrl'].setValue(true);

    }else if (type === 'OPEN_APP_PAGE') {
      this.newTimelinePostForm.controls['actionUrl'].setValidators(Validators.compose([Validators.required, Validators.maxLength(1024)]));
      this.newTimelinePostForm.controls['actionUrl'].setValue(null);
      this.newTimelinePostForm.controls['isExternalUrl'].setValue(false);
    }else { // null
      this.newTimelinePostForm.controls['isExternalUrl'].setValue(false);
    }
  }

  handleAppPagesSelection(selectedValue: string) {
    this.newTimelinePostForm.controls['actionUrl'].setValue(selectedValue);
  }

  handleStartDate(currentValue: boolean) {
    this.newTimelinePostForm.controls['startPublishDate'].setErrors(null);
    this.newTimelinePostForm.controls['startPublishDate'].setValue(this.timeNow);

    if (!currentValue) {
      this.newTimelinePostForm.controls['startPublishDate'].clearValidators();
    }else {
      this.newTimelinePostForm.controls['startPublishDate'].setValidators(Validators.required);
    }
  }

  handleEndDate(currentValue: boolean) {
    if (!currentValue) {
      this.newTimelinePostForm.controls['endPublishDate'].setValue(null);
      this.newTimelinePostForm.controls['endPublishDate'].setErrors(null);
      this.newTimelinePostForm.controls['endPublishDate'].clearValidators();
    }else {
      this.minEndDate = this.newTimelinePostForm.controls['startPublishDate'].value;
      this.newTimelinePostForm.controls['endPublishDate'].setValidators(Validators.required);
    }
  }

  checkScheduleDate() {
    if (this.newTimelinePostForm.controls['startPublishDate'].value != null && this.newTimelinePostForm.controls['endPublishDate'].value != null) {
      if (this.newTimelinePostForm.controls['startPublishDate'].value >= this.newTimelinePostForm.controls['endPublishDate'].value) {
        this.isScheduleValid = false;
        this.newTimelinePostForm.controls['startPublishDate'].setValue(null);
        this.newTimelinePostForm.controls["endPublishDate"].setValue(null);
        this.messageService.showErrorMessage('Agendamento Inválido', 'A data de fim da campanha deve ser maior do que a data de publicação');
      }else {
        this.isScheduleValid = true;
      }
    }else {
      this.isScheduleValid = true;
    }
  }

  checkImageResponse(response: ILocalFileUploadResponse) {
    console.log('create-timeline-post/checkImageResponse()', response);
    
    if (response.isSuccess) {
      this.timelinePostImageParams.currentFile = response.file;
    }else {
      this.timelinePostImageParams.currentFile = null;
      this.messageService.showErrorMessage('Invalid image', response.message);
    }

    this.timelinePostImageParams.currentFileUrl = null;
    this.timelinePostImageParams.naturalWidth = null;
    this.timelinePostImageParams.naturalHeight = null;
    this.newTimelinePostForm.controls['imageUrl'].setValue(null);
  }

  clearImage() {
    this.timelinePostImageParams.currentFile = null;
    this.timelinePostImageParams.currentFileUrl = null;
    this.timelinePostImageParams.naturalWidth = null;
    this.timelinePostImageParams.naturalHeight = null;
    this.newTimelinePostForm.controls['imageUrl'].setValue(null);
  }

  saveImage() {
    this.loadingService.showLoading();

    if (this.timelinePostImageParams.currentFile != null) {
      this.fileuploadService.uploadAppTimelinePost(this.timelinePostImageParams.currentFile).subscribe((data: IAmazonUploadResponse) => {
        if (data.isSuccess) {
          this.timelinePostImageParams.currentFile = null;
          this.timelinePostImageParams.currentFileUrl = data.fileUrl;
          this.newTimelinePostForm.controls['imageUrl'].setValue(data.fileUrl);
        }else {
          this.timelinePostImageParams.naturalWidth = null;
          this.timelinePostImageParams.naturalHeight = null;
          this.timelinePostImageParams.currentFileUrl = null;
              this.newTimelinePostForm.controls['imageUrl'].setValue(null);
          this.messageService.showErrorMessage('Upload server error', data.message);
        }
        this.loadingService.hideLoading();
      }, error => {
          this.timelinePostImageParams.currentFileUrl = null;
          this.timelinePostImageParams.naturalWidth = null;
          this.timelinePostImageParams.naturalHeight = null;
          this.newTimelinePostForm.controls['imageUrl'].setValue(null);
          this.loadingService.hideLoading();
          this.messageService.showErrorMessage('Upload server error', error);
      });
    }else {
      this.loadingService.hideLoading();
      this.messageService.showErrorMessage('Error trying to upload a image', 'File not found');
    }
  }

  timelinePostImageLoaded(event) {
    console.log('create-timeline-post/timelinePostImageLoaded()', event);
    console.log('create-timeline-post/timelinePostImageLoaded()', 'naturalWidth', event.path[0].naturalWidth);
    console.log('create-timeline-post/timelinePostImageLoaded()', 'naturalHeight', event.path[0].naturalHeight);
    this.timelinePostImageParams.naturalWidth = event.path[0].naturalWidth;
    this.timelinePostImageParams.naturalHeight = event.path[0].naturalHeight;
  }

  removeCurrentImage() {
    this.timelinePostImageParams.currentFile = null;
    this.timelinePostImageParams.currentFileUrl = null;
    this.timelinePostImageParams.naturalWidth = null;
    this.timelinePostImageParams.naturalHeight = null;
    this.newTimelinePostForm.controls['imageUrl'].setValue(null);
  }

  checkVideoResponse(response: ILocalFileUploadResponse) {
    if (response.isSuccess) {
      this.timelinePostVideoParams.currentFile = response.file;
    }else {
      this.timelinePostVideoParams.currentFile = null;
      this.messageService.showErrorMessage('Invalid video', response.message);
    }
    this.timelinePostVideoParams.currentFileUrl = null;
    this.newTimelinePostForm.controls['videoUrl'].setValue(null);
  }

  clearVideo() {
    this.timelinePostVideoParams.currentFile = null;
    this.timelinePostVideoParams.currentFileUrl = null;
    this.newTimelinePostForm.controls['videoUrl'].setValue(null);
  }

  saveVideo() {
    this.loadingService.showLoading();

    if (this.timelinePostVideoParams.currentFile != null) {
      this.fileuploadService.uploadVideo(this.timelinePostVideoParams.currentFile).subscribe((data: IAmazonUploadResponse) => {
        if (data.isSuccess) {
          this.timelinePostVideoParams.currentFile = null;
          this.timelinePostVideoParams.currentFileUrl = data.fileUrl;
          this.newTimelinePostForm.controls['videoUrl'].setValue(data.fileUrl);
        }else {
          this.timelinePostVideoParams.currentFileUrl = null;
          this.newTimelinePostForm.controls['videoUrl'].setValue(null);
          this.messageService.showErrorMessage('Upload server error', data.message);
        }
        this.loadingService.hideLoading();
      }, error => {
          this.loadingService.hideLoading();
          this.timelinePostVideoParams.currentFileUrl = null;
          this.newTimelinePostForm.controls['videoUrl'].setValue(null);
          this.messageService.showErrorMessage('Upload server error', error);
      });
    }else {
      this.loadingService.hideLoading();
      this.messageService.showErrorMessage('Error trying to upload a video', 'Arquivo não encontrado');
    }
  }

  removeCurrentVideo() {
    this.timelinePostVideoParams.currentFile = null;
    this.timelinePostVideoParams.currentFileUrl = null;
    this.newTimelinePostForm.controls['videoUrl'].setValue(null);
  }

  clearForm() {
    this.router.navigate(['/timelinePostManagement']);
  }

  saveForm() {

    this.loadingService.showLoading();

    let timelinePostCreateRequest: ITimelinePostCreateRequest = new ITimelinePostCreateRequest();

    timelinePostCreateRequest.title = this.newTimelinePostForm.controls['timelinePostTitle'].value;
    timelinePostCreateRequest.subTitle = this.newTimelinePostForm.controls['subTitle'].value;
    timelinePostCreateRequest.body = this.newTimelinePostForm.controls['body'].value;
    timelinePostCreateRequest.postType = this.newTimelinePostForm.controls['postType'].value;
    timelinePostCreateRequest.imageUrl = this.newTimelinePostForm.controls['imageUrl'].value;
    if (timelinePostCreateRequest.imageUrl != null) {
      timelinePostCreateRequest.imageNaturalWidth = this.timelinePostImageParams.naturalWidth;
      timelinePostCreateRequest.imageNaturalHeight = this.timelinePostImageParams.naturalHeight;
    }

    timelinePostCreateRequest.videoUrl = this.newTimelinePostForm.controls['videoUrl'].value;
    timelinePostCreateRequest.embeddedCode = this.newTimelinePostForm.controls['embeddedCode'].value;
    timelinePostCreateRequest.shareableUrl = this.newTimelinePostForm.controls['shareableUrl'].value;
    timelinePostCreateRequest.consultantLevelFilter = this.newTimelinePostForm.controls['consultantLevelFilter'].value;
    timelinePostCreateRequest.consultantLevelFilter = this.newTimelinePostForm.controls['consultantStatusFilter'].value;
    timelinePostCreateRequest.actionUrl = this.newTimelinePostForm.controls['actionUrl'].value;
    timelinePostCreateRequest.isExternalUrl = this.newTimelinePostForm.controls['isExternalUrl'].value;
    timelinePostCreateRequest.startPublishDate = this.newTimelinePostForm.controls['startPublishDate'].value;
    timelinePostCreateRequest.endPublishDate = this.newTimelinePostForm.controls['endPublishDate'].value;

    console.log('create-timelinePost/saveForm() - timelinePostCreateRequest', timelinePostCreateRequest);

    this.timelinePostService.createTimelinePost(timelinePostCreateRequest).subscribe((response) => {
      this.loadingService.hideLoading();
      this.router.navigate(['/timelinePostManagement']);
    }, error => {
      this.messageService.showErrorMessage('Houve um erro ao tentar criar o post', error);
      this.loadingService.hideLoading();
    });
  }

}
