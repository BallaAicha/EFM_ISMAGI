import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

  constructor(
    private authService:AuthService,private router:Router
  ) { }

  ngOnInit() {
  }
  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');

  }
}
