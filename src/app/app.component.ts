import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Posts } from './posts.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Posts[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postService: PostsService) {}

  ngOnInit() {
    this.errorSub = this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    })
  }

  onCreatePost(postData: Posts) {
   this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(resData => {
      this.isFetching = false;
      this.loadedPosts = resData;
    },
    error => {
      this.error = error.message;
      console.log(error); 
    }
  )
  }

  onClearPosts() {
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    })
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
