import { Post } from '../shared/post.model';
import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({providedIn:'root'})
export class PostService {
    private posts:Post[] = [];
    private postUpdated = new Subject<Post[]>();

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

    addPost(post:Post):void{
        this.http.post<Post>(`${environment.api}/posts`,post).subscribe(res=>{
            // console.log('res:', res)
            this.posts.push(res);
            this.postUpdated.next([...this.posts]);
        })
        
    }
}