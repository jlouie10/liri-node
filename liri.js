require('dotenv').config();

const Spotify = require('node-spotify-api');
const moment = require('moment');
const axios = require('axios');
const fs = require('fs');

let keys = require('./keys.js');
let spotify = new Spotify(keys.spotify);
let omdb = keys.omdb;

let input = process.argv;
let command = input[2];
let search = input.slice(3).join(' ');

// Runs function associated with user input command
let askLiri = (cmd, searchTerm) => {
    switch (cmd) {
        case 'concert-this':
            concertThis(searchTerm);
            break;
        case 'spotify-this-song':
            spotifyThisSong(searchTerm);
            break;
        case 'movie-this':
            movieThis(searchTerm);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log('Error');
    }
}

// Fetches concert information from Bands in Town
let concertThis = (artist) => {
    let queryUrl = 'https://rest.bandsintown.com/artists/' + artist + '/?app_id=codingbootcamp';

    axiosGet(queryUrl, getArtist);
};

// Fetches artist to confirm artist exists (allows partial matches), prints artist name if found in the query
let getArtist = (response) => {
    let artistName = response.data.name;

    if (artistName === undefined) {
        console.log('\nLiri could not find this artist.\n');
    }
    else {
        let queryUrl = 'https://rest.bandsintown.com/artists/' + artistName + '/events/?app_id=codingbootcamp';

        axiosGet(queryUrl, printConcert, { artist: artistName });
    }
};

// Prints concert information to console
let printConcert = (response, params) => {
    if (response.data.length > 0) {
        console.log('_\n')

        response.data.forEach(element => {
            console.log('Artist: ' + params.artist);
            console.log('Venue: ' + element.venue.name);
            console.log('Location: ' + element.venue.city + ', ' + element.venue.region);
            console.log('Date: ' + moment(element.datetime).format('MM/DD/YYYY') + '\n');
        });
    }
    else {
        console.log('\nLiri could not find any concerts.\n');
    }
};

// Fetches movie information from OMDB
let movieThis = (movie) => {
    let queryUrl = 'http://www.omdbapi.com/?t=' + movie + '&plot=full&apikey=' + omdb.apiKey;

    axiosGet(queryUrl, printMovie);
};

// Prints movie information to console
let printMovie = (response) => {
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
    console.log('Actors: ' + response.data.Actors + '\n');
};

// GET request using Axios 
let axiosGet = (url, callback, params) => {
    axios.get(url)
        .then(function (response) {
            callback(response, params);
        })
        .catch(function (error) {
            console.log('\nLiri could not complete your request. ' + error + '\n');
        });
};

// Fetches song information from Spotify
let spotifyThisSong = (song) => {
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('\nYour spotify-this-song request could not be completed. ' + err + '\n');
        }

        console.log('_\n')

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
            console.log('Url: ' + track.external_urls.spotify + '\n');
        });
    });
};

// Reads random.txt and runs command with search term in file
let doWhatItSays = () => {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log('\nLiri could not complete your request.' + error);
        }

        let dataArr = data.split(",");

        askLiri(dataArr[0], dataArr[1]);
    });
};

askLiri(command, search);