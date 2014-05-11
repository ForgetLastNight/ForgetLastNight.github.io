$(document).ready(function(){

	var cKey = "Ku3MsRCDG1GZI2Gdb3hggjTw5";
	var cSecret = "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk";

	var token = "2477479568-TGmXC5Icfc3D4o0FcRAE123jzOLjjiotstxSci8";
	var tSecret = "CpD3tJSoylobhjST78E9OW6lEdPtPg6l5KioPS378aypv";

	var cb = new Codebird;
	// cb.setConsumerKey("CONSUMERKEY", "CONSUMERSECRET");
	cb.setConsumerKey(cKey, cSecret);
	// cb.setToken("TOKEN", "TOKENSECRET");
	cb.setToken(token,tSecret);
	

	//need to only do this if not already authorized 
	//(use parse to check for key?)
	cb.__call(
    "oauth_requestToken",
    {oauth_callback: "oob"},
    function (reply) {
        // stores it
        cb.setToken(reply.oauth_token, reply.oauth_token_secret);

        // gets the authorize screen URL
        cb.__call(
            "oauth_authorize",
            {},
            function (auth_url) {
                window.codebird_auth = window.open(auth_url);
            }
        );
    	}
	);

	$('#submitpin').click(function(){

		cb.__call(
		    "oauth_accessToken",
		    {oauth_verifier: $('#PINFIELD').val()},
		    function (reply) {
		        // store the authenticated token, which may be different from the request token (!)
		        //cb.setToken(reply.oauth_token, reply.oauth_token_secret);
		        console.log(reply);
		        token = reply.oauth_token;
		        tSecret = reply.oauth_token_secret;
		        alert("Thank you. You may now use the application.")

		        // if you need to persist the login after page reload,
		        // consider storing the token in a cookie or HTML5 local storage
		    }
		);
	});


	

	$('#get').click(function(){

		Parse.Cloud.run('Timeline', {oToken : token, oKey : cKey, tSec : tSecret, cSec : cSecret}, {
			success: function(tweets) {
				tweets = JSON.parse(tweets);

				for(i=0;i<tweets.length;i++)
				{
					var time = tweets[i]['created_at'];
					var message = tweets[i]['text'];
					var id = tweets[i]['id_str'];

					var tweetHTML = "<div id='display-tweets'><div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='twitter_logo.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+time+"</span><br/>"+message+"</p></div><div class='col-xs-1 delete-box'><input type='checkbox' name='"+id+"'/></div></div></div>";
			 		
			 		$('#display-tweets').append(tweetHTML);					
				}
			},
			error: function(error) {
				alert("There was an error getting tweets.")
			}
		});

	});


	$('#forget').click(function(){

		var checkboxes_tw = $('#display-tweets .delete-box input');

		for(var i = 0;i<checkboxes_tw.length;i++)
		{
			if(checkboxes_tw[i]['checked'])
			{
				var delete_id = checkboxes_tw[i]['name'];
				console.log("Deleting tweet "+delete_id);

		 		Parse.Cloud.run('DeleteTweet', {id : delete_id}, {
		 			success: function(results){

		 				alert("Last night never happened!");

		 				location.reload();
		 			},
		 			error: function(error){
		 				alert("Failed to delete tweet "+delete_id);
		 			}
		 		});

			}
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








				// Parse.Cloud.run('Embed',{id : tweetIDs[0]}, {
				// 	success: function(result){
				// 		console.log(result);
				// 	},
				// 	error: function(err){
				// 		console.log(err);
				// 	}




				// });



					// params = {
					// 	id : tweetIDs[i]
					// };

					// cb.__call(
					// 	"statuses_oembed",
					// 	params,
					// 	function (reply) {
					// 		display = reply['html'];
					// 		display = display.replace("//platform.twitter.com/widgets.js","https://platform.twitter.com/widgets.js");
					// 		$('#display-tweets').append(display);
					// 	}
					// );



	//   window.fbAsyncInit = function()
	//   {
	//     FB.init({
	//     appId      : '462337317202554', // App ID
	//     //channelUrl :  // Channel File
	//     status     : true, // check login status
	//     cookie     : true, // enable cookies to allow the server to access the session
	//     xfbml      : true  // parse XFBML
	//     });

	//     displayFB();

	//   };

	//   // Load the SDK asynchronously
	//   (function(d){
	//     var js, id = 'facebook-jssdk', 
	//     ref = d.getElementsByTagName('script')[0];
	//     if (d.getElementById(id)) {return;}
	//     js = d.createElement('script'); 
	//     js.id = id; js.async = true;
	//     js.src = "https://connect.facebook.net/en_US/all.js";
	//     ref.parentNode.insertBefore(js, ref);
	//   }(document));


	//   function displayFB() {

	//     FB.login(function(response) {
	//       if (response.authResponse) {
	//         // user is logged in and granted some permissions.
	//         FB.api('/me/feed',
	//           function(results) {
	//             if (!results || results.error) {
	//               console.log(results.error);
	//             }
	//             else {
	//               for (var j = 0; j < 5 ; j++) //results['data'].length-2
	//               {
	//                 var time = prettyDate(results['data'][j]['created_time']);
	//                 var type = results['data'][j]['type'];
	//                 type = type.charAt(0).toUpperCase() + type.slice(1);
	//                 var message = results['data'][j]['message'];

	//                 var fbpost = "<div class='panel panel-primary fb-box'><div class='panel-heading'><img class = 'fb-logo' src='facebook-icon.png'/><span class='fb-time'>"+time+"</span> (<span class='fb-type'>"+type+"</span>)</div><div class='panel-body'><span class='fb-body'>"+message+"</span></div></div>";

	//                 console.log(fbpost);

	//                 $('#display-fb').append(fbpost);
	//               }
	//             }
	//         });
	//       } else {
	//         // User cancelled login or did not fully authorize.
	//       }
	//     }, {scope:'read_stream'});
	//   }
