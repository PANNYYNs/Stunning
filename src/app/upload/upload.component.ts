import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private route:Router,
    private sanck:MatSnackBar,
    private afAuth : AngularFireAuth,
    private auth : AuthService

  ) { }

  genres = [
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
  tag_1 = [];
  username;
  isLoggedIn = false;
  number = 0;

  ngOnInit() {
    if (localStorage.getItem("isLoggedIn")==="true") {
      this.isLoggedIn = true;
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.username = user.email;
          this.isLoggedIn = true;
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
              this.username = user.email;
              this.isLoggedIn = true;
            }
          });
        }
      }
    );
  }
name = "Choose file";
task: AngularFireUploadTask;
percentage: Observable<number>;
snapshot: Observable<any>;
imgURL: string;


@ViewChild('fileInput') el: ElementRef;
  imageUrl: any = '';
  editFile: boolean = true;
  removeUpload: boolean = false;

  imgName = "";
  imgfile;

  uploadFile(event) {
    let reader = new FileReader();
    let file = event.target.files[0];
    this.imgfile = file;
    this.name = file.name;
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
      }
    }
  }

  startUpload(email) {
    var img = document.getElementById('imagesPreview'); 
    var w = img.clientWidth;
    var h = img.clientHeight;
    const path = `images/${Date.now()}_${this.imgName}`;
    const ref = this.storage.ref(path);
    this.task = this.storage.upload(path, this.imgfile);
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges().pipe(tap(), finalize(async() => {
        this.imgURL = await ref.getDownloadURL().toPromise();
        let id = this.firestore.createId();
        this.firestore.collection("images").doc(id).set({id:id,imgURL:this.imgURL,like:[],tag:this.tag_1,width:w,height:h,email:email,votenumber:this.number,date:new Date()})
        this.route.navigate(['']);
      }),
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
  
  tag(i){
    if(this.tag_1.indexOf(i) == -1){
    this.tag_1.push(i)
    }else{
      this.sanck.open("Tag has been added","close")
    }
  }

  deletetag(i){
    this.tag_1.splice(this.tag_1.indexOf(i),1);
  }
}