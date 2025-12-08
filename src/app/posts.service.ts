import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Posts } from './posts.model';
import { catchError, map } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {}

  error = new Subject<string>();

  createAndStorePost(title: string, content: string) {
    const postData: Posts = {title: title, content: content};
    this.http
      .post<{ name: string }>(
        'https://http-check-902dd-default-rtdb.firebaseio.com/posts.json',
        postData
      )
      .subscribe((res) => {
        console.log('your response data == ', res);
      },
      error => {
        this.error.next(error.message);
      }
    );
  }

  fetchPosts(){
    return this.http.get<{[key: string]: Posts}>('https://http-check-902dd-default-rtdb.firebaseio.com/posts.json')
    .pipe(map((resData) => {
      let postArray: Posts[] = [];
      for(const key in resData){
        if(resData.hasOwnProperty(key)){
          postArray.push({...resData[key], id: key});
        }
      }
      return postArray;
    }),
    catchError(errorRes => {
      return throwError(errorRes);
    })
  )
  }

  deletePosts(){
    return this.http.delete('https://http-check-902dd-default-rtdb.firebaseio.com/posts.json');
  }
}
