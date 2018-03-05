import { Component, ViewChild, trigger, style, transition, animate, keyframes } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, Content } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { DataProvider } from '../../providers/data/data';
import { Storage } from '@ionic/storage';
import { GenresPage } from '../genres/genres'
import { DetailsPage } from '../details/details';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('300ms ease-in', keyframes([
          style({ opacity: 1, transform: 'translateX(0)', offset: 0}),
          style({ opacity: 0, transform: 'translateX(-50px)', offset: 1})
        ]))
      ]),
      transition(':enter', [
        animate('300ms ease-in', keyframes([
          style({ opacity: 0, transform: 'translateX(-50px)', offset: 0}),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1})
        ]))
      ])
    ])
  ]
})
export class HomePage {

  showSearch = false;
  games = [];
  genre: number = 32;
  genreName: string = 'Upcoming'
  favorites = [];

  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    private storage: Storage,
    public loading: LoadingController,
    public modalCtrl: ModalController,
    public keyboard: Keyboard
  ) {

    let loader = this.loading.create({
      content: 'Getting Games...'
    });
    loader.present().then(() => {
      this.storage.get('genre').then((val) => {
        if (val) {
          this.genre = val.id;
          this.genreName = val.name;
        } else {
          this.genre = 5;
          this.genreName = 'Shooter';
          this.storage.set('genre', this.genre);
        }

        this.dataProvider.getGames(this.genre, 0)
          .subscribe(res => {
            this.games = res;
          });
      });
      this.storage.get('favorites').then(val => {
        if (!val) {
          this.storage.set('favorites', this.favorites);
        } else {
          this.favorites = val;
        }
      })

      setTimeout(() => {
        loader.dismiss();
      }, 1200);
    })

}

favorite(gameId) {
  this.favorites.push(gameId);
  this.favorites = this.favorites.filter( (item, i, ar) => ar.indexOf(item) === i );
  this.storage.set('favorites', this.favorites);
}

removeFavorite(gameId) {
  this.favorites = this.favorites.filter(item => item !== gameId);
  this.storage.set('favorites', this.favorites);
}

openFovorites() {
  this.storage.get('favorites').then((val) => {
    this.genreName = 'Favorites';
    if (val.length != 0) {
      this.dataProvider.getFavorites(val)
        .subscribe(res => this.games = res);
    } 
    else {
      this.games.length = 0;
    }
  })
}

openGenres() {
  let myModal = this.modalCtrl.create(GenresPage);
  myModal.onDidDismiss(genre => {

    let loader = this.loading.create({
      content: 'Getting Genres',
    });

    if (genre) {
      loader.present().then(() => {

        this.storage.get('genre').then(val => {
          this.genre = val.id;
          this.genreName = val.name;

          this.dataProvider.getGames(this.genre, 0)
            .subscribe(res => this.games = res);
        });
      });
    }
    setTimeout(() => {
      loader.dismiss();
    }, 1200);
  });

  myModal.present();
}


showSearchBox() {
  this.showSearch = !this.showSearch;
  this.content.scrollToTop()
}

search(term) {
  console.log('search')
  let search_term = term;
  this.keyboard.close();
  this.genreName = search_term;
  this.showSearch = false;
  this.dataProvider.searchGames(search_term)
    .subscribe(res => this.games = res);
}

detailsPage(game) {
  this.navCtrl.push(DetailsPage, {
    game: game
  })
}

  ionViewDidLoad() {
  }

}
