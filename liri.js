

var fs = require('fs');
var request = require('request');
var keys = require("./keys.js");
var twitter = require('twitter');
var Spotify = require('node-spotify-api');

var nodeArgs = process.argv;
var queryType = process.argv[2];

var songName = "";
var movieName = "";

var hamfist = "spotify-this-song";



switch(queryType){

	case "my-tweets":
		tweets();
		break;

	case "spotify-this-song":
		spots();
		break;

	case "movie-this":
		films();
		break;

	case "do-what-it-says":
		texts();
		break;

	default:
		console.log("Options:");
		console.log("\'my-tweets\' brings up the last 20 tweets on the dummy Twitter account.");
		console.log("\'spotify-this-song <songname>\' gets Spotify data for the chosen song.");
		console.log("\'movie-this <moviename>\' gets OMDB data for the chosen movie.");
		console.log("\'do-what-it-says\' gets Spotify data for a song I would give anything to forget.");
};



function tweets(){

	var client = new twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});
	var params = {screen_name: "VARutgersBCS"}


	client.get("statuses/user_timeline/", params, function(error, tweets, response){

		if (!error) {

			for(var i = 0; i < tweets.length && i < 20; i++) {
				console.log(tweets[i].user.screen_name + ": " + tweets[i].text);
				console.log(tweets[i].created_at);
			}
		} else {
			console.log(error);
		}

	});
};



function spots(songName){

	var spotify = new Spotify({
		id: "5649455098d640baa231097b878b1e47",
		secret: "126590baf21b4b8f9669da5bbd88fca4"
	});

	songName = "";

	for (var i = 3; i < nodeArgs.length; i++) {

	  if (i > 3 && i < nodeArgs.length) {
	  	songName = songName + " " + nodeArgs[i];

	  } else {
	  	songName += nodeArgs[i];
  	  }
	};


   if (nodeArgs[3] === undefined) {
    songName = "The Sign";
   };


	spotify.search({ type: 'track', query: songName }, function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		} else {
  			console.log("Artist: " + data.tracks.items[0].artists[0].name);
  			console.log("Track: " + data.tracks.items[0].name);
  			console.log("Album: " + data.tracks.items[0].album.name);
  			console.log("Preview Link: " + data.tracks.items[0].preview_url);  		
  		}
 
 	});
};



function films(movieName){

	movieName = "";

	for (var j = 3; j < nodeArgs.length; j++) {

	  if (j > 3 && j < nodeArgs.length) {
	  	movieName = movieName + "+" + nodeArgs[j];

	  } else {
	  	movieName += nodeArgs[j];
  	  }
	};

	if (nodeArgs[3] === undefined) {
    	movieName = "Mr Nobody";
  	}

 	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=40e9cece";

 	request(queryUrl, function(error, response, body) {

		if (!error && response.statusCode === 200) {
			console.log("Title: " + JSON.parse(body).Title);
			console.log("Year: " + JSON.parse(body).Year);
			console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
			console.log("Country of Origin: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
			console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
		} else {
			console.log("Error :"+ error);
			return;
		};
	});
};


function texts(){

	fs.readFile("random.txt", "utf8", function(error, data) {
	
		var readArray = data.split(",");

		if (readArray[0] = hamfist){
			nodeArgs[3] = readArray[1];
			spots();
		}

	});
};