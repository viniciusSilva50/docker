import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

// Providers
import { ApplicationValidationService } from '../../../providers/application-validation-service';
import { ApplicationLoadingService } from '../../../providers/application-loading-service';
import { ApplicationMessageService } from '../../../providers/application-message-service';
import { SystemUserService } from '../../../providers/system-user-service';
import { ContextService } from '../../../providers/context-service';

// Models
import { IUser, IUserUpdateRequest } from '../../../models/user-model';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  providers: [ SystemUserService ]
})
export class MyProfileComponent implements OnInit {

  loggedUser: IUser = null;

  // Form
  userForm: FormGroup = null;

  constructor(
      private loadingService: ApplicationLoadingService,
      private systemUserService: SystemUserService,
      private messageService: ApplicationMessageService,
      private context: ContextService,
      private router: Router,
      private formBuilder: FormBuilder,
      private location: Location
    ) {

    this.loadingService.showLoading();

    this.userForm = this.formBuilder.group({
      fullName: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      isChangePassword: [false],
      password: [null],
      confirmPassword: [null]
    });

    const userToken = this.context.get(ContextService.UserToken);

    if (userToken != null || userToken !== undefined) {
      this.systemUserService.getUser(userToken.userId).subscribe((user: IUser) => {
        this.loggedUser = user;
        this.fillUserInfo();
      },
        error => {
          this.loadingService.hideLoading();
          this.messageService.showErrorMessage('Ops! Houve um problema', 'Não foi possivel recuperar os dados de usuário');
          this.router.navigate(['landing']);
        });
    }else {
      this.router.navigate(['/landing']);
    }
  }

  ngOnInit() {
  }

  fillUserInfo() {
    this.loadingService.hideLoading();

    this.userForm.markAsPristine();
    this.userForm.controls['fullName'].setValue(this.loggedUser.name);
    this.userForm.controls['password'].setValue(null);
    this.userForm.controls['confirmPassword'].setValue(null);
    this.userForm.controls['isChangePassword'].setValue(false);
  }

  handleChangePassword(currentValue: boolean) {

    this.userForm.controls['password'].setValue(null);
    this.userForm.controls['password'].markAsPending();
    this.userForm.controls['confirmPassword'].setValue(null);
    this.userForm.controls['confirmPassword'].markAsPending();

    if (currentValue) {
      this.userForm.controls['password'].setValidators(Validators.compose([Validators.required, ApplicationValidationService.passwordValidator]));
      this.userForm.controls['confirmPassword'].setValidators(Validators.compose([Validators.required, ApplicationValidationService.passwordValidator, ApplicationValidationService.compareValues('password')]));
    }else {
      this.userForm.controls['password'].clearValidators();
      this.userForm.controls['confirmPassword'].clearValidators();
      this.userForm.controls['password'].setErrors(null);
      this.userForm.controls['confirmPassword'].setErrors(null);
    }
  }

  saveForm() {

    this.loadingService.showLoading();
    let systemUserUpdateRequest: IUserUpdateRequest = new IUserUpdateRequest();

    // Immutable
    systemUserUpdateRequest.id = this.loggedUser.id;

    // Updates
    systemUserUpdateRequest.name = this.userForm.controls['fullName'].value;
    systemUserUpdateRequest.password = this.userForm.controls['password'].value;

    this.systemUserService.updateUser(systemUserUpdateRequest).subscribe((user: IUser) => {
      this.loggedUser = user;
      this.messageService.showSuccessMessage('Atualizado com sucesso', 'O seu perfil foi atualizado');
      this.fillUserInfo();
    },
    error => {
      this.loadingService.hideLoading();
      this.messageService.showErrorMessage('Ops! Houve um problema', 'Não foi possivel atualizar os dados de usuário');
    });
  }

  cancel() {
    this.location.back();
  }
}
