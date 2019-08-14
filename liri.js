// Set up "needs" and APIs
require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var omdb = (keys.omdb);
var bandsintown = (keys.bandsintown);

var request = require("request");
var moment = require("moment");
var fs = require("fs");

// User input
var command = process.argv[2];
var input = process.argv.slice(3).join(" ");

// Set up commands
