import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LiveAnnouncer} from '@angular/cdk/a11y';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule, 
    MatChipsModule, 
    MatIconModule
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {
  addPosts: FormGroup | any;
  submitted = false;
  posts:any = []
  selectIndex = '';
  isEdit = false;

  constructor(private fb:FormBuilder, private http:HttpClient){
    this.addPosts = fb.group({
      Title: ['', Validators.required],
      Comment: ['', Validators.required],
      Tags:[[], Validators.required],
      Status: ['', Validators.required]
    })
  }

  ngOnInit(){
    this.getPost();
  }

  get f(){
    return this.addPosts.controls;
  }

  addOnBlur = true;     
  readonly separatorKeysCodes = [ENTER];
  inputTag: any[] = [];  

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.inputTag.push({name: value});
    }
    console.log(this.inputTag);
    event.chipInput.clear();    
  }

  remove(chips: any): void {
    const index = this.inputTag.indexOf(chips);

    if (index >= 0) {     
      this.inputTag.splice(index, 1);

      this.announcer.announce(`Removed ${chips}`);
    }
  }

  edit(chips: any, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(chips);
      return;
    }

    const index = this.inputTag.indexOf(chips);
    if (index >= 0) {
      this.inputTag[index].name = value;  
    }
  }

  getPost(){
    this.http.get('http://localhost:3000/Posts').subscribe((result:any)=>{  
    this.posts = result
    })
  }

  onSubmit(data:any){
    this.submitted = true;
    this.addPosts.get('Tags').setValue(this.inputTag);
    this.inputTag = [" "]
    if(this.addPosts.valid){
      this.http.post('http://localhost:3000/Posts', this.addPosts.value).subscribe((result:any)=>{
    this.getPost();
    this.addPosts.reset();
      })
    }
  }

  onEdit(post:any, id:any){
    this.isEdit = true;
    this.selectIndex = id;   
    this.addPosts.patchValue({
      Title:post.Title,
      Comment:post.Comment,
      Tags:post.Tags,
      Status:post.Status
    })
    this.inputTag = post.Tags;  
  }

  onUpdate(){
    this.isEdit = false;
    this.inputTag = [" "]
    this.http.put('http://localhost:3000/Posts/'+ this.selectIndex, this.addPosts.value)
    .subscribe((result)=>{
      this.getPost();
    this.addPosts.reset();
    });    
  }

  onDelete(id:any){
    this.http.delete('http://localhost:3000/Posts/' + id).subscribe((result)=>{})
    this.getPost();
  }
}
