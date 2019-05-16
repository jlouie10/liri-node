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

// Fetches concert information from Bands in Town
function concertThis(artist) {
    let queryUrl = 'https://rest.bandsintown.com/artists/' + artist + '/?app_id=codingbootcamp';

    axiosGet(queryUrl, getArtist);
}

// Fetches artist to confirm artist exists (allows partial matches), prints artist name if found in the query
function getArtist(response) {
    let artistName = response.data.name;

    if (artistName === undefined) {
        console.log('\nLiri could not find this artist.');
    }
    else {
        let queryUrl = 'https://rest.bandsintown.com/artists/' + artistName + '/events/?app_id=codingbootcamp';

        axiosGet(queryUrl, printConcert, { artist: artistName });
    }
}

// Prints concert information to console
function printConcert(response, params) {
    if (response.data.length > 0) {
        response.data.forEach(element => {
            console.log('\nArtist: ' + params.artist);
            console.log('Venue: ' + element.venue.name);
            console.log('Location: ' + element.venue.city + ', ' + element.venue.region);
            console.log('Date: ' + moment(element.datetime).format('MM/DD/YYYY'));
        });
    }
    else {
        console.log('\nLiri could not find any concerts.');
    }
}

// Fetches movie information from OMDB
function movieThis(movie) {
    let queryUrl = 'http://www.omdbapi.com/?t=' + movie + '&plot=full&apikey=' + omdb.apiKey;

    axiosGet(queryUrl, printMovie);

    // Prints movie information to console
    function printMovie(response) {
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
    }
}

// GET request using Axios 
function axiosGet(url, callback, params) {
    axios.get(url)
        .then(function (response) {
            callback(response, params);
        })
        .catch(function (error) {
            console.log('\nLiri could not complete your request. ' + error);
        });
}

// Fetches song information from Spotify
function spotifyThisSong(song) {
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('\nYour spotify-this-song request could not be completed. ' + err);
        }

        data.tracks.items.forEach(track => {

            let artists = '';

            track.artists.forEach((item, index, arr) => {
                artists += item.name;

                if (index !== (arr.length - 1)) {
                    artists += ', ';
                }
            });

            console.log('Artist(s): ' + artists);
            console.log('Song: ' + track.name);
            console.log('Album: ' + track.album.name);
            console.log('Url: ' + track.external_urls.spotify);
        });
    });
}