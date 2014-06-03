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

	var fbTestAppId = '469359109833708';
	var fbTestAppSecret ='ef6064c100048d6a7c1a0d2417fef8db';


/**************FB************************************/
   window.fbAsyncInit = function() {
     FB.init({
       appId      : fbTestAppId,  // real app id: '462337317202554',
       cookie     : true,  // enable cookies to allow the server to access 
                           // the session
       xfbml      : true,  // parse social plugins on this page
       version    : 'v2.0' // use version 2.0
     });

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
				var accessToken = response.authResponse.accessToken;

		      var exchangeUrl = "https://graph.facebook.com/oauth/access_token?client_id="+fbTestAppId+"&client_secret="+fbTestAppSecret+"&grant_type=fb_exchange_token&fb_exchange_token="+accessToken;

				$.ajax({  
					type: "GET",
					url: exchangeUrl,  
					dataType: "text",
					success: function(data)
					{ 
					 extended = data.split('=');
					 fbToken = extended['1'].replace('&expires','');

					 $('#auth-fb .auth-input').val(fbToken);

					},
					 error: function(data,error)
					{
					 console.log(error);
					}
				});
			}
			else{
				FB.login(function(resp){
					if(resp.status=='connected')
					{
						accessToken = resp.authResponse.accessToken;

				      var exchangeUrl = "https://graph.facebook.com/oauth/access_token?client_id="+fbTestAppId+"&client_secret="+fbTestAppSecret+"&grant_type=fb_exchange_token&fb_exchange_token="+accessToken;

						$.ajax({  
							type: "GET",
							url: exchangeUrl,  
							dataType: "text",
							success: function(data)
							{ 
							 extended = data.split('=');
							 fbToken = extended['1'].replace('&expires','');
							 $('#auth-fb .auth-input').val(fbToken);

							},
							 error: function(data,error)
							{
							 console.log(error);
							}
						});
					}
					else alert("Connection to Facebook failed, please try again.");

				}, {
					scope: 'read_stream',
					return_scopes:true
				});

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

		$('#finish-signup center').html("<img style='height:20px;width:20px;' src='loading.gif'/>");

		window.localStorage['FLNuser']='yes';

		var promiseQ=[];

		if(twitter_auth!='')
		{
			var twitter_promise = new Parse.Promise();
			promiseQ.push(twitter_promise);
			
			Parse.Cloud.run('TwitterAccessToken', {oVer: twitter_auth, oToken : twitterToken, oKey : twitterCKey, tSec : twitterTSecret, cSec : twitterCSecret}, {
				success: function(reply) {
					temp = reply.split('=');
					twitterToken = temp[1].split('&')[0];
					twitterTSecret = temp[2].split('&')[0];

					window.localStorage['twitterIsSynced']='yes';
					window.localStorage['twitterToken']=twitterToken;
					window.localStorage['twitterTSecret']=twitterTSecret;

					console.log("Twitter connected");
					twitter_promise.resolve("Twitter account connected");

				},
				error: function(error) {
					console.log(error);
					alert("There was an error connecting to Twitter. Please try again.");
					return;
					//twitter_promise.reject("Failed to connect to Twitter");
				}
			});
		}
		else window.localStorage['twitterIsSynced']='no';
		
		if(tumblr_auth!='')
		{
			var tumblr_promise = new Parse.Promise();
			promiseQ.push(tumblr_promise);

			Parse.Cloud.run('TumblrAccessToken', {oVer: tumblr_auth, oToken : tumblrToken, oKey : tumblrCKey, tSec : tumblrTSecret, cSec : tumblrCSecret}, {
				success: function(reply) {
					temp = reply.split('=');
					tumblrToken = temp[1].split('&')[0];
					tumblrTSecret = temp[2].split('&')[0];

					window.localStorage['tumblrIsSynced']='yes';
					window.localStorage['tumblrToken']=tumblrToken;
					window.localStorage['tumblrTSecret']=tumblrTSecret;
					
					console.log("Tumblr connected");
					tumblr_promise.resolve("Tumblr account connected");
				},
				error: function(error) {
					console.log(error);
					alert("There was an error connecting to Tumblr. Please try again.");
					return;
					//twitter_promise.reject("Failed to connect to Twitter");
				}
			});
		}
		else window.localStorage['tumblrIsSynced']='no';

		if(fb_auth!='')
		{
			window.localStorage['fbIsSynced']='yes';
			window.localStorage['fbToken']=fbToken;
		}
		else window.localStorage['fbIsSynced']='no';

		Parse.Promise.when(promiseQ).then(function(args){
			console.log("Finished signing up");
			window.location.href = 'index.html';
		});

	});

});
