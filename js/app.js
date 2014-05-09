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



	  window.fbAsyncInit = function()
	  {
	    FB.init({
	    appId      : '462337317202554', // App ID
	    //channelUrl :  // Channel File
	    status     : true, // check login status
	    cookie     : true, // enable cookies to allow the server to access the session
	    xfbml      : true  // parse XFBML
	    });

	    displayFB();

	  };

	  // Load the SDK asynchronously
	  (function(d){
	    var js, id = 'facebook-jssdk', 
	    ref = d.getElementsByTagName('script')[0];
	    if (d.getElementById(id)) {return;}
	    js = d.createElement('script'); 
	    js.id = id; js.async = true;
	    js.src = "https://connect.facebook.net/en_US/all.js";
	    ref.parentNode.insertBefore(js, ref);
	  }(document));


	  function displayFB() {

	    FB.login(function(response) {
	      if (response.authResponse) {
	        // user is logged in and granted some permissions.
	        FB.api('/me/feed',
	          function(results) {
	            if (!results || results.error) {
	              console.log(results.error);
	            }
	            else {
	              for (var j = 0; j < results['data'].length-2; j++)
	              {
	                var time = prettyDate(results['data'][j]['created_time']);
	                var type = results['data'][j]['type'];
	                type = type.charAt(0).toUpperCase() + type.slice(1);
	                var message = results['data'][j]['message'];

	                var fbpost = "<div class='panel panel-primary fb-box'><div class='panel-heading'><img class = 'fb-logo' src='facebook-icon.png'/><span class='fb-time'>"+time+"</span> (<span class='fb-type'>"+type+"</span>)</div><div class='panel-body'><span class='fb-body'>"+message+"</span></div></div>";

	                console.log(fbpost);

	                $('#display-fb').append(fbpost);
	              }
	            }
	        });
	      } else {
	        // User cancelled login or did not fully authorize.
	      }
	    }, {scope:'read_stream'});
	  }

	});




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