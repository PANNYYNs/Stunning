import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  constructor(
    private firestore: AngularFirestore
  ) { }
  imageall ;
  explore = "Explore";
  ngOnInit() {
    this.firestore.collection("images").snapshotChanges().subscribe(val => {
        this.imageall = val.map( e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
            }
          })
      });
  }

  popular(){
    this.explore = "Popular";
    this.firestore.collection('images',votenumber=>votenumber.orderBy('votenumber','desc')).snapshotChanges().subscribe(
      val => {
        this.imageall = val.map( e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
            }
          })
      }
    );
  }
  upcoimg(){
    this.explore = "Upcoimg";
    this.firestore.collection('images',ref=>ref.orderBy('date','desc')).snapshotChanges().subscribe(
      val => {
        this.imageall = val.map( e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
            }
          })
      }
    );
  }
  latest(){
    this.explore = "Latest";
    this.firestore.collection('images',ref=>ref.orderBy('date')).snapshotChanges().subscribe(
      val => {
        this.imageall = val.map( e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
            }
          })
      }
    );
  }

  

}