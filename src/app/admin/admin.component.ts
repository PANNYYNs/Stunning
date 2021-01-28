import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AuthService }  from '../auth.service';
import { AngularFireAuth } from "@angular/fire/auth";


@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  idUrl;
  constructor(
    private firestore: AngularFirestore,
    private route: Router,
    private snack: MatSnackBar,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
  ) {
    this.idUrl = this.route.url.split("/")[2]
  }

  imagesall;
  imageid;
  chack : false;
  typeChart: any;
  dataChart: any;
  optionsChart: any;
  list_genre = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
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
  ];
  userall;
  email_1;
  admin;
  isLoggedIn;
  email;

  ngOnInit() {
    this.auth.isLoggedIn.subscribe(val => this.isLoggedIn = val);
    if (localStorage.getItem("isLoggedIn")==="true") {
      this.isLoggedIn = true;
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.email = user.email;
          this.isLoggedIn = true;
        }
      });
    }
    this.firestore.collection("user").snapshotChanges().subscribe(val => {
        this.userall = val.map( e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
            }
          })
      });
    this.firestore
      .collection("images")
      .snapshotChanges()
      .subscribe(val => {
        this.list_genre = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.imagesall = val.map(e => {
          e.payload.doc.data()["tag"].forEach(obj => {
            this.list_genre[this.genres.indexOf(obj)]++;
          });
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          };
        });
        console.log(this.list_genre)
        this.typeChart = "bar"; //'line','bar','radar','pie','doughnut','polarArea','bubble','scatter'
          this.dataChart = {
            labels: this.genres,
            datasets: [
              {
                label: "Genres Stats Chart",
                data: this.list_genre,
                backgroundColor: ["blue","pink","yellow","purple","red","greenyellow","orange","gold","darkgreen","silver","aqua","brown","indigo","gray","palegreen","deeppink","orangered","snow","darkturquoise","darkviolet"
                ]
              }
            ]
          };
      });
  }
  getId(id) {
    this.imageid = id;
  }
  deletephoto() {
    this.firestore
      .collection("images")
      .doc(this.imageid)
      .delete();
    this.route.navigate(["admin"]);
    this.snack.open("Delete success", "close");
  }

  ngAfterViewInit() {
    $("#2").hide();
    $("#3").hide();

    $("#b1").click(function() {
      $("#1").show();
      $("#2").hide();
      $("#3").hide();
    });
    $("#b2").click(function() {
      $("#1").hide();
      $("#2").show();
      $("#3").hide();
    });
    $("#b3").click(function() {
      $("#1").hide();
      $("#2").hide();
      $("#3").show();
    });
  }

  getdata(email,admin){
    this.admin = admin;
    this.email_1 = email;
  }
  
  change(){
    if(this.email_1 != "admin@admin.com"){
      if(this.email != this.email_1){
        if(this.admin == true){
          this.firestore.collection("user").doc(this.email_1).update({admin:false});
        }else{
          this.firestore.collection("user").doc(this.email_1).update({admin:true});
        }
        this.route.navigate(["admin"]);
        this.snack.open("Change success", "close");
      }else{
        this.snack.open("You can't change your status","close")
      }
    }else{
      this.snack.open("You can't change admin status","close")
    }
  }
}