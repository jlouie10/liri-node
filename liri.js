// require("dotenv").config();

// var keys = require("./keys.js");

// var spotify = new Spotify(keys.spotify);

let command = process.argv[2];

switch (command) {
    case "concert-this":
        console.log(command);
        break;
    case "spotify-this-song":
        console.log(command);
        break;
    case "movie-this":
        console.log(command);
        break;
    case "do-what-it-says":
        console.log(command);
        break;
    default:
        console.log("Error");
}