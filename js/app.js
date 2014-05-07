$(document).ready(function(){


		// message = prompt("Enter tweet here");

		// Parse.Cloud.run('ShareToTwitter',{tweet: message}, {
		//   success: function(result) {
		//     console.log("Tweet posted to twitter!");
		//   },
		//   error: function(error) {
		//   }
		// });




	$('#get').click(function(){

		var s ="#mtv vine.co filter:links since:2011-11-11";
		Parse.Cloud.run('GetFromTwitter',{searchQuery : s}, {
		  success: function(result) {
		  	console.log("Tweets retrieved from twitter!");
		  },
		  error: function(error) {
		  }
		});

	});

	



});