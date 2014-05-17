$(document).ready(function(){

	

	var cKey = "Ku3MsRCDG1GZI2Gdb3hggjTw5";
	var cSecret = "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk";


	var token = "2477479568-98cCXgJEWokohC7vFPbRiTDBTUEjgrZBEJk5S6J";
	var tSecret = "iGTJ60sZuELJybNfsvmgFGekI9mgx2soHCrkIbGSDZf1J";

	var cb = new Codebird;
	cb.setConsumerKey(cKey, cSecret);
	cb.setToken(token,tSecret);


	$('#view').click(function(){

		$('#display-tweets').html('');
		Parse.Cloud.run('Timeline', {oToken : token, oKey : cKey, tSec : tSecret, cSec : cSecret}, {
			success: function(tweets) {
				tweets = JSON.parse(tweets);		

				for(i=0;i<tweets.length;i++)
				{
					//turn this into something better
					var time = tweets[i]['created_at'].toString();
					time = time.substring(0,20);

					var message = tweets[i]['text'];
					var id = tweets[i]['id_str'];
					var hours = $('#time-range').val();  //change hours
					var imghtml = '';
					if(tweets[i]['entities']['media'])
					{
						imgsrc = tweets[i]['entities']['media'][0]['media_url'];
						imghtml = "<img class='twitpic' src='"+imgsrc+"'/><br/>";
					}

					if(inRange(tweets[i],hours))
					{
						var tweetHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='twitter_logo.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+time+"</span><br/>"+imghtml+message+"</p></div><div class='col-xs-1 delete-box'><input type='checkbox' name='"+id+"'/></div></div>";
						$('#display-tweets').append(tweetHTML);
					}
			    }
			},
			error: function(error) {
				alert("There was an error getting tweets.");
	
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

		 		Parse.Cloud.run('DeleteTweet', {id : delete_id, oToken : token, oKey : cKey, tSec : tSecret, cSec : cSecret}, {
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

	function inRange(tweet,hours){

		var currentTime  = new Date();
		
		var sec = currentTime.valueOf();
		
		var x_hours_difference = sec - last_x_hours_to_second;
		var x_hours_before = new Date(x_hours_difference);
		//console.log(two_hours_before);

		var time = tweet['created_at'].toString();
		//console.log(time);
		var s = time.split(" ",6);
		// console.log(s[1]+" "+s[2]+", "+s[5]+" "+s[3]);
		// var s2 = s[3].split(":");
		// console.log(s2[0],s2[1],s2[2]);
		var s3 = new Date(s[1]+" "+s[2]+", "+s[5]+" "+s[3]);
		var s4 = s3.valueOf();

		var last_x_hours_to_second = 1000*hours*60*60;
		var seconds_difference =  s4 - last_x_hours_to_second;

		var x_hour_before = new Date(seconds_difference);
		
		if( currentTime - last_x_hours_to_second < s4  ) return true;
		else return false;
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
		// 		}
		// 	}

		// );
		//

				// cb.__call(
				//    "oauth_authorize",
				//    {},
				//    function (auth_url) {
				//    	console.log(auth_url);
				//    	//this gets blocked as popup in mobile
				//    	//window.codebird_auth = window.open(auth_url);

				//    }
				// );



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

		// cb.__call(
	 //    "oauth_requestToken",
	 //    {oauth_callback: "oob"},
	 //    function (reply) {
	 //        // stores it
	 //        cb.setToken(reply.oauth_token, reply.oauth_token_secret);

	 //        // gets the authorize screen URL
	 //        cb.__call(
	 //            "oauth_authorize",
	 //            {},
	 //            function (auth_url) {
	 //                window.codebird_auth = window.open(auth_url);
	 //            }
	 //        );
	 //    	}
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



				// Parse.Cloud.run('Authorize', {oToken : token, oKey : cKey, tSec : tSecret, cSec : cSecret}, {
				// 	success: function(auth_url) {
				// 		console.log("Auth url: "+ response);


				// 	},
				// 	error: function(error) {
				// 		console.log("There was an error Authorizing.");
				// 	}
				// });