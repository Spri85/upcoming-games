import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider }  from '../../providers/data/data';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the GenresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-genres',
  templateUrl: 'genres.html',
})
export class GenresPage {

  genres: Array<any>;
  currentGenre: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public viewCtrl: ViewController, private data: DataProvider) {

    this.data.getGenres()
      .subscribe(res => {
        this.genres = res;
      });
  }

  ionViewDidEnter() {
    this.storage.get('genre').then(val => {
      if (val)
        this.currentGenre = val.id;
      else  this.currentGenre = 5;
    });
  }

  genreSelected(genreId) {
    this.storage.set('genre', genreId);
    this.viewCtrl.dismiss(genreId);
  }

  ionViewDidLoad() {

  }

}
