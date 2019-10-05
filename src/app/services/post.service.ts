import { Post } from '../shared/post.model';
import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
@Injectable({providedIn:'root'})
export class PostService {
    private posts:Post[] = [];
    private postUpdated = new Subject<Post[]>();
    private editPost = new Subject<any>();

    constructor(private http:HttpClient){

    }

    getPosts():void{
     this.http.get<Post[]>(`${environment.api}/posts`).subscribe(posts=>{
         this.posts = posts;
         this.postUpdated.next([...this.posts])
     });
    }

    getPostUpdateListner():Observable<Post[]>{
        return this.postUpdated.asObservable();
    }

    addPost(post:any):void{
        const postData = new FormData();
        postData.append('title',post.title);
        postData.append('description',post.description);
        postData.append('image',post.image,post.title);
        this.http.post<Post>(`${environment.api}/posts`,postData).subscribe(res=>{
        // console.log('res:', res)
        this.posts.push(res);
        this.postUpdated.next([...this.posts]);
    })
        
    }

    deletePost(postIndex:number){
     const _id =   this.posts[postIndex]._id;
     this.http.delete<any>(`${environment.api}/posts/${_id}`).subscribe(res=>{
         this.posts.splice(postIndex,1);
        this.postUpdated.next([...this.posts]);
     })   
    }

    passEditPost(postIndex:number){
        this.editPost.next(this.posts[postIndex]);
    }

    editPostListner():Observable<any>{
        return this.editPost.asObservable();
    }

    patchPost(postId:string,post:Post){
    this.http.patch<any>(`${environment.api}/posts/${postId}`,post).subscribe(res=>{
        const remainingPost = this.posts.filter(item=>{
            return item._id != postId;
        }) 
        this.posts = remainingPost;
        this.posts.unshift(res);
        this.postUpdated.next([...this.posts]);
    })
    }
}