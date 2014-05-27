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
		Parse.Cloud.run('TwitterRequestToken', {oKey : twitterCKey, cSec : twitterCSecret, oCall : 'https://forgetlastnight.github.io/twitter_auth.html?'}, {
			success: function(reply) {
				temp = reply.split('=');
				twitterToken = temp[1].split('&')[0];
				twitterTSecret = temp[2].split('&')[0];

				auth_url = "https://api.twitter.com/oauth/authorize?oauth_token="+twitterToken;

				$.prompt("<a href='"+auth_url+"' target='_blank'>Get Twitter code</a>",{
					title: "Follow the link below!",
					buttons: {"Done":true}
				});
				 //  window.open("https://api.twitter.com/oauth/authorize?oauth_token="+twitterToken,"_blank");

				
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

				//window.open("https://tumblr.com/oauth/authorize?oauth_token="+tumblrToken);
				auth_url = "https://tumblr.com/oauth/authorize?oauth_token="+tumblrToken;
				$.prompt("<a href='"+auth_url+"' target='_blank'>Get Tumblr code</a>",{
					title: "Follow the link below!",
					buttons: {"Done":true}
				});				
			},
			error: function(error) {
				alert("There was an error getting access to Tumblr")
			}
		});

	});


	$('#get-fb').click(function(){
		FB.login(function(response){
			console.log(response);
		}, {scope: 'public_profile'});

	});


	$('#finish-signup').click(function(){

		var twitter_auth = $('#auth-twitter .auth-input').val();
		var tumblr_auth = $('#auth-tumblr .auth-input').val();
		var fb_auth = $('#auth-fb .auth-input').val();

		if(twitter_auth==''&&tumblr_auth==''&&fb_auth==''){
			alert("You did not connect with any apps. Please enter one or more authentication codes.")
			return;
		}

		$('#finish-signup').css({"display":"none"});
		$('#after-submit').css({"display":"inline"});

		if(twitter_auth!='')
		{
			$('#twitter-ready').css({"display":"inline"});
			Parse.Cloud.run('TwitterAccessToken', {oVer: twitter_auth, oToken : twitterToken, oKey : twitterCKey, tSec : twitterTSecret, cSec : twitterCSecret}, {
				success: function(reply) {
					temp = reply.split('=');
					twitterToken = temp[1].split('&')[0];
					twitterTSecret = temp[2].split('&')[0];

					window.localStorage['twitterIsSynced']='yes';
					window.localStorage['twitterToken']=twitterToken;
					window.localStorage['twitterTSecret']=twitterTSecret;

					$('#twitter-ready').css({'opacity':'1.0'});

				},
				error: function(error) {
					console.log(error);
					alert("There was an error connecting to Twitter. Please try again.");
				}
			});
		}
		else window.localStorage['twitterIsSynced']='no';
		
		if(tumblr_auth!='')
		{
			$('#tumblr-ready').css({"display":"inline"});
			Parse.Cloud.run('TumblrAccessToken', {oVer: tumblr_auth, oToken : tumblrToken, oKey : tumblrCKey, tSec : tumblrTSecret, cSec : tumblrCSecret}, {
				success: function(reply) {
					temp = reply.split('=');
					tumblrToken = temp[1].split('&')[0];
					tumblrTSecret = temp[2].split('&')[0];

					window.localStorage['tumblrIsSynced']='yes';
					window.localStorage['tumblrToken']=tumblrToken;
					window.localStorage['tumblrTSecret']=tumblrTSecret;
					$('#tumblr-ready').css({'opacity':'1.0'});
				},
				error: function(error) {
					console.log(error);
					alert("There was an error connecting to Tumblr. Please try again.");
				}
			});
		}
		else window.localStorage['tumblrIsSynced']='no';

		//how to make sure all async calls are finished?
		window.localStorage['FLNuser']='yes';
		// window.localStorage['fbIsSynced']='yes';
		// window.localStorage['GTOKEN']=GTOKEN;
	});

});
