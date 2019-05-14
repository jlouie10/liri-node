require("dotenv").config();

const Spotify = require('node-spotify-api');
const moment = require('moment');
const axios = require('axios');

let keys = require("./keys.js");
let spotify = new Spotify(keys.spotify);

let input = process.argv;
let command = input[2];
let arg = input.slice(3).join(' ');

switch (command) {
    case 'concert-this':
        concertThis(arg);
        break;
    case 'spotify-this-song':
        spotifyThisSong(arg);
        break;
    case 'movie-this':
        console.log(command);
        break;
    case 'do-what-it-says':
        console.log(command);
        break;
    default:
        console.log('Error');
}

// Fetches artist name from search term and then fetches concert information
function concertThis(artist) {
    let queryUrl = 'https://rest.bandsintown.com/artists/' + artist + '/?app_id=codingbootcamp';

    axios.get(queryUrl)
        .then(function (response) {
            let artistName = response.data.name;

            if (artistName === undefined) {
                console.log('Your concert-this request could not find ' + artist + '.');
            }
            else {
                queryUrl = 'https://rest.bandsintown.com/artists/' + artist + '/events/?app_id=codingbootcamp';

                axios.get(queryUrl)
                    .then(function (response) {
                        if (response.data.length > 0) {
                            console.log('Your concert-this results:')

                            response.data.forEach(element => {
                                console.log('\nArtist: ' + artistName);
                                console.log('Venue: ' + element.venue.name);
                                console.log('Location: ' + element.venue.city + ', ' + element.venue.region);
                                console.log('Date: ' + moment(element.datetime).format('MM/DD/YYYY'));
                            });
                        }
                        else {
                            console.log('Your concert-this request could not find events for ' + artistName + '.');
                        }
                    })
                    .catch(function (error) {
                        console.log('Your concert-this request could not be completed. ' + error);
                    });
            }
        })
        .catch(function (error) {
            console.log('Your concert-this request could not be completed. ' + error);
        });
}

// Fetches song information from Spotify
function spotifyThisSong(song) {
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Your spotify-this-song request could not be completed. ' + err);
        }

        console.log('Your spotify-this-song results:')

        data.tracks.items.forEach(element => {

            let artists = '';

            element.artists.forEach((item, index, arr) => {
                artists += item.name;
                
                if (index !== (arr.length - 1)) {
                    artists += ', ';
                }
            });

            console.log('\nArtist(s): ' + artists);
            console.log('Song: ' + element.name);
            console.log('Album: ' + element.album.name);
            console.log('Url: ' + element.external_urls.spotify);
        });
      });
}