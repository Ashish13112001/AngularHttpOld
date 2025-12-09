import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Posts } from './posts.model';
import { catchError, map, tap } from 'rxjs/operators';
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
        postData,
        {
          observe: 'response'
        }
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
    //for adding multiple params and "append('print','pretty');" give data in a good formate in the response
    let searchParams = new HttpParams();
    searchParams = searchParams.append('ashish','barthwal');
    searchParams = searchParams.append('print','pretty');
    return this.http.get<{[key: string]: Posts}>('https://http-check-902dd-default-rtdb.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({'Content-Header': 'Hello Ashish'}),
        //for single param
        // params: new HttpParams().set('queryParam', 'ashishQueryParams')
        params: searchParams,
      }
    )
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
    return this.http.delete('https://http-check-902dd-default-rtdb.firebaseio.com/posts.json',
      {
        // This define what type of response we get (body[byDefault], response, events)
        observe: 'events',

        // It tell which type of response you get (json, text, blob)
        responseType: 'text'
      }
    ).pipe(tap(event => {
      console.log('-------event----',event);

      if(event.type === HttpEventType.Sent){
        // some logic
      }
      if(event.type === HttpEventType.Response){
        console.log(event.body);
      }
    }));
  }
}
