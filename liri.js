require('dotenv').config();

const Spotify = require('node-spotify-api');
const moment = require('moment');
const fs = require('fs');

const colors = {
    cyan: '\x1b[36m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m'
}

let keys = require('./keys.js');
let spotify = new Spotify(keys.spotify);
let omdb = keys.omdb;

let axios = require('./axios.js');
let axiosGet = axios.axiosGet;

let request = process.argv;
let command = request[2];
let input = request.slice(3).join(' ');

// Executes function based on user request
let askLiri = (commandArg, inputArg) => {
    updateLog('# ' + commandArg + ': ' + inputArg + '\n');

    switch (commandArg) {
        case 'concert-this':
            concertThis(inputArg);
            break;
        case 'spotify-this-song':
            spotifyThisSong(inputArg);
            break;
        case 'movie-this':
            movieThis(inputArg);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            printInstructions();
    }
}

// Fetches concert information from Bands in Town
let concertThis = (artist) => {
    if (artist === '') {
        console.log('\nLiri needs an artist to complete your search.\n')
    }
    else {
        let queryUrl = 'https://rest.bandsintown.com/artists/' + artist + '/?app_id=codingbootcamp';

        axiosGet(queryUrl, getArtist);
    }
};

// Fetches artist to confirm artist exists (allows partial matches)
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
            let info = 'Artist: ' + params.artist +
                '\nVenue: ' + element.venue.name +
                '\nLocation: ' + element.venue.city + ', ' + element.venue.region +
                '\nDate: ' + moment(element.datetime).format('MM/DD/YYYY') + '\n';

            updateLog(info);

            console.log(colors.cyan, info);
        });
    }
    else {
        console.log('\nLiri could not find any concerts.\n');
    }
};

// Fetches movie information from OMDB
let movieThis = (movie) => {
    if (movie === '') {
        movie = 'Mr. Nobody';
    }

    let queryUrl = 'http://www.omdbapi.com/?t=' + movie + '&plot=full&apikey=' + omdb.apiKey;

    axiosGet(queryUrl, printMovie);
};

// Prints movie information to console
let printMovie = (response) => {
    let info = 'Title: ' + response.data.Title +
        '\nYear: ' + response.data.Year +
        '\nRatings: ';

    response.data.Ratings.forEach(element => {
        if (element.Source === 'Internet Movie Database') {
            info += '\n  IMDB: ' + element.Value;
        }
        else if (element.Source === 'Rotten Tomatoes') {
            info += '\n  Rotten Tomatoes: ' + element.Value;
        }
    });

    info += '\nCountry: ' + response.data.Country +
        '\nLanguage: ' + response.data.Language +
        '\nPlot: ' + response.data.Plot +
        '\nActors: ' + response.data.Actors + '\n';

    updateLog(info);

    console.log('_\n')
    console.log(colors.yellow, info);
};

// Fetches song information from Spotify
let spotifyThisSong = (song) => {
    let results = 0;

    if (song === '') {
        song = 'The Sign Ace of Base';
        results = 1;
    }

    spotify.search({ type: 'track', query: song, limit: results }, function (err, data) {
        if (err) {
            return console.log('\nniri could not complete your request. ' + err + '\n');
        }

        console.log('_\n')

        data.tracks.items.forEach(track => {
            let artists = '';
            let info;

            track.artists.forEach((item, index, arr) => {
                artists += item.name;

                if (index !== (arr.length - 1)) {
                    artists += ', ';
                }
            });

            info = 'Artist(s): ' + artists +
                '\nSong: ' + track.name +
                '\nAlbum: ' + track.album.name +
                '\nUrl: ' + track.external_urls.spotify + '\n';

            updateLog(info);

            console.log(colors.green, info);
        });
    });
};

// Reads random.txt and runs command with search term in file
let doWhatItSays = () => {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log('\nLiri could not complete your request. ' + error + '\n');
        }

        let dataArr = data.split(",");

        dataArr[1] = dataArr[1].replace(/['"]+/g, '');
        askLiri(dataArr[0], dataArr[1]);
    });
};

let updateLog = (logText) => {
    fs.appendFile('log.txt', logText + '\n', function (err) {
        if (err) {
            console.log('\nLiri failed to log the results. ' + err + '\n');
        }
    });
};

let printInstructions = () => {
    const instructions = '\nLiri needs one of these commands to display some information:' +
        '\n  concert-this' +
        '\n  spotify-this-song' +
        '\n  movie-this' +
        '\n  do-what-it-says\n';

    console.log(instructions)
};

askLiri(command, input);

module.exports = {
    command: command,
    input: input,
    getArtist: getArtist,
    printConcert: printConcert,
    printMovie: printMovie
  };