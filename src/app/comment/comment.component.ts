import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  constructor(
    private firestore: AngularFirestore,
      private sanck:MatSnackBar,
  ) { }
  @Input() comment;
  @Input() email;

  ngOnInit() {
  }

  delete(){
    this.firestore.collection("comments").doc(this.comment.commentid).delete()
    this.sanck.open("Delete success","close")
  }

}