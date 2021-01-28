import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthGuard implements CanActivate {

  isLoggedIn: boolean = false;

  constructor(
    private afAuth : AngularFireAuth,
    private route : Router
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) this.isLoggedIn = true;
      else this.isLoggedIn = false;
    });
  }

  checkUser() {
    return Observable.create(obs => {
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) this.isLoggedIn = true;
        else {
          this.isLoggedIn = false;
          this.route.navigate(['']);
        }
        obs.next(this.isLoggedIn);
      });
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.checkUser();  
  }
}
