import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  idUrl;
  constructor(
    private firestore:AngularFirestore,
    private route: Router,
    
  ) {
    this.route.events.subscribe((val) => {
      this.idUrl = this.route.url.split("/")[2]
      if(this.idUrl == "All"){
        this.route.navigate([''])
      }
      this.idUrl = this.idUrl.replace("%2","/");
      this.firestore.collection("images",ref=>ref.where("tag","array-contains",this.idUrl)).snapshotChanges().subscribe(val => {
          this.images = val.map( e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data()
              }
            })
        });
    }) 
    
   }
  
  images;

  ngOnInit() {
    
  }

}