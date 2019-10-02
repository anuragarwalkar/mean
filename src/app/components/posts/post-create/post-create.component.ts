import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Post } from 'src/app/shared/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  createPost = true
  createPostForm:FormGroup;
  @ViewChild('form',{static:false}) form;
  toUpdatePostId: string;
  editPost:boolean = false;

  constructor(private fb:FormBuilder,private postService:PostService) { }

  onPostClick(){
    if(!this.editPost){
    if(this.createPostForm.valid){
      this.postService.addPost(this.createPostForm.value);
      this.form.resetForm();
    }
  }else{
    this.onEditPost();
  }
  }

  onEditPost(){
    this.postService.patchPost(this.toUpdatePostId,this.createPostForm.value);
    this.form.resetForm();  
    this.editPost = false;
  }

  ngOnInit() {
    this.createPostForm = this.fb.group({
      title:['',[Validators.required,Validators.minLength(5)]],
      description:['',[Validators.required,Validators.minLength(10)]]
    })

    this.postService.editPostListner().subscribe(res=>{
      if(res != undefined || null){
        this.toUpdatePostId = res._id;
        this.editPost = true;
        this.createPostForm.patchValue({
          title:res.title,
          description:res.description
    });
  }
  })

}
}
