import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from 'src/app/shared/post.model';
import { PostService } from 'src/app/services/post.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list-component.html',
    styleUrls: ['./post-list-component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

    posts: Post[] = [];
    private postSub: Subscription;
    apiResponseReady = false;
    spinnerSub: Subscription;

    constructor(private postService: PostService) {}

    ngOnInit() {
       this.postService.getPosts();
       this.postSub = this.postService.getPostUpdateListner().subscribe((posts) => {
            this.posts = posts;
        });

       this.spinnerSub = this.postService.getSpinnerListner().subscribe((showSpinner) => {
            this.apiResponseReady = !showSpinner;
        });
    }

    ngOnDestroy() {
        if (this.postSub) {
         this.postSub.unsubscribe();
        }
    }

    onDeletePost(index: number) {
    this.postService.deletePost(index);
    }

    onEditPost(index: number) {
      this.postService.passEditPost(index);
    }


}
