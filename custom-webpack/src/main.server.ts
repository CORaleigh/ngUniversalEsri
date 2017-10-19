import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs/Rx';
import * as express from 'express';
import { Request, Response } from 'express';
import { platformServer, renderModuleFactory } from '@angular/platform-server';
import { ServerAppModule } from './app/server-app.module';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { ROUTES } from './routes';
import { enableProdMode } from '@angular/core';

var http = require('http');
var Twit = require('twit');
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

enableProdMode();
const app = express();
const port = 8000;
const baseUrl = `http://localhost:${port}`;

// CHF global for coords?
var coords = "";

app.engine('html', ngExpressEngine({
  bootstrap: ServerAppModule
}));

app.set('view engine', 'html');
app.set('views', 'src');

app.use('/', express.static('dist', {index: false}));

ROUTES.forEach((route: string) => {
  app.get(route, (req: Request, res: Response) => {
    console.time(`GET: ${req.originalUrl}`);
    res.render('../dist/index', {
      req: req,
      res: res
    });
    console.timeEnd(`GET: ${req.originalUrl}`);
  });
});

app.listen(port, () => {
  console.log(`Listening at ${baseUrl}`);

  console.log('just before twit');
  
var twit = new Twit({
  consumer_key:         '7lFDwAtmqt7MbQPl0RctMRoV6',
  consumer_secret:      'bxFlEGBsDRIHRiKANoCLC6yzAhRSNE6QRzX8wrrEeybdkgKzM9',
  access_token:         '7374632-WxCEThennwx9PRU7thAff8Mrmm96ki3CfudkIMKNtZ',
  access_token_secret:  'ZkT5mHgKAXHomcjS4ba3hj5impB3QBXOkV2POE1tjkNho',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

// var stream = twit.stream('statuses/filter', {follow: ['7374632', '759251', '20647123','97739866','28785486','1367531','28785486','5695632','14956372','18918698']});
 var stream = twit.stream('statuses/filter', {follow: ['7374632', '20647123']});


stream.on('tweet', tweet => {
  if(tweet.retweeted || tweet.retweeted_status || tweet.in_reply_to_status_id || tweet.in_reply_to_user_id || tweet.delete) {
    // skip retweets and replies
    return;
  }
  console.log(`${tweet.user.name} posted: ${tweet.text}`);

  var str =`${tweet.text}`;
  var parsedTweet = str.split("-");
//   if (arr[2].match(/^\d/)) {
//     console.log(arr);
//  }

 var cleansedAddress = parsedTweet[2].replace( /&amp;/g, 'and' ).trim(); 
 console.log('cleansedAddress', cleansedAddress);
//  var testTweet = '*ACCIDENT: DAMAGE ONLY* - RALEIGH POLICE - FALLS OF NEUSE RD & HARPS MILL RD'
//  var testAddress = 'FALLS OF NEUSE RD & HARPS MILL RD'
const url = '/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/findAddressCandidates?SingleLine=&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json&Street=' + cleansedAddress + '&City=null&State=null&ZIP=null'
  console.log('url = ',url);
  cleansedAddress = encodeURI(url)
http.get({
  host: 'maps.raleighnc.gov',
  path: cleansedAddress
  }, function(response) {
    // Continuously update stream with data
    var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {
        // Data reception is done, do whatever withN it!
         var parsed = JSON.parse(body);
        // console.log('parsed full', parsed);
        this.ccoords = parsed.candidates[0].location;
        console.log('parsed = ', parsed.candidates[0].location);

      });
  });
});
});

