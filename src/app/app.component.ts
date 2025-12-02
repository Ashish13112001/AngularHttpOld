import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  onCreatePost(postData: { title: string; content: string }) {
   this.http.post('https://http-check-902dd-default-rtdb.firebaseio.com/posts.json', postData).subscribe(res => {
    console.log('your response data == ', res);
   });
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts(){
    this.http.get('https://http-check-902dd-default-rtdb.firebaseio.com/posts.json').subscribe(resData => {
      console.log('resData -- ', resData);
    })
  }
}
