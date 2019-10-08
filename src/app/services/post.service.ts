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
    private spinnner = new Subject<boolean>();

    constructor(private http:HttpClient){}

    getPosts():void{
     this.http.get<Post[]>(`${environment.api}/posts`).subscribe(posts=>{
         this.posts = posts;
         this.postUpdated.next([...this.posts]);
         this.hideSpinner();
     });
    }

    getPostUpdateListner():Observable<Post[]>{
        return this.postUpdated.asObservable();
    }

    addPost(post:any):void{
        this.showSpinner();
        const postData = new FormData();
        postData.append('title',post.title);
        postData.append('description',post.description);
        if(post.image != null){
            postData.append('image',post.image,post.title);
        }
        this.http.post<Post>(`${environment.api}/posts`,postData).subscribe(res=>{
        // console.log('res:', res)
        this.posts.push(res);
        this.postUpdated.next([...this.posts]);
        this.hideSpinner();
    })
        
    }

    deletePost(postIndex:number):void{
     this.showSpinner();
     const _id =   this.posts[postIndex]._id;
     this.http.delete<any>(`${environment.api}/posts/${_id}`).subscribe(res=>{
        this.posts.splice(postIndex,1);
        this.postUpdated.next([...this.posts]);
        this.hideSpinner();
     })   
    }

    passEditPost(postIndex:number):void{
        this.editPost.next(this.posts[postIndex]);
    }

    editPostListner():Observable<any>{
        return this.editPost.asObservable();
    }

    patchPost(postId:string,post:Post):void{
        this.showSpinner();
        this.http.patch<any>(`${environment.api}/posts/${postId}`,post).
        subscribe(res=>{
        const remainingPost = this.posts.filter(item=>{
            return item._id != postId;
        }) 
        this.posts = remainingPost;
        this.posts.unshift(res);
        this.postUpdated.next([...this.posts]);
        this.hideSpinner();
    })
    }

    getSpinnerListner():Observable<boolean>{
        return this.spinnner.asObservable();
    }

    showSpinner():void{
        this.spinnner.next(true);
    }

    hideSpinner():void{
        this.spinnner.next(false);
    }
}