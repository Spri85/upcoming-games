import { Component, trigger, style, transition, animate, keyframes } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        animate('600ms ease-in', keyframes([
          style({ opacity: 0, transform: 'translateY(-70px)', offset: 0}),
          style({ opacity: 0.75, transform: 'translateY(25px)', offset: 0.75}),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1}),
        ]))
      ])
    ]),

    trigger('fadeUp', [
      transition('void => *', [
        animate(900, keyframes([
          style({ opacity: 0, transform: 'translateY(70px)'}),
          style({ opacity: 1, transform: 'translateY(0)'})
        ]))
      ])
    ])
  ]
})
export class DetailsPage {
  gameId: number;
  game: object;
  perspective: object;

  constructor(public navCtrl: NavController, public navParams: NavParams, private data: DataProvider, private iab: InAppBrowser, private youtube: YoutubeVideoPlayer) {
    this.gameId = navParams.get('game');

  }

  ionViewDidLoad() {
   this.data.getGame(this.gameId)
    .subscribe(res => {

      this.data.getPerspective(res[0].player_perspectives[0])
        .subscribe(res =>  this.perspective = res[0]);

      this.game = res[0];
    })
  }

  launchSite(url) {
    console.log(url);
    const browser = this.iab.create(url, '_system');
    browser.close();
  }

  playVideo(video_id) {
    this.youtube.openVideo(video_id);
  }

}
