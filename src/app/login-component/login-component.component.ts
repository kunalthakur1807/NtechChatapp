import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import io from 'socket.io-client';
@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.scss']
})
export class LoginComponentComponent implements OnInit {
  socket = io('http://localhost:3001');
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.socket.on('login_result',(data)=>{
      sessionStorage.setItem('user',JSON.stringify(data));
      console.log(data);
      
      
        this.router.navigate(['/chat'])
      
    })
    
  }

  login(){
    let name = (<HTMLInputElement>document.getElementById("name")).value;
    this.socket.emit('login',{name:name})
  }

  ngOnDestroy(){
    this.socket.disconnect();
  }

}
