// require("dotenv").config();

// var keys = require("./keys.js");

// var spotify = new Spotify(keys.spotify);
const moment = require('moment');
const axios = require("axios");

let input = process.argv;
let command = input[2];
let arg = input.slice(3).join(' ');

switch (command) {
    case 'concert-this':
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
    const url = 'https://rest.bandsintown.com';
    const appId = 'codingbootcamp';
    let artistEnc = artist.replace(' ', '%20');
    let artistUrl = url + '/artists/' + artistEnc + '/?app_id=' + appId;

    axios.get(artistUrl)
        .then(function (response) {
            let artistName = response.data.name;

            if (artistName === undefined) {
                console.log('Your concert-this request could not find ' + artist + '.');
            }
            else {
                let eventsUrl = url + '/artists/' + artistEnc + '/events/?app_id=' + appId;

                axios.get(eventsUrl)
                    .then(function (response) {
                        if (response.data.length > 0) {
                            console.log('Your concert-this results:\n')

                            response.data.forEach(element => {
                                console.log('Artist: ' + artistName);
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