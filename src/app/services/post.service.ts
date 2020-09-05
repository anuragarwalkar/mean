import { Post } from '../shared/post.model';
import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { Socket } from 'ngx-socket-io';
@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>();
    private editPost = new Subject<any>();
    private spinnner = new Subject<boolean>();

    constructor(private http: HttpClient, private socket: Socket) {
        this.getUpdatedPosFromSocket();
        this.getDeletedPosFromSocket();
        this.patchPostsFromSocket();
    }

    getPosts(): void {
     this.http.get<Post[]>(`${environment.api}/api/posts`).subscribe(posts => {
         this.posts = posts;
         this.postUpdated.next([...this.posts]);
         this.hideSpinner();
     });
    }

    getPostUpdateListner(): Observable<Post[]> {
        return this.postUpdated.asObservable();
    }

    addPost(post: any): void {
        this.showSpinner();
        const postData = new FormData();
        postData.append('title', post.title);
        postData.append('description', post.description);
        if (post.image != null) {
            postData.append('image', post.image, post.title);
        }
        this.http.post<Post>(`${environment.api}/api/posts`, postData).subscribe(res => {
        console.log('res:', res);
    });
    }

    private pushPostToArray(post: Post): void {
        this.posts.unshift(post);
        this.postUpdated.next([...this.posts]);
    }

    private getUpdatedPosFromSocket(): void {
        this.socket.fromEvent<Post>('post-add').subscribe(res => {
            this.pushPostToArray(res);
            this.hideSpinner();
        });
    }

    deletePost(postIndex: number): void {
     this.showSpinner();
     const _id =   this.posts[postIndex]._id;
     this.http.delete<{success: boolean, message: string}>(`${environment.api}/api/posts/${_id}`).subscribe(res => {
        console.log('res:', res);
     });
    }

    private getDeletedPosFromSocket(): void {
        this.socket.fromEvent<string>('post-delete').subscribe(postGuid => {
            this.deletePostByGuid(postGuid);
            this.hideSpinner();
        });
    }

    private deletePostByIndex(postIndex: number): void {
        this.posts.splice(postIndex, 1);
        this.postUpdated.next([...this.posts]);
    }

    private deletePostByGuid(postGuid: string): void {
        const postIndex = this.posts.findIndex(post => post._id === postGuid);
        this.posts.splice(postIndex, 1);
        this.postUpdated.next([...this.posts]);
    }

    passEditPost(postIndex: number): void {
        this.editPost.next(this.posts[postIndex]);
    }

    editPostListner(): Observable<any> {
        return this.editPost.asObservable();
    }

    patchPost(postId: string, post: Post): void {
        this.showSpinner();
        this.http.patch<{success: boolean, message: string}>(`${environment.api}/api/posts/${postId}`, post).
        subscribe(res => {
        console.log(res);
    });
    }

    private patchPostsFromSocket(): void {
        this.socket.fromEvent<Post>('post-update').subscribe(updatedToast => {
            const { _id: postGuid } = updatedToast;
            const remainingPost = this.posts.filter(item => {
                return item._id !== postGuid;
            });
            this.posts = remainingPost;
            this.posts.unshift(updatedToast);
            this.postUpdated.next([...this.posts]);
            this.hideSpinner();
        });
    }

    getSpinnerListner(): Observable<boolean> {
        return this.spinnner.asObservable();
    }

    showSpinner(): void {
        this.spinnner.next(true);
    }

    hideSpinner(): void {
        this.spinnner.next(false);
    }
}
