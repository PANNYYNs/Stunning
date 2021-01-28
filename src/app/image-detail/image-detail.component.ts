import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFireStorage,
  AngularFireUploadTask
} from "@angular/fire/storage";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as firebase from "firebase/app";

@Component({
  selector: "app-image-detail",
  templateUrl: "./image-detail.component.html",
  styleUrls: ["./image-detail.component.css"]
})
export class ImageDetailComponent implements OnInit {
  idUrl;
  constructor(
    private firestore: AngularFirestore,
    private route: Router,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    private storageRef: AngularFireStorage,
    private snack: MatSnackBar
  ) {
    this.idUrl = this.route.url.split("/")[2];
  }
  images_;
  isLoggedIn = false;
  username;
  check;
  number = 0;
  commentAll;
  inputvalue = "";

  ngOnInit() {
    this.firestore
      .collection("comments", ref => ref.orderBy("date", "desc"))
      .snapshotChanges()
      .subscribe(val => {
        this.commentAll = val.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          };
        });
      });

    this.firestore
      .collection("images")
      .snapshotChanges()
      .subscribe(val => {
        this.number = 0;
        this.images_ = val.map(e => {
          if (this.idUrl == e.payload.doc.data()["id"]) {
            this.number = e.payload.doc.data()["like"].length;
          }
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          };
        });
      });
    if (localStorage.getItem("isLoggedIn") === "true") {
      this.isLoggedIn = true;
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.username = user.email;
          this.isLoggedIn = true;
        }
      });
    }
    this.auth.callAuth.subscribe(() => {
      this.auth.isLoggedIn.subscribe(val => (this.isLoggedIn = val));
      if (localStorage.getItem("isLoggedIn") === "true") {
        this.isLoggedIn = true;
        this.afAuth.auth.onAuthStateChanged(user => {
          if (user) {
            this.username = user.email;
            this.isLoggedIn = true;
          }
        });
      }
    });
    this.firestore
      .collection("images", ref => ref.where("id", "==", this.idUrl))
      .snapshotChanges()
      .subscribe(val => {
        val.map(e => {
          if (e.payload.doc.data()["like"].indexOf(this.username) != -1) {
            this.check = true;
          } else {
            this.check = false;
          }
        });
      });
  }

  like() {
    this.firestore
      .collection("images")
      .doc(this.idUrl)
      .update({
        like: firebase.firestore.FieldValue.arrayUnion(this.username)
      });
    this.firestore.collection('images').doc(this.idUrl).update({votenumber:firebase.firestore.FieldValue.increment(1)})
  }

  dislike() {
    this.firestore
      .collection("images")
      .doc(this.idUrl)
      .update({
        like: firebase.firestore.FieldValue.arrayRemove(this.username)
      });
    this.firestore.collection('images').doc(this.idUrl).update({votenumber:firebase.firestore.FieldValue.increment(-1)})
  }

  addcomment(comment) {
    if (this.isLoggedIn != false) {
      if (comment != "") {
        let id = this.firestore.createId();
        this.firestore
          .collection("comments")
          .doc(id)
          .set({
            id: this.idUrl,
            comment: comment,
            date: firebase.firestore.Timestamp.now(),
            email: this.username,
            commentid: id
          });
        this.inputvalue = null;
      } else {
        this.snack.open("comment is empty", "close");
      }
    } else {
      this.snack.open(" Please login ", "Close");
    }
  }

  addcomment2(event, comment) {
    if (event.keyCode == 13 || event.enter) {
      if (this.isLoggedIn != false) {
        if (comment != "") {
          let id = this.firestore.createId();
          this.firestore
            .collection("comments")
            .doc(id)
            .set({
              id: this.idUrl,
              comment: comment,
              date: firebase.firestore.Timestamp.now(),
              email: this.username,
              commentid: id
            });
          this.inputvalue = null;
        } else {
          this.snack.open("comment is empty", "close");
        }
      } else {
        this.snack.open(" Please login ", "Close");
      }
    }
  }
  plaselogin() {
    this.snack.open(" Please login ", "Close");
  }
}
