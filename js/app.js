$(document).ready(function(){

	var cb = new Codebird;
	// cb.setConsumerKey("YOURKEY", "YOURSECRET");
	cb.setConsumerKey("Ku3MsRCDG1GZI2Gdb3hggjTw5", "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk");
	// cb.setToken("YOURTOKEN", "YOURTOKENSECRET");
	cb.setToken("2477479568-TGmXC5Icfc3D4o0FcRAE123jzOLjjiotstxSci8", "CpD3tJSoylobhjST78E9OW6lEdPtPg6l5KioPS378aypv");

	$('#get').click(function(){
		var tweetIDs = [];

		Parse.Cloud.run('Timeline', {}, {
			success: function(tweets) {
				tweets = JSON.parse(tweets);
				//console.log(tweets);
		 		for(i=0;i<tweets.length;i++) tweetIDs.push(tweets[i]['id_str']);

		 		// Parse.Cloud.run('DeleteTweet', {id : '463563539685584898'}, {
		 		// 	success: function(results){

		 		// 		console.log("Successfully deleted!");
		 		// 	},
		 		// 	error: function(error){

		 		// 	}
		 		// });


				// Parse.Cloud.run('Embed',{id : tweetIDs[0]}, {
				// 	success: function(result){
				// 		console.log(result);
				// 	},
				// 	error: function(err){
				// 		console.log(err);
				// 	}




				// });
				for(i=0;i<tweetIDs.length;i++)
				{
					params = {

						id : tweetIDs[i]

					};

					cb.__call(
						"statuses_oembed",
						params,
						function (reply) {
							display = reply['html'];
							display = display.replace("//platform.twitter.com/widgets.js","https://platform.twitter.com/widgets.js");
							$('#display-tweets').append(display);
						}
					);
				}

			},
			error: function(error) {
			}
		});


		//-----CODEBIRD TWITTER---------------------------
		// var tweetIDs = [];

		// // get home timeline of the user
		// var params = {

		// 	count : '5'

		// };
		// console.log("Getting tweets...");
		// cb.__call(
		// 	"statuses_homeTimeline",
		// 	params,
		// 	function (results) {
		// 		console.log(results[0]);
		// 		for(i=0;i<results.length;i++) tweetIDs.push(results[i]['id_str']);

		// 		// embed the tweets 
		// 		// https://api.twitter.com/1/statuses/oembed.format
		// 		console.log("Tweets received. Requesting embed service...");
		// 		for(i=0;i<tweetIDs.length;i++)
		// 		{
		// 			params = {

		// 				id : tweetIDs[i]

		// 			};

		// 			cb.__call(
		// 				"statuses_oembed",
		// 				params,
		// 				function (reply) {
		// 					display = reply['html'];
		// 					display = display.replace("//platform.twitter.com/widgets.js","https://platform.twitter.com/widgets.js");
		// 					$('#display-tweets').append(display);
		// 				}
		// 			);
		// 		}
		// 	}

		// );
		//------------END CODEBIRD-----------------------------------

	});


	// cb.__call(
	//     "statuses_destroy_ID",
	//    {id: "463741784297046016"},
	//     function (result) {
	//       alert("destroy");
	//     }
	// );

	// cb.__call(
	//     "statuses_update",
	//     {"status": "Whohoo, I just tweeted with a new key"},
	//     function (reply) {
	//         console.log(reply);
	//     }
	// );

});