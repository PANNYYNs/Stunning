import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { AuthService }  from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private route: Router,
    private afAuth: AngularFireAuth,
    private auth: AuthService,
    private sanck :MatSnackBar,
    private firestore: AngularFirestore,
  ) { }

  ngOnInit() {

  }
  login(email,password){
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(user => {
      this.firestore.collection("user").doc(email).update({datelogin:new Date()})
      this.auth.login();
      this.auth.refreshAuth();
      this.route.navigate(['']);
      this.sanck.open("Login success","close")
      }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.sanck.open(errorMessage,"close")
      });
  }

}