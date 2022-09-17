import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponentComponent } from './chat-component/chat-component.component';
import { LoginComponentComponent } from './login-component/login-component.component';


const routes: Routes = [
  { path: 'chat', component: ChatComponentComponent },
  { path: '', component: LoginComponentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
