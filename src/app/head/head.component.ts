import { Component, OnInit } from '@angular/core';
import { AuthService }  from '../auth.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    private route: Router,
    private sanck:MatSnackBar,
    private firestore: AngularFirestore,
  ) { }

  isLoggedIn = false;
  Category = "Category";
  email;
  admin = false;
  genres = [
    "All",
    "Animals",
    "Architecture&Buildings",
    "Backgrounds&Textures",
    "Beauty&Fashion",
    "Business&Finance",
    "Computer&Communication",
    "Education",
    "Emotions",
    "Food&Drink",
    "Health&Medical",
    "Industry&Craft",
    "Music",
    "Nature&Landscapes",
    "PeoplePlaces&Monuments",
    "Places&Monuments",
    "Religion",
    "Science&Technology",
    "Sports",
    "Transportation&Traffic",
    "Travel&Vacation"
  ]

  ngOnInit() {
    this.auth.isLoggedIn.subscribe(val => this.isLoggedIn = val);
    if (localStorage.getItem("isLoggedIn")==="true") {
      this.isLoggedIn = true;
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.email = user.email;
          this.isLoggedIn = true;
          this.firestore.collection("user",ref =>ref.where("email","==",user.email).limit(1)).snapshotChanges().subscribe(val => {
            val.map(e => {
              if( e.payload.doc.data()["admin"] == true){
                this.admin = true;
              }
            })
          })
        }
      });
    }
    this.auth.callAuth.subscribe(
      () => {
        this.auth.isLoggedIn.subscribe(val => this.isLoggedIn = val);
        if (localStorage.getItem("isLoggedIn")==="true") {
          this.isLoggedIn = true;
          this.afAuth.auth.onAuthStateChanged(user => {
            if (user) {
              this.email = user.email;
              this.isLoggedIn = true;
              this.firestore.collection("user",ref =>ref.where("email","==",user.email).limit(1)).snapshotChanges().subscribe(val => {
              val.map(e => {
                if( e.payload.doc.data()["admin"] == true){
                  this.admin = true;
                }
              })
            })
            }
          });
        }
      }
    );
  }
  logout() {
    this.afAuth.auth.signOut();
    this.auth.refreshAuth();
    this.auth.logout();
    this.auth.isLoggedIn.subscribe(val => this.isLoggedIn = val);
    localStorage.setItem("isLoggedIn","false");
    if (localStorage.getItem("isLoggedIn")==="false") {
      this.isLoggedIn = false;
      this.email = "";
    }
    this.admin = false;
    this.sanck.open("Logout success","close")
    this.route.navigate(['login']);
  }

  upload(){
    this.route.navigate(['upload']);
  }
  Category_(p){
    this.Category = p;
  }
  cc(){
    if (this.Category != "All")
      this.Category = "Category";
  }
  explore(){
    this.Category = "Category";
  }
}