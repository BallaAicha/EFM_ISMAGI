import {Component, OnInit, signal} from '@angular/core';
import {LoadingController} from "@ionic/angular";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage  {
  isLoading = false;
  isLogin = true;

  navigateToRegisterPage() {}

  constructor(
    private loadingCtrl: LoadingController,
    private authservice: AuthService,
    private router: Router) { }
  onLogin() {
    console.log('login');

    this.isLoading = true;
    this.authservice.login();
    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...' }).then(loadingEl => {
      loadingEl.present();
      setTimeout(() => {
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      }, 1500);
    });




  }

  onSubmit(form: NgForm) {
    console.log(form);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);
    if (this.isLogin) {

    } else {

    }
  }
  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

}
