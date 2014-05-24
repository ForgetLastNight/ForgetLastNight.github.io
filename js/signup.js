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

		if(twitter_auth!='')
		{

			Parse.Cloud.run('TwitterAccessToken', {oVer: twitter_auth, oToken : twitterToken, oKey : twitterCKey, tSec : twitterTSecret, cSec : twitterCSecret}, {
				success: function(reply) {
					temp = reply.split('=');
					twitterToken = temp[1].split('&')[0];
					twitterTSecret = temp[2].split('&')[0];

					window.localStorage['twitterIsSynced']='yes';
					window.localStorage['twitterToken']=twitterToken;
					window.localStorage['twitterTSecret']=twitterTSecret;

					alert("Successfully connected to Twitter.");

				},
				error: function(error) {
					console.log(error);
					alert("There was an error connecting to Twitter. Please try again.");
				}
			});
		}
		
		if(tumblr_auth!='')
		{
			Parse.Cloud.run('TumblrAccessToken', {oVer: tumblr_auth, oToken : tumblrToken, oKey : tumblrCKey, tSec : tumblrTSecret, cSec : tumblrCSecret}, {
				success: function(reply) {
					temp = reply.split('=');
					tumblrToken = temp[1].split('&')[0];
					tumblrTSecret = temp[2].split('&')[0];

					window.localStorage['tumblrIsSynced']='yes';
					window.localStorage['tumblrToken']=tumblrToken;
					window.localStorage['tumblrTSecret']=tumblrTSecret;
					alert("Successfully connected to Tumblr.");
				},
				error: function(error) {
					console.log(error);
					alert("There was an error connecting to Tumblr. Please try again.");
				}
			});
		}

		//how to make sure all async calls are finished?
		window.localStorage['FLNuser']='yes';

	});





	var GTOKEN;

	window.fbAsyncInit = function() {
		FB.init({
			appId      : '462337317202554',
			xfbml      : true,
			version    : 'v2.0'
		});
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	}

	//Load the SDK asynchronously
	(function(d){
		var js, id = 'facebook-jssdk', 
		ref = d.getElementsByTagName('script')[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement('script'); 
		js.id = id; js.async = true;
		js.src = "https://connect.facebook.net/en_US/all.js";
		ref.parentNode.insertBefore(js, ref);
	}(document));


	function statusChangeCallback(response) {
		console.log('statusChangeCallback');
		console.log(response);
	    //console.log(response['authResponse']['accessToken']);
	    GTOKEN = response['authResponse']['accessToken'];

	    // The response object is returned with a status field that lets the
	    // app know the current login status of the person.
	    // Full docs on the response object can be found in the documentation
	    // for FB.getLoginStatus().
	    if (response.status === 'connected') {
	      // Logged into your app and Facebook.
	      testAPI();


	  } else if (response.status === 'not_authorized') {
	      // The person is logged into Facebook, but not your app.
	      document.getElementById('status').innerHTML = 'Please log ' +
	      'into this app.';
	  } else {
	      // The person is not logged into Facebook, so we're not sure if
	      // they are logged into this app or not.
	      document.getElementById('status').innerHTML = 'Please log ' +
	      'into Facebook.';
	  }
	}

	function testAPI(){

		FB.login(function(response) {
			if (response.authResponse) {

	        var accessToken = GTOKEN;
	        var appid       = '462337317202554';
	        var appsecret   = '150d44a12970f12e3dd85c256e5a90fa';
	        
	        var exchangeUrl = "https://graph.facebook.com/oauth/access_token?client_id="+appid+"&client_secret="+appsecret+"&grant_type=fb_exchange_token&fb_exchange_token="+accessToken;
	       // console.log(exchangeUrl);
	       	$.ajax({  
		       	type: "GET",
		       	url: exchangeUrl,  
		       	dataType: "text",
		       	success: function(data)
		       	{ 
		       		extended = data.split('=');
		       		extendedAT = extended['1'].replace('&expires','');
		           //console.log(extendedAT);
		           //console.log(data);
		           GTOKEN = extendedAT;
		           console.log("your access token is : "+GTOKEN);
		           window.localStorage['GTOKEN']=GTOKEN;

	       		},
					error: function(data,error)
					{
						console.log(error);
					}
	   		});

	  		}
		});
	}


});
