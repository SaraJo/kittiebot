var twitter = require('ntwitter')
	, fs = require('fs')
	, j5 = require('johnny-five');


var twit = new twitter({
	consumer_key: 'oXAbKQyQ47h9CBVXmMGdQ',
      consumer_secret: 'z9EqbFpf4dhNuY6M1Eawk3W2dwnt9B1PoQRAMyWtxTU',
      access_token_key: '15524875-L916RzSGVMqi1DlZz4MiB7RCgsWhuKSsD9T7Pn5i1',
      access_token_secret: 'GLMDBi2NFYl3eZmUZ4zmhphDMozXesMN16DI9NOaIo'
	
});

var words = fs.readFileSync('words_clean.txt').toString()
	, wordMap = {}
	, splitWords = words.split("\n")
	, board = new j5.Board();

//put all the words into an object
for(var i = 0; i < splitWords.length; i++){
	var line = splitWords[i]
	var compactLineArr = line.replace(/\s+/g, " ").split(' ')
	var score = compactLineArr[0];
	var word = compactLineArr[1];
	// Assuming that none of our words are reserved words like "prototype"
	wordMap[word] = score
}


board.on("ready", function(){


//setup LEDs
	var blue = new j5.Led(9)
		, red = new j5.Led(10)
		, green = new j5.Led(11);




//get sentiment 
var sentiment = function(tweetScore, tweet){
console.log("made it to sentiment");
	for(var i = 0; i < tweet.length; i++){
			var word = tweet[i];
			if(wordMap[word.toLowerCase()]) {
				console.log("Word: " + word + " / score: " + wordMap[word.toLowerCase()]);
				tweetScore += parseFloat(wordMap[word.toLowerCase()]);
				if(tweetScore > 0){
				  red.off();
			           blue.on();
			 	  green.off();	   
				}
				else if (tweetScore < -1){
				   red.on();
				   green.on();
				   blue.off();
				
				}
				else if (tweetScore < 0){
				  red.off();
			 	  blue.off();	 
				  green.on();
				}
				
			} 
			
		}



}

//ping twitter 
	twit.stream('statuses/filter', { 'follow' : '1912289796'}, 
	  function(stream) {
	  	stream.on('data', function (data) {
		var tweet = data.text.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").split(' ')
			, tweetScore = 0;
		
		
			sentiment(tweetScore, tweet);

				}
			)
	  })
})


