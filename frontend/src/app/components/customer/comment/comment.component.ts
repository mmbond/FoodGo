import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.sass']
})
export class CommentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  private orders() {
    this.router.navigate(['customer/']);
  }

  private showComments() : boolean {
    return false;
  }
}
