import { Routes } from '@angular/router';
import { UserloginComponent } from './userlogin/userlogin.component';
import { PostsComponent } from './posts/posts.component';

export const routes: Routes = [
    {path:'', component:UserloginComponent},
    {path:'posts', component:PostsComponent}
];
