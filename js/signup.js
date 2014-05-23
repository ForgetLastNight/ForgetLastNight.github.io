$(document).ready(function(){

	var twitterCKey = "Ku3MsRCDG1GZI2Gdb3hggjTw5";
	var twitterCSecret = "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk";
	var twitterToken = "";
	var twitterTSecret = "";

	var tumblrCKey = "dHGh4mCQc2AdnxuvwBEttGsTHh0YuM0ovYWchcLQarvKBgdrk7";
	var tumblrCSecret = "bzsR5lDUt6HETXIm4ZqmjBxwfygc3enc9ybBW226K5bGgcBwr8";
	var tumblrToken = "";
	var tumblrTSecret = "";


	$('#get-twitter').click(function(){
		Parse.Cloud.run('TwitterRequestToken', {oKey : twitterCKey, cSec : twitterCSecret, oCall : 'oob'}, {
			success: function(reply) {
				temp = reply.split('=');
				twitterToken = temp[1].split('&')[0];
				twitterTSecret = temp[2].split('&')[0];

				//not sure why we would need oauth/authorize call
				window.open("https://api.twitter.com/oauth/authorize?oauth_token="+twitterToken,"_blank");


			},
			error: function(error) {
				alert("There was an error getting access to Twitter.")
			}
		});
	});

	$('#get-tumblr').click(function(){
		Parse.Cloud.run('TumblrRequestToken', {oKey : tumblrCKey, cSec : tumblrCSecret, oCall : 'https://forgetlastnight.github.io/tumblr_auth.html?'}, {
			success: function(reply) {
				temp = reply.split('=');
				tumblrToken = temp[1].split('&')[0];
				tumblrTSecret = temp[2].split('&')[0];

				//not sure why we would need oauth/authorize call
				window.open("https://tumblr.com/oauth/authorize?oauth_token="+tumblrToken);
			},
			error: function(error) {
				alert("There was an error getting access to Tumblr")
			}
		});

	});


	$('#finish-signup').click(function(){





		var twitter_auth = $('#auth-twitter .auth-input').val();
		var tumblr_auth = $('#auth-tumblr .auth-input').val();
		var fb_auth = $('#auth-fb .auth-input').val();

		//submit all the stuff and save the resulting tokens

		//go to homepage

	});
});


	// });

	// $('#submit-twitter').click(function(){

	// 	var twitterOVerifier = $('#pinfield-twitter').val();
		
	// 	Parse.Cloud.run('TwitterAccessToken', {oVer: twitterOVerifier, oToken : twitterToken, oKey : twitterCKey, tSec : twitterTSecret, cSec : twitterCSecret}, {
	// 		success: function(reply) {
	// 			temp = reply.split('=');
	// 			twitterToken = temp[1].split('&')[0];
	// 			twitterTSecret = temp[2].split('&')[0];

	// 			alert("Successfully connected to Twitter.");

	// 		},
	// 		error: function(error) {
	// 			console.log(error);
	// 		}
	// 	});
	// });


	// $('#submit-tumblr').click(function(){

	// 	var tumblrOVerifier = $('#verif-tumblr').val();

	// 	Parse.Cloud.run('TumblrAccessToken', {oVer: tumblrOVerifier, oToken : tumblrToken, oKey : tumblrCKey, tSec : tumblrTSecret, cSec : tumblrCSecret}, {
	// 		success: function(reply) {
	// 			temp = reply.split('=');
	// 			tumblrToken = temp[1].split('&')[0];
	// 			tumblrTSecret = temp[2].split('&')[0];
	// 			console.log("Hoda token: "+tumblrToken);
	// 			console.log("Hoda secret: "+tumblrTSecret);
	// 			alert("Successfully connected to Tumblr.");

	// 		},
	// 		error: function(error) {
	// 			console.log(error);
	// 		}
	// 	});



	// });
