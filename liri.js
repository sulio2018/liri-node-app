// Set up "needs" and APIs
require('dotenv').config();

var keys = require('./keys.js');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var omdb = (keys.omdb);
var bandsintown = (keys.bandsintown);

var request = require('request');
var moment = require('moment');
var fs = require('fs');

// User input
var command = process.argv[2];
var input = process.argv.slice(3).join(' ');

// Set up commands
function userData (command, input) {
    switch (command) {
        case 'spotify-this-song':
            spotifyThisSong();
            break;
    
        case 'movie-this':
            movieThis();
            break;
    
        case 'concert-this':
            concertThis();
            break;
    
        case 'do-what-it-says':
            doWhatItSays(input);
            break;
    }
};
userData(command, input);

// Create command-input functions
function spotifyThisSong() {
    var song = '';
    if (input === undefined) {
        song = 'The Sign Ace of Base'
    } else {
        song = input;
    }

    console.log(`********************\n`);
    console.log(`Your song info:`)

    spotify.search({ type: 'track', query: song }, function (error, data) {
        if (!error) {
            console.log(`\nSong: ${data.tracks.items[0].name}`);
            console.log(`Artist(s): ${data.tracks.items[0].artists[0].name}`);
            console.log(`Album: ${data.tracks.items[0].album.name}`);
            console.log(`Preview Link: ${data.tracks.items[0].external_urls.spotify}\n`);

            var songInfo =
            `\nspotify-this-song found: \n
            Song: ${data.tracks.items[0].name} \n
            Artist(s): ${data.tracks.items[0].artists[0].name} \n
            Album: ${data.tracks.items[0].album.name}\n
            Preview Link: ${data.tracks.items[0].external_urls.spotify} \n********************\n`

            fs.appendFile('log.txt', songInfo, function (error) {
                if (error) throw error;
            });

        } else {
            return console.log('Song not found.');
        }

    });
};

/////////////////////////////////////////////////////////
function movieThis() {
    var movie = '';
    if (input === undefined) {
        console.log(`********************`);
        console.log(`If you haven't watched "Mr. Nobody," then you should!`);
        console.log(`It's on Netflix!`);
        movie = 'Mr. Nobody'
    } else {
        movie = input;    
    }

    console.log(`********************\n`);
    console.log(`Your movie info:`);

    request('http://www.omdbapi.com/?t=' + movie + '&apikey=4d47306d', 
    function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(`\nMovie Title: ${JSON.parse(body).Title}`);
            console.log(`Release Year: ${JSON.parse(body).Year}`);
            console.log(`IMDB Rating: ${JSON.parse(body).Ratings[0].Value}`);
            console.log(`Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}`);
            console.log(`Country: ${JSON.parse(body).Country}`);
            console.log(`Language: ${JSON.parse(body).Language}`);
            console.log(`Plot: ${JSON.parse(body).Plot}`);
            console.log(`Actor(s): ${JSON.parse(body).Actors}\n`);

            var movieInfo =
            `\nmovie-this found: \n
            Title: ${JSON.parse(body).Title} \n
            Year: ${JSON.parse(body).Year} \n
            IMDB Rating: ${JSON.parse(body).Ratings[0].Value} \n
            Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value} \n
            Country:${JSON.parse(body).Country} \n
            Language: ${JSON.parse(body).Language} \n
            Plot: ${JSON.parse(body).Plot} \n
            Actor(s): ${JSON.parse(body).Actors} \n********************\n`

            fs.appendFile('log.txt', movieInfo, function (error) {
                if (error) throw error;
            });

        } else {
            return console.log('Movie not found.');
        }

    });
};

//////////////////////////////////////////////////////
function concertThis() {
    var artist = '';
    if (input === undefined) {
        console.log(`********************`);
        console.log(`Try another artist.`);
    } else {
        artist = input;
    }

    console.log(`********************\n`);
    console.log(`Your concert info:`);

    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + bandsintown, 
    function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var userArtist = JSON.parse(body);
            if (userArtist.length > 0) {
                for (i = 0; i < 1; i++) {

                    console.log(`\nArtist: ${userArtist[i].lineup[0]}`); 
                    console.log(`Venue: ${userArtist[i].venue.name}`);
                    console.log(`Venue Location: ${userArtist[i].venue.latitude},${userArtist[i].venue.longitude}`);
                    console.log(`Venue City, Country: ${userArtist[i].venue.city}, ${userArtist[i].venue.country}`);

                    var concertDate = moment(userArtist[i].datetime).format("MM/DD/YYYY hh:00 A");
                    console.log(`Date and Time: ${concertDate}\n`);

                    var concertInfo =
                    `\nconcert-this found: \n
                    Artist: ${userArtist[i].lineup[0]} \n
                    Venue: ${userArtist[i].venue.name} \n
                    Venue Location: ${userArtist[i].venue.latitude},${userArtist[i].venue.longitude} \n
                    Venue City: ${userArtist[i].venue.city}, ${userArtist[i].venue.country} \n********************\n`

                    fs.appendFile('log.txt', concertInfo, function (error) {
                        if (error) throw error;
                    });
                };

            } else {
                console.log('Concert not found!');
            };
        };
    });
};

//////////////////////////////////////////////
function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArray = data.split(',');

        command = dataArray[0];
        input = dataArray[1];

        userData(command, input);
    });
};