$(document).ready(function(){

	var twitterCKey = "Ku3MsRCDG1GZI2Gdb3hggjTw5";
	var twitterCSecret = "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk";

	var tumblrCKey = "dHGh4mCQc2AdnxuvwBEttGsTHh0YuM0ovYWchcLQarvKBgdrk7";
	var tumblrCSecret = "bzsR5lDUt6HETXIm4ZqmjBxwfygc3enc9ybBW226K5bGgcBwr8";


	//do a parse call here to check if the current user has a token
	// if so set it to this

	var twitterToken = "";
	var twitterTSecret = "";

	var tumblrToken = "";
	var tumblrTSecret = "";
	

	//need to only do this if not already authorized 
	//(use parse to check for key?)

	// $('#getpin').click(function(){

		// Parse.Cloud.run('TwitterRequestToken', {oKey : twitterCKey, cSec : twitterCSecret, oCall : 'oob'}, {
		// 	success: function(reply) {
		// 		temp = reply.split('=');
		// 		twitterToken = temp[1].split('&')[0];
		// 		twitterTSecret = temp[2].split('&')[0];

		// 		//not sure why we would need oauth/authorize call
		// 		window.open("https://api.twitter.com/oauth/authorize?oauth_token="+twitterToken,"_blank");


		// 	},
		// 	error: function(error) {
		// 		alert("There was an error getting access.")
		// 	}
		// });


		// Parse.Cloud.run('TumblrRequestToken', {oKey : tumblrCKey, cSec : tumblrCSecret, oCall : 'https://forgetlastnight.github.io/index.html?userid=12345'}, {
		// 	success: function(reply) {
		// 		temp = reply.split('=');
		// 		tumblrToken = temp[1].split('&')[0];
		// 		tumblrTSecret = temp[2].split('&')[0];

		// 		//not sure why we would need oauth/authorize call
		// 		window.open("https://tumblr.com/oauth/authorize?oauth_token="+tumblrToken);


		// 	},
		// 	error: function(error) {
		// 		alert("There was an error getting access to Tumblr")
		// 	}
		// });
 // var access_token1;
//  window.fbAsyncInit = function() {
//   FB.init({
//     appId      : '462337317202554',
//     xfbml      : true,
//     version    : 'v2.0'
//   });
//   FB.getLoginStatus(function(response) {
//       statusChangeCallback(response);
//     });
// }



// Load the SDK asynchronously
  // (function(d){
  //   var js, id = 'facebook-jssdk', 
  //   ref = d.getElementsByTagName('script')[0];
  //   if (d.getElementById(id)) {return;}
  //   js = d.createElement('script'); 
  //   js.id = id; js.async = true;
  //   js.src = "https://connect.facebook.net/en_US/all.js";
  //   ref.parentNode.insertBefore(js, ref);
  // }(document));


  // function statusChangeCallback(response) {
  //   console.log('statusChangeCallback');
  //   console.log(response);
  //   //console.log(response['authResponse']['accessToken']);
  //   access_token1 = response['authResponse']['accessToken'];

  //   // The response object is returned with a status field that lets the
  //   // app know the current login status of the person.
  //   // Full docs on the response object can be found in the documentation
  //   // for FB.getLoginStatus().
  //   if (response.status === 'connected') {
  //     // Logged into your app and Facebook.
  //     testAPI();
     
    
  //   } else if (response.status === 'not_authorized') {
  //     // The person is logged into Facebook, but not your app.
  //     document.getElementById('status').innerHTML = 'Please log ' +
  //       'into this app.';
  //   } else {
  //     // The person is not logged into Facebook, so we're not sure if
  //     // they are logged into this app or not.
  //     document.getElementById('status').innerHTML = 'Please log ' +
  //       'into Facebook.';
  //   }
  // }
FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    // the user is logged in and has authenticated your
    // app, and response.authResponse supplies
    // the user's ID, a valid access token, a signed
    // request, and the time the access token 
    // and signed request each expire
    var uid = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
    console.log(uid,accessToken);
    //testAPI();
  } else if (response.status === 'not_authorized') {
    // the user is logged in to Facebook, 
    // but has not authenticated your app
  } else {
    // the user isn't logged in to Facebook.
  }
 });

//   function testAPI() {


//     // FB.login(function(response) {
//     //   if (response.authResponse) {



//         var accessToken = access_token1;
//         //console.log(accessToken);
//         var appid       = '462337317202554';
//         var appsecret   = '150d44a12970f12e3dd85c256e5a90fa';
        
//         var exchangeUrl = "https://graph.facebook.com/oauth/access_token?client_id="+appid+"&client_secret="+appsecret+"&grant_type=fb_exchange_token&fb_exchange_token="+accessToken;
//        // console.log(exchangeUrl);
//         $.ajax({  
//           type: "GET",
//           url: exchangeUrl,  
//           dataType: "text",
//           success: function(data)
//           { 
//            extended = data.split('=');
//            extendedAT = extended['1'].replace('&expires','');
//            //console.log(extendedAT);
//            //console.log(data);
//             access_token1 = extendedAT;
//             alert("your access token is : "+access_token1);

//          },
//          error: function(data,error)
//          {
//           console.log(error);
//          }

//        });

        
//         // user is logged in and granted some permissions.
//         FB.login(function(){
//           FB.api('/me/feed', 'post', {message: 'Brian is here for the third time'});

//           FB.api(
//             'me/feed',
//             'get',
//             {
//               access_token : access_token1,
//             },
//             function(response) {
//               console.log(response);
//               console.log(response['data'][0]['created_time']);
//               console.log(response['data'][0]['message']);
//             }
//             );

//         }, {scope: 'publish_actions'});



//       //}
//     //});
// }


	// })

	$('#submit-twitter').click(function(){

		var twitterOVerifier = $('#pinfield-twitter').val();
		
		Parse.Cloud.run('TwitterAccessToken', {oVer: twitterOVerifier, oToken : twitterToken, oKey : twitterCKey, tSec : twitterTSecret, cSec : twitterCSecret}, {
			success: function(reply) {
				temp = reply.split('=');
				twitterToken = temp[1].split('&')[0];
				twitterTSecret = temp[2].split('&')[0];

				alert("Successfully connected to Twitter.");

			},
			error: function(error) {
				console.log(error);
			}
		});
	});


	$('#submit-tumblr').click(function(){

		var tumblrOVerifier = $('#verif-tumblr').val();

		Parse.Cloud.run('TumblrAccessToken', {oVer: tumblrOVerifier, oToken : tumblrToken, oKey : tumblrCKey, tSec : tumblrTSecret, cSec : tumblrCSecret}, {
			success: function(reply) {
				temp = reply.split('=');
				tumblrToken = temp[1].split('&')[0];
				tumblrTSecret = temp[2].split('&')[0];
				console.log("Hoda token: "+tumblrToken);
				console.log("Hoda secret: "+tumblrTSecret);
				alert("Successfully connected to Tumblr.");

			},
			error: function(error) {
				console.log(error);
			}
		});



	});


	

	$('#view').click(function(){

		$('#display-media').html('');

		Parse.Cloud.run('Timeline', {oToken : twitterToken, oKey : twitterCKey, tSec : twitterTSecret, cSec : twitterCSecret}, {
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
						var tweetHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='twitter_logo.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+time+"</span><br/>"+imghtml+message+"</p></div><div class='col-xs-1 delete-box delete-twitter'><input type='checkbox' name='"+id+"'/></div></div>";
						$('#display-media').append(tweetHTML);
					}
			    }
			},
			error: function(error) {
				alert("There was an error getting tweets.");
			}
		});

		
		Parse.Cloud.run('GetTumblrUserInfo', {oToken : tumblrToken, oKey : tumblrCKey, tSec : tumblrTSecret, cSec : tumblrCSecret}, {
			success: function(result) {
				info = JSON.parse(result);

				blogname = info.response.user.blogs[0].name+".tumblr.com";


				Parse.Cloud.run('GetTumblrPosts', {oToken : tumblrToken, oKey : tumblrCKey, tSec : tumblrTSecret, cSec : tumblrCSecret, bName: blogname}, {
					success: function(results) {
						results = JSON.parse(results);

						posts = results['response']['posts'];


						for(var i=0;i<posts.length;i++)
						{
							time = posts[i]['date'];
							title=posts[i]['title']?posts[i]['title']:"No Title";
							message = posts[i]['body'];
							id = String(posts[i]['id']);

							var tumblrHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='tumblr-logo.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+time+"</span><br/>"+title+"<br/>"+message+"</p></div><div class='col-xs-1 delete-box delete-tumblr'><input type='checkbox' name='"+id+"'/></div></div>";
							$('#display-media').append(tumblrHTML);
						}

					},
					error: function(error) {
						console.log(error);
					}
				});


			},
			error: function(error) {
				console.log(error);
			}
		});



	});


	$('#forget').click(function(){

		var checkboxes_twitter = $('#display-media .delete-twitter input');

		for(var i = 0;i<checkboxes_twitter.length;i++)
		{
			if(checkboxes_twitter[i]['checked'])
			{
				var delete_id_tw = checkboxes_twitter[i]['name'];

		 		Parse.Cloud.run('DeleteTweet', {id : delete_id_tw, oToken : twitterToken, oKey : twitterCKey, tSec : twitterTSecret, cSec : twitterCSecret}, {
		 			success: function(results){

		 				alert("Last night's tweets never happened!");

		 			},
		 			error: function(error){
		 				alert("Failed to delete tweet "+delete_id_tw);
		 			}
		 		});


			}
		}

		var checkboxes_tumblr = $('#display-media .delete-tumblr input');

		for(var i = 0;i<checkboxes_tumblr.length;i++)
		{
			if(checkboxes_tumblr[i]['checked'])
			{
				var delete_id_tm = checkboxes_tumblr[i]['name'];

				Parse.Cloud.run('TumblrDeletePost', {id: delete_id_tm, oToken : tumblrToken, oKey : tumblrCKey, tSec : tumblrTSecret, cSec : tumblrCSecret, bName: blogname}, {
					success: function(msg) {
						alert("Last night's tumblr blog never happened!");
					},
					error: function(err) {
						console.log(err);
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


		var time = tweet['created_at'].toString();

		var s = time.split(" ",6);

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
