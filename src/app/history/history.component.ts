import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService }  from '../auth.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  idUrl
  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    private route: Router,
    private snack: MatSnackBar
  ) { 
    this.idUrl = this.route.url.split("/")[2]
   }

  history;
  isLoggedIn;
  email;
  imageid;

  ngOnInit() {
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
          this.firestore.collection("images").snapshotChanges().subscribe(val => {
              this.history = val.map( e => {
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
              this.firestore.collection("images").snapshotChanges().subscribe(val => {
              this.history = val.map( e => {
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
  getid(id){
    this.imageid = id;
  }
  deletephoto() {
    this.firestore
      .collection("images")
      .doc(this.imageid)
      .delete();
    this.route.navigate(['']);
    this.snack.open("Delete success", "close");
  }
}