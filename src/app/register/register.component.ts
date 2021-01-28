import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private afAuth: AngularFireAuth,
    private route : Router,
    private sanck : MatSnackBar,
    private firestore: AngularFirestore,
  ) { }
  
  ngOnInit() {
  }
  register(email,password,cpassword){
    if(password == cpassword){
      this.afAuth.auth.createUserWithEmailAndPassword(email, password,).then(user => {
        let userd = {
          email:email,
          admin:false,
          date:new Date(),
          datelogin:new Date()
        }
        this.firestore.collection("user").doc(email).set(userd);
      }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.sanck.open(errorMessage,"close")
      });
      this.sanck.open("Register success","close")
      this.route.navigate(['login']);
    }else{
      this.sanck.open("รหัสผ่านไม่ตรงกัน","close")
    }
  }
}