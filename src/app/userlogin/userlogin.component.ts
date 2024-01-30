import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlogin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './userlogin.component.html',
  styleUrl: './userlogin.component.scss'
})
export class UserloginComponent {
  isLogin = false;

  // LogIn 
  userLogIn:FormGroup | any;
  loginSubmit = false;

  // SignUp 
  userSignUp:FormGroup | any;
  signupSubmit = false;

  constructor(private fb:FormBuilder, private http:HttpClient, private route:Router){
    // LogIn 
    this.userLogIn = fb.group({
      Email:['', Validators.required],
      Password:['', Validators.required]
    })

    // SignUp 
    this.userSignUp = fb.group({
      UserName:['', Validators.required],
      Password:['', Validators.required],
      Email:['', Validators.required],
      ContactNumber:['', Validators.required],
      Gender:['', Validators.required],
    })
  }

  get logInf(){
    return this.userLogIn.controls
  }

  get signUpf(){
    return this.userSignUp.controls
  }

  LogIn(data:any){
    this.loginSubmit = true;
    this.http.get(`http://localhost:3000/userLogIn?/Email:${data.Email}&&Password:${data.Password}`, 
    {observe:'response'}).subscribe((result:any)=>{
      if(result && result.body && result.body.length){
        this.route.navigate(['posts']);
        console.warn(result);
        
      }
    })
  }

  SignUp(data:any){
 this.signupSubmit = true;
 if(this.userSignUp.valid){
  this.http.post('http://localhost:3000/userLogIn', data).subscribe((result)=>{
    this.route.navigate(['posts']);
  })
 }
  }
  
  onLogin(){
    this.isLogin = true;
  }

  onSignUp(){
    this.isLogin = false;
  }
}
