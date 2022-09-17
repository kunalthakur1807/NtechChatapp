import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import  io  from 'socket.io-client';
@Component({
  selector: 'app-chat-component',
  templateUrl: './chat-component.component.html',
  styleUrls: ['./chat-component.component.scss']
})




export class ChatComponentComponent implements OnInit {
  socket = io("http://localhost:3001")
  messages: Array<any> = [];
  friends: Array<any> = [];
  message: string = '';
  selectedUserid: any = '';
  currentUserId: string = '';

  SidebarUserClicked(user:any){
    this.selectedUserid = user;
    
  }

  constructor(router:Router) { 
    let currentUser= sessionStorage.getItem('user');
    if(currentUser){
    let currentUserJson = JSON.parse(currentUser?.toString());
    this.currentUserId = currentUserJson['user']['_id'];
    if(currentUserJson['messages']){
    this.messages = currentUserJson['messages'];
    }
    }

    this.socket.on('receive_message',(data)=>{
      this.messages.unshift(data)
      // alert(data);
    })



    this.socket.on('get_users_result',(data) => {
      for(let i = 0; i < data.length; i++){
        this.friends.push(data[i]);
      }
    })


   }

  ngOnInit(): void {
    this.socket.emit('get_users',{userId : this.currentUserId});
  }

  sendMessage(){
    this.message = (<HTMLInputElement>document.getElementById("message")).value;
    let currentUser= sessionStorage.getItem('user');
    if(currentUser){
    let currentUserJson = JSON.parse(currentUser?.toString());
    let msg = {
      message:this.message,
      from: currentUserJson['user']['_id'],
      to: this.selectedUserid._id,  
      time: new Date()
    }
    this.messages.unshift(msg);
    (<HTMLInputElement>document.getElementById("message")).value = '';
    this.message = '';
    this.socket.emit(
      "send_message",msg
      )
    }
  }

  

}
