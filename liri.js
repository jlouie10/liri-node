require('dotenv').config();

const Spotify = require('node-spotify-api');
const moment = require('moment');
const axios = require('axios');

let keys = require('./keys.js');
let spotify = new Spotify(keys.spotify);
let omdb = keys.omdb;

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
        movieThis(arg);
        break;
    case 'do-what-it-says':
        console.log(command);
        break;
    default:
        console.log('Error');
}

// Fetches concert information from Bands in Town - first, artist name from search term and then concert information
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
                            console.log('Your concert-this results for ' + artist + ':');

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
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Your spotify-this-song request could not be completed. ' + err);
        }

        console.log('Your spotify-this-song results for ' + song + ':');

        data.tracks.items.forEach(track => {

            let artists = '';

            track.artists.forEach((item, index, arr) => {
                artists += item.name;

                if (index !== (arr.length - 1)) {
                    artists += ', ';
                }
            });

            console.log('\nArtist(s): ' + artists);
            console.log('Song: ' + track.name);
            console.log('Album: ' + track.album.name);
            console.log('Url: ' + track.external_urls.spotify);
        });
    });
}

// Fetches movie information from OMDB
function movieThis(movie) {
    let queryUrl = 'http://www.omdbapi.com/?t=' + movie + '&plot=full&apikey=' + omdb.apiKey;

    axios.get(queryUrl)
        .then(function (response) {
            console.log('Your movie-this results for ' + movie + ':');
            console.log('\nTitle: ' + response.data.Title);
            console.log('Year: ' + response.data.Year);
            console.log('Ratings: ');
            
            response.data.Ratings.forEach(element => {
                if (element.Source === 'Internet Movie Database') {
                    console.log('  IMDB: ' + element.Value);
                }
                else if (element.Source === 'Rotten Tomatoes') {
                    console.log('  Rotten Tomatoes: ' + element.Value);
                }
            });

            console.log('Country: ' + response.data.Country);
            console.log('Language: ' + response.data.Language);
            console.log('Plot: ' + response.data.Plot);
            console.log('Actors: ' + response.data.Actors);
        })
        .catch(function (error) {
            console.log('Your movie-this request could not be completed. ' + error);
        });
}