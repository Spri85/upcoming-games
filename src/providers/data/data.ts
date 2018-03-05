import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  headers = new Headers({
    // 'X-mashape-Key': 'xxPYsyVnaNmshokuvnurZIBLN3pcp1tto38jsnAKtabtVAxFAj'
    'user-key': '41d9471e85a6e44556ed70752c1fea61',
    'Accept': 'application/json'
  });

  options = new RequestOptions({ headers: this.headers});
  limit: number = 50;

  constructor(public http: Http) {

  }

  getGames(genreId: number = 13, offset: number = 0):Observable<any> {

    return this.http.get(`https://api-2445582011268.apicast.io/games/?fields=name,genres,release_dates,screenshots&limit=${this.limit}&offset=${offset}&order=release_dates.date:desc&filter[screenshots][exists]&filter[player_perspectives][exists]&filter[genres][eq]=${genreId}`, this.options)
      .map(response => response.json());
  }

  getGenres():Observable<any> {
    return this.http.get(`https://api-2445582011268.apicast.io/genres/?fields=id,name`, this.options)
      .map(res => res.json());
  }

  getFavorites(favs: number[]):Observable<any> {
    let favorites: string = favs.join();

    return this.http.get(`https://api-2445582011268.apicast.io/games/${favorites}?fields=name,genres,release_dates,screenshots&order=release_dates.date:desc`, this.options)
      .map(res => res.json());
  }

  searchGames(kw):Observable<any> {
    let keyword = kw;
    return this.http.get(`https://api-2445582011268.apicast.io/games/?fields=name,genres,release_dates,screenshots&limit=${this.limit}&filter[screenshots][exists]&offset=0&order=release_dates.date:desc&search=${keyword}`, this.options)
      .map(res => res.json());
  }

  getGame(gameId:number):Observable<any> {
    return this.http.get(`https://api-2445582011268.apicast.io/games/${gameId}?fields=*`, this.options)
    .map(res => res.json());
  }

  getPerspective(perspective): Observable<any> {
    return this.http.get(`https://api-2445582011268.apicast.io/player_perspectives/${perspective}?fields=*`, this.options)
      .map(res => res.json());
  }

}
