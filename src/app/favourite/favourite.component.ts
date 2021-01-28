import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService }  from '../auth.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css']
})
export class FavouriteComponent implements OnInit {

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    private route: Router
  ) { 
    this.idUrl = this.route.url.split("/")[2]
   }

  favourite;
  isLoggedIn;
  email;
  idUrl;

  ngOnInit() {
    this.auth.isLoggedIn.subscribe(val => this.isLoggedIn = val);
    if (localStorage.getItem("isLoggedIn")==="true") {
      this.isLoggedIn = true;
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.email = user.email;
          this.isLoggedIn = true;
          if (user.email != this.idUrl){
              this.route.navigate(['']);
            }

          this.firestore.collection("images",ref=>ref.where("like","array-contains",this.email)).snapshotChanges().subscribe(val => {
              this.favourite = val.map( e => {
                return {
                  id: e.payload.doc.id,
                  ...e.payload.doc.data()
                  }
                })
            });

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
              if (user.email != this.idUrl){
              this.route.navigate(['']);
              }
              this.email = user.email;
              this.isLoggedIn = true;
              
              this.firestore.collection("images",ref=>ref.where("like","array-contains",this.email)).snapshotChanges().subscribe(val => {
              this.favourite = val.map( e => {
                return {
                  id: e.payload.doc.id,
                  ...e.payload.doc.data()
                  }
                })
              });

            }
          });
        }
      }
    );
  }
}