import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Post } from 'src/app/shared/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  createPostForm:FormGroup;

  constructor(private fb:FormBuilder,private postService:PostService) { }

  onPostClick(){
    if(this.createPostForm.valid){
      this.postService.addPost(this.createPostForm.value);
      this.createPostForm.reset();
    }
  }

  ngOnInit() {
    this.createPostForm = this.fb.group({
      title:['',[Validators.required,Validators.minLength(5)]],
      description:['',[Validators.required,Validators.minLength(10)]]
    })
  }

}
