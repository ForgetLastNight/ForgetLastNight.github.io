$(document).ready(function(){

	var twitterCKey = "Ku3MsRCDG1GZI2Gdb3hggjTw5";
	var twitterCSecret = "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk";
	var twitterToken = "";
	var twitterTSecret = "";

	var tumblrCKey = "dHGh4mCQc2AdnxuvwBEttGsTHh0YuM0ovYWchcLQarvKBgdrk7";
	var tumblrCSecret = "bzsR5lDUt6HETXIm4ZqmjBxwfygc3enc9ybBW226K5bGgcBwr8";
	var tumblrToken = "";
	var tumblrTSecret = "";

	var fbAppId = '462337317202554';
	var fbAppSecret ='150d44a12970f12e3dd85c256e5a90fa';
	var fbToken = "";

/**************FB************************************/

	function extendToken(res)
	{
		accessToken = res.authResponse.accessToken;
		console.log("initial access token: "+ accessToken);

		try{
	      var exchangeUrl = "https://graph.facebook.com/oauth/access_token?client_id="+fbAppId+"&client_secret="+fbAppSecret+"&grant_type=fb_exchange_token&fb_exchange_token="+accessToken;
			$.ajax({  
				type: "GET",
				url: exchangeUrl,  
				dataType: "text",
				success: function(data)
				{ 
				 extended = data.split('=');
				 longToken = extended['1'].replace('&expires','');
				 console.log("longToken is "+longToken);
				 return longToken;
				},
				 error: function(data,error)
				{
				 console.log(error);
				 return;
				}
			});
		} catch (err){console.log(err.message);}
	}

   // // This is called with the results from from FB.getLoginStatus().
   // function statusChangeCallback(response) {
   //   console.log('statusChangeCallback');
   //   console.log(response);

   //   // The response object is returned with a status field that lets the
   //   // app know the current login status of the person.
   //   // Full docs on the response object can be found in the documentation
   //   // for FB.getLoginStatus().
   //   if (response.status === 'connected') {
   //     // Logged into your app and Facebook.
   //     var appid       = '462337317202554';
   //     var appsecret   = '150d44a12970f12e3dd85c256e5a90fa';

   //     var exchangeUrl = "https://graph.facebook.com/oauth/access_token?client_id="+appid+"&client_secret="+appsecret+"&grant_type=fb_exchange_token&fb_exchange_token="+accessToken;

   //     $.ajax({  
   //       type: "GET",
   //       url: exchangeUrl,  
   //       dataType: "text",
   //       success: function(data)
   //       { 
   //        extended = data.split('=');
   //        longToken = extended['1'].replace('&expires','');
   //       },
   //        error: function(data,error)
   //       {
   //        console.log(error);
   //       }
   //     });

   //   } else if (response.status === 'not_authorized') {
   //     console.log("The person is logged into Facebook, but not your app");
      
   //   } else {
   //     console.log("The person is not logged into Facebook, so we're not sure if they are logged into this app or not");

   //   }
   // }

   // // This function is called when someone finishes with the Login
   // // Button.  See the onlogin handler attached to it in the sample
   // // code below.
   // function checkLoginState() {

   // }

   window.fbAsyncInit = function() {
     FB.init({
       appId      : '462337317202554',
       cookie     : true,  // enable cookies to allow the server to access 
                           // the session
       xfbml      : true,  // parse social plugins on this page
       version    : 'v2.0' // use version 2.0
     });

     // Now that we've initialized the JavaScript SDK, we call 
     // FB.getLoginStatus().  This function gets the state of the
     // person visiting this page and can return one of three states to
     // the callback you provide.  They can be:
     //
     // 1. Logged into your app ('connected')
     // 2. Logged into Facebook, but not your app ('not_authorized')
     // 3. Not logged into Facebook and can't tell if they are logged into
     //    your app or not.
     //
     // These three cases are handled in the callback function.

     // FB.getLoginStatus(function(response) {
     //   statusChangeCallback(response);
     // });

   };

   // Load the SDK asynchronously
   (function(d, s, id) {
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) return;
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
/*****************************END FB***********************/

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

		FB.getLoginStatus(function(response) {
			if(response.status=='connected')
			{
				//get token and save it function
				fbToken = extendToken(response);
				//put it in a new window like the others?
			}
			else{
				FB.login(function(resp){
					if(resp.status=='connected')
					{
						fbToken = extendToken(resp);

					}
					else alert("Connection to Facebook failed, please try again.")

				}, {scope: 'public_profile'});

			}

		});

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
