import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private firestore: AngularFirestore 
  ) { }

  imagesall;

  ngOnInit() {
    this.firestore.collection("images").snapshotChanges().subscribe(val => {
        this.imagesall = val.map( e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
            }
          })
      });
  }
}