import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable()
export class AdminGuard implements CanActivate {

  isLoggedIn: boolean = false;

  constructor(
    private afAuth : AngularFireAuth,
    private route : Router,
    private firestore: AngularFirestore,
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) this.isLoggedIn = true;
      else this.isLoggedIn = false;
    });
  }
  checkUser() {
    return Observable.create(obs => {
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.isLoggedIn = true
          this.firestore.collection("user",ref =>ref.where("email","==",user.email).limit(1)).snapshotChanges().subscribe(val => {
            val.map(e => {
              if( e.payload.doc.data()["admin"] != true){
                this.route.navigate(['']);
              }
            })
          })
        }
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
