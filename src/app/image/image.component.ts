import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  constructor(
    private firestore: AngularFirestore
  ) { }
  
  @Input() image
  number;
  count = 0;

  ngOnInit() {
    this.number = this.image.like.length;
    this.firestore.collection("comments").snapshotChanges().subscribe(val => {
        val.map( e => {
          if(e.payload.doc.data()["id"]== this.image.id){
            this.count++;
          }
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
            }
          })
      });
  }
}