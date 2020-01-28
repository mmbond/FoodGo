import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.sass']
})
export class PaginationComponent implements OnInit {
  
  @Input() total:  Array<number>;
  @Input() current: number;
  @Output() currentPageEvent = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
  }

  sendCurrentPage(currentPage : number) {
    this.currentPageEvent.emit(currentPage);
  }

  nextPage() {
    this.currentPageEvent.emit(this.current+1);
  }

  prevPage() {
    this.currentPageEvent.emit(this.current-1);
  }
}
