import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService, Message } from 'src/app/services/chat.service';
import { scan } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit {

  messages: Observable<Message[]>;
  poruka = '';
  chatWindow = false;
  @ViewChildren('chat-area') divs: QueryList<ElementRef>;

  constructor(public chat: ChatService) { }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable().pipe(
      scan((acc, val) => acc.concat(val)));
  }

  sendMessage() {
    if (this.poruka.trim() === '') {
      return
    }
    this.chat.converse(this.poruka);
    this.poruka = '';
  }

  showHideChat() {
    this.chatWindow = !this.chatWindow
    return this.chatWindow;
  }

  ngAfterViewChecked() {
    const chatMessages = document.getElementById("chat-area");
    if (chatMessages==undefined) {
      return
    }
    var shouldScroll = chatMessages.scrollTop + chatMessages.clientHeight === chatMessages.scrollHeight;
    if (!shouldScroll) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}
