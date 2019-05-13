// require("dotenv").config();

// var keys = require("./keys.js");

// var spotify = new Spotify(keys.spotify);

const axios = require("axios");

let input = process.argv;
let command = input[2];
let arg = input.slice(3).join(' ');

switch (command) {
    case 'concert-this':
        console.log('Your concert-this results:')
        concertThis(arg);
        break;
    case 'spotify-this-song':
        console.log(command);
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

function concertThis(artist) {
    const appId = '';
    let artistEnc = artist.replace(' ', '%20');
    let queryUrl = 'https://rest.bandsintown.com/artists/' + artistEnc + '/events?app_id=' + appId;

    axios.get(queryUrl)
        .then(function (response) {
            response.data.forEach(element => {
                console.log('\nArtist: ' + artist);
                console.log('Venue: ' + element.venue.name);
                console.log('Location: ' + element.venue.city + ', ' + element.venue.region);
                console.log('Date: ' + element.datetime + '\n');
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}